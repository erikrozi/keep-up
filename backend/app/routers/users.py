from fastapi import APIRouter, Depends, HTTPException
from fastapi.encoders import jsonable_encoder

from pydantic import BaseModel
from supabase import create_client, Client
from pinecone import Pinecone

import os
import json

from ..dependencies import verify_token, SUPABASE_KEY, SUPABASE_URL
from ..utils.summarize import create_abstract_summary

router = APIRouter(
    prefix="/users",
    tags=["users"],
    #dependencies=[Depends(verify_token)],
    responses={404: {"description": "Not found"}},
)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
pinecone = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
pinecone_index = pinecone.Index("specter-embeddings")


@router.get("/")
async def read_users():
    return "Get your users here!"

@router.get("/{user_id}")
async def read_user(user_id: str):
    # Fetch from users table
    user_response = supabase.table('users').select('*').eq('user_id', user_id).execute()
    user = user_response.data

    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    result = {
        "user": user[0]
    }

    return result