from fastapi import APIRouter, Depends, HTTPException
from fastapi.encoders import jsonable_encoder

from pydantic import BaseModel
from supabase import create_client, Client
from pinecone import Pinecone

import os
import json

from ..dependencies import verify_token, SUPABASE_KEY, SUPABASE_URL
from ..utils.summarize import create_abstract_summary, create_abstract_results
from ..utils.recommend import recommend_from_id

router = APIRouter(
    prefix="/papers",
    tags=["papers"],
    dependencies=[Depends(verify_token)],
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
    metadata_response = supabase.table('paper_metadata').select(
        'corpus_id, title, authors, year, venue, url, \
        citationcount, s2fieldsofstudy, publicationtypes, publicationdate, journal'
    ).eq('corpus_id', corpus_id).execute()
    metadata = metadata_response.data[0]

    if not metadata:
        raise HTTPException(status_code=404, detail="Paper metadata not found")
    
    abstract = get_abstract(corpus_id)

    result = {
        "metadata": metadata,
        "abstract": abstract,
    }

    return result

# get abstract summary
@router.get("/{corpus_id}/summary")
def get_abstract_summary(corpus_id: str):
    abstract_response = supabase.table('paper_abstract').select('abstract_summary').eq('corpus_id', corpus_id).execute()
    abstract_summary = abstract_response.data[0].get('abstract_summary') if abstract_response.data else None

    if not abstract_summary:
        abstract = get_abstract(corpus_id)
        abstract_summary = create_abstract_summary(abstract)
        # Optionally, save the generated summary back to the database
        supabase.table('paper_abstract').update({'abstract_summary': abstract_summary}).eq('corpus_id', corpus_id).execute()

    result = {
        "corpus_id": corpus_id,
        "summary": abstract_summary,
    }

    return result

# get abstract results
@router.get("/{corpus_id}/results")
def get_abstract_results(corpus_id: str):
    abstract = get_abstract(corpus_id)
    abstract_results = create_abstract_results(abstract)

    result = {
        "corpus_id": corpus_id,
        "results": abstract_results,
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
    related = recommend_from_id(corpus_id, k=2, sample_size=5, exclude_ids=[corpus_id])
    result = [{'corpus_id': item} for item in related]

    # get metadata for related papers
    metadata_response = supabase.table('paper_metadata').select(
        'corpus_id, title, authors, year, venue, url, \
        citationcount, s2fieldsofstudy, publicationtypes, publicationdate, journal'
    ).in_('corpus_id', [item['corpus_id'] for item in result]).execute()

    # create a dictionary of metadata for easy lookup
    metadata = metadata_response.data
    metadata_dict = {}
    for item in metadata:
        metadata_dict[item['corpus_id']] = item

    # add metadata to result
    for item in result:
        item['metadata'] = metadata_dict[int(item['corpus_id'])]

    return result

# helper function to get abstracts
def get_abstract(corpus_id: str):
    # Fetch from paper_abstract table
    abstract_response = supabase.table('paper_abstract').select('corpus_id', 'abstract').eq('corpus_id', corpus_id).execute()
    abstract = abstract_response.data

    if not abstract:
        raise HTTPException(status_code=404, detail="Paper abstract not found")

    return abstract[0]['abstract']