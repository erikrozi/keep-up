from fastapi import APIRouter, Depends, HTTPException, Header
from fastapi.encoders import jsonable_encoder

from pydantic import BaseModel
from uuid import UUID
from datetime import datetime

from supabase import create_client, Client
from pinecone import Pinecone

from ..utils.recommend import generate_recommendations

import os
import json

from ..dependencies import verify_token, SUPABASE_KEY, SUPABASE_URL
from ..utils.summarize import create_abstract_summary

router = APIRouter(
    prefix="/users",
    tags=["users"],
    dependencies=[Depends(verify_token)],
    responses={404: {"description": "Not found"}},
)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
pinecone = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
pinecone_index = pinecone.Index("specter-embeddings")

@router.get("/")
async def read_users():
    return "Get your users here!"

@router.get("/me")
async def read_users_me(user: dict = Depends(verify_token)):
    print("Test")
    return user

class View(BaseModel):
    user_id: str
    corpus_id: int

@router.post("/view")
async def post_view(view: View):
    # Add view to Supabase
    try:
        view_data = {
            "user_id": view.user_id,
            "corpus_id": view.corpus_id,
            "timestamp": datetime.now().isoformat()
        }
        response = supabase.table("viewed_papers").insert(view_data).execute()
    except Exception as e:
        print(e)
        raise HTTPException(status_code=400, detail="Failed to add view to database")
    
class Like(BaseModel):
    user_id: str
    corpus_id: int

# Handle POST request to like a paper
@router.post("/like")
async def post_like(like: Like):
    data = {
        "user_id": like.user_id,
        "corpus_id": like.corpus_id,
        "liked_at": datetime.now().isoformat()
    }
    response = supabase.table('liked_papers').insert(data).execute()

# Handle DELETE request to unlike a paper
@router.delete("/unlike")
async def delete_like(user_id: str, paper_id: int):
    response = supabase.table('liked_papers').delete().eq('user_id', user_id).eq('corpus_id', paper_id).execute()


# Handle user paper recommendations
@router.get("/recommend")
async def get_recommendations(user: dict = Depends(verify_token)):
    user_id = user["sub"]
    exclude_ids = [] # Get all papers this user has viewed
    papers_user_viewed = supabase.table("viewed_papers").select('*').eq("user_id", user_id).execute()
    papers_user_viewed = papers_user_viewed.data

    if papers_user_viewed:
        exclude_ids = [paper["corpus_id"] for paper in papers_user_viewed]

    recs = generate_recommendations(user_id=user_id, exclude_ids=exclude_ids)
    return recs
