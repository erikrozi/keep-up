from fastapi import APIRouter, Depends, HTTPException
from fastapi.encoders import jsonable_encoder

from pydantic import BaseModel
from supabase import create_client, Client
from pinecone import Pinecone

from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

import os
import json

from ..dependencies import verify_token, SUPABASE_KEY, SUPABASE_URL
from ..utils.recommend import recommend_from_embedding
from ..utils.specter import generate_specter_embedding

EXCLUDE_LIMIT = 100 # Maximum number of papers to exclude from recommendations

BACKGROUND_PROMPT = """
You are a world class researcher who is an expert in recommending research
papers.
"""

router = APIRouter(
    prefix="/search",
    tags=["search"],
    dependencies=[Depends(verify_token)],
    responses={404: {"description": "Not found"}},
)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
pinecone = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
pinecone_index = pinecone.Index("specter-embeddings")

@router.get("/")
async def read_search():
    return "Search for papers here!"

@router.get("/{query}")
async def search_papers(query: str, user: dict = Depends(verify_token)):
    # Query the paper_metadata table
    search_embed = generate_specter_embedding(query)

    exclude_ids = []
    user_id = user["sub"]
    papers_user_viewed = supabase.table("viewed_papers").select('*').eq('user_id', user_id).order('timestamp', desc=True).limit(EXCLUDE_LIMIT).execute()

    for paper in papers_user_viewed.data:
        exclude_ids.append(paper['corpus_id'])

    recs = recommend_from_embedding(search_embed, k=10, sample_size=20, exclude_ids=None)

    return recs

