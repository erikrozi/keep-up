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


@router.get("/{corpus_id}")
async def read_papers(corpus_id: str):
    # Fetch from paper_metadata table
    metadata_response = supabase.table('paper_metadata').select('*').eq('corpus_id', corpus_id).execute()
    metadata = metadata_response.data

    if not metadata:
        raise HTTPException(status_code=404, detail="Paper metadata not found")
    
    abstract = get_abstract(corpus_id)
    abstract_summary = get_abstract_summary(abstract)

    result = {
        "metadata": metadata[0],
        "abstract": abstract,
        "abstract_summary": abstract_summary
    }

    return result

# get item embedding from pinecone
@router.get("/{corpus_id}/embedding")
def get_paper_embeddings(corpus_id: str):
    embedding = pinecone_index.fetch(ids=[corpus_id])
    if not embedding:
        raise HTTPException(status_code=404, detail="Paper embedding not found")
    result = {
        "corpus_id": corpus_id,
        "embedding": embedding['vectors'][corpus_id]['values']
    }
    print(result)
    return result

# get related papers from pinecone
# top_k is the number of related papers to return
# NOTE: pinecone query may include the paper itself in the results
@router.get("/{corpus_id}/related")
def get_related_papers(corpus_id: str):
    related = pinecone_index.query(id=corpus_id, top_k=5)
    if not related:
        raise HTTPException(status_code=404, detail="Related papers not found")
    
    result = []
    for item in related['matches']:
        if item['id'] == corpus_id:
            continue

        parsed_item = {}
        parsed_item['corpus_id'] = item['id']
        parsed_item['score'] = item['score']
        result.append(parsed_item)

    return result

# helper function to get abstracts
def get_abstract(corpus_id: str):
    # Fetch from paper_abstract table
    abstract_response = supabase.table('paper_abstract').select('corpus_id', 'abstract').eq('corpus_id', corpus_id).execute()
    abstract = abstract_response.data

    if not abstract:
        raise HTTPException(status_code=404, detail="Paper abstract not found")

    return abstract[0]['abstract']

def get_abstract_summary(abstract: str):
    # Summarize abstract using OpenAI API
    return create_abstract_summary(abstract)