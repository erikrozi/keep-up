from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from supabase import create_client, Client
from pinecone import Pinecone
import os

from ..dependencies import verify_token, SUPABASE_KEY, SUPABASE_URL
from ..utils.summarize import create_abstract_summary

router = APIRouter(
    prefix="/papers",
    tags=["papers"],
    #dependencies=[Depends(verify_token)],
    responses={404: {"description": "Not found"}},
)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
pinecone = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
pinecone_index = pinecone.Index("specter-embeddings")


@router.get("/")
async def read_items():
    return "Get your papers here!"


@router.get("/{corpusid}")
async def read_item(corpusid: str):
    # Fetch from paper_metadata table
    metadata_response = supabase.table('paper_metadata').select('*').eq('corpusid', corpusid).execute()
    metadata = metadata_response.data

    if not metadata:
        raise HTTPException(status_code=404, detail="Paper metadata not found")
    
    abstract = get_abstract(corpusid)
    abstract_summary = get_abstract_summary(abstract)

    result = {
        "metadata": metadata[0],
        "abstract": abstract,
        "abstract_summary": abstract_summary
    }

    return result

# get item embedding from pinecone
@router.get("/{corpusid}/embedding")
def read_item_embeddings(corpusid: str):
    embedding = pinecone_index.fetch(ids=[corpusid])
    if not embedding:
        raise HTTPException(status_code=404, detail="Paper embedding not found")
    result = {
        "corpusid": corpusid,
        "embedding": embedding['vectors'][corpusid]['values']
    }
    print(result)
    return result

# helper function to get abstracts
def get_abstract(corpusid: str):
    # Fetch from paper_abstract table
    abstract_response = supabase.table('paper_abstract').select('*').eq('corpusid', corpusid).execute()
    abstract = abstract_response.data

    if not abstract:
        raise HTTPException(status_code=404, detail="Paper abstract not found")

    return abstract[0]['abstract']

def get_abstract_summary(abstract: str):
    # Summarize abstract using OpenAI API
    return create_abstract_summary(abstract)