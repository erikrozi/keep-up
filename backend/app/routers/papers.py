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
    prefix="/papers",
    tags=["papers"],
    #dependencies=[Depends(verify_token)],
    responses={404: {"description": "Not found"}},
)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
pinecone = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
pinecone_index = pinecone.Index("specter-embeddings")


@router.get("/")
async def read_papers():
    return "Get your papers here!"


@router.get("/{corpusid}")
async def read_papers(corpusid: str):
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
def get_paper_embeddings(corpusid: str):
    embedding = pinecone_index.fetch(ids=[corpusid])
    if not embedding:
        raise HTTPException(status_code=404, detail="Paper embedding not found")
    result = {
        "corpusid": corpusid,
        "embedding": embedding['vectors'][corpusid]['values']
    }
    print(result)
    return result

# get related papers from pinecone
@router.get("/{corpusid}/related")
def get_related_papers(corpusid: str):
    related = pinecone_index.query(id=corpusid, top_k=5)
    if not related:
        raise HTTPException(status_code=404, detail="Related papers not found")
    
    parsed_related = {}
    for i, item in enumerate(related['matches']):
        parsed_item = {}
        parsed_item['corpusid'] = item['id']
        parsed_item['score'] = item['score']
        parsed_item['values'] = item['values']
        parsed_related[i] = parsed_item

    result = {
        "corpusid": corpusid,
        "related": parsed_related
    }
    return result

# helper function to get abstracts
def get_abstract(corpusid: str):
    # Fetch from paper_abstract table
    abstract_response = supabase.table('paper_abstract').select('corpusid', 'abstract').eq('corpusid', corpusid).execute()
    abstract = abstract_response.data

    if not abstract:
        raise HTTPException(status_code=404, detail="Paper abstract not found")

    return abstract[0]['abstract']

def get_abstract_summary(abstract: str):
    # Summarize abstract using OpenAI API
    return create_abstract_summary(abstract)