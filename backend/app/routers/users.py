from fastapi import APIRouter, Depends, HTTPException, Header
from fastapi.encoders import jsonable_encoder

from pydantic import BaseModel
from uuid import UUID
from datetime import datetime

from supabase import create_client, Client
from pinecone import Pinecone

from ..utils.recommend import generate_user_recommendations, recommend_from_id

import os
import json

from ..dependencies import verify_token, SUPABASE_KEY, SUPABASE_URL
from ..utils.summarize import create_abstract_summary

EXCLUDE_LIMIT = 100 # Maximum number of papers to exclude from recommendations

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
    return user

class View(BaseModel):
    corpus_id: int

@router.post("/viewed")
async def post_view(view: View, user: dict = Depends(verify_token)):
    # Add view to Supabase
    try:
        view_data = {
            "user_id": user["sub"],
            "corpus_id": view.corpus_id,
            "timestamp": datetime.now().isoformat()
        }
        response = supabase.table("viewed_papers").insert(view_data).execute()
    except Exception as e:
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
    exclude_ids = []
    papers_user_viewed = supabase.table("viewed_papers").select('*').eq('user_id', user_id).order('timestamp', desc=True).limit(EXCLUDE_LIMIT).execute()

    for paper in papers_user_viewed.data:
        exclude_ids.append(paper['corpus_id'])

    recs = generate_user_recommendations(user_id=user_id, exclude_ids=exclude_ids)
    return recs

# get deepdive of additional recommendations
# returns list of related papers
@router.get("/deepdive/{corpus_id}")
def get_deepdive_recommendations(corpus_id: str, user: dict = Depends(verify_token)):
    user_id = user["sub"]

    # get metadata for the paper
    metadata_response = supabase.table('paper_metadata').select(
        'corpus_id, title, authors, year, venue, url, \
        citationcount, s2fieldsofstudy, publicationtypes, publicationdate, journal'
    ).eq('corpus_id', corpus_id).execute()
    metadata = metadata_response.data[0]

    if not metadata:
        raise HTTPException(status_code=404, detail="Paper metadata not found")
    
    # TODO: Change exclude ids?
    exclude_ids = [corpus_id]
    papers_user_viewed = supabase.table("viewed_papers").select('*').eq('user_id', user_id).order('timestamp', desc=True).limit(EXCLUDE_LIMIT).execute()

    for paper in papers_user_viewed.data:
        exclude_ids.append(paper['corpus_id'])
    
    recs = recommend_from_id(corpus_id, k=10, sample_size=50, exclude_ids=exclude_ids)
    return {
        "paper_data": metadata,
        "recommendations": recs
    }
