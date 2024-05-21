from fastapi import APIRouter, Depends, HTTPException
from ..dependencies import get_current_user
import requests, json, os
from dotenv import load_dotenv
from .summarize import summarize, summarize_search

load_dotenv()

router = APIRouter(
    prefix="/papers",
    tags=["papers"],
    dependencies=[],
    responses={404: {"description": "Not found"}},
)


@router.get("/")
def api_read_root():
    print("Hello")
    return {"message": "Hello World"}


@router.get("/{paper_id}")
def api_read_item(paper_id: str):
    url = 'https://api.semanticscholar.org/graph/v1/paper/' + paper_id

    # Define which details about the paper you would like to receive in the response
    paper_data_query_params = {
        'fields': 'title,year,abstract,authors.name',
        'x-api-key': os.getenv('SEMANTIC_SCHOLAR_API_KEY')
    }

    # Send the API request and store the response in a variable
    response = requests.get(url, params=paper_data_query_params)
    if response.status_code == 200:
        return response.json()
    else:
        raise HTTPException(status_code=404, detail="Item not found")


@router.get("/search/{query}")
def api_search(query: str):
    url = 'https://api.semanticscholar.org/graph/v1/paper/search'

    # Define the query parameters
    query_params = {
        'query': query,
        'limit': 10,
        'year': '2021-01-01:',
        'fields': 'title,authors,venue,abstract,venue,year,referenceCount,citationCount,publicationTypes,publicationDate',
        'x-api-key': os.getenv('SEMANTIC_SCHOLAR_API_KEY')
    }

    # Make the request with the specified parameters
    response = requests.get(url, params=query_params)

    # Check if the request was successful (status code 200)
    if response.status_code == 200:
        # Convert response to JSON format
        search_json = response.json()

        return search_json
    else:
        # Handle potential errors or non-200 responses
        raise HTTPException(status_code=response.status_code, detail=response.text)
    
@router.get("/summarize/search/{query}")
def api_summarize_search(query: str):
    url = 'https://api.semanticscholar.org/graph/v1/paper/search'

    # Define the query parameters
    query_params = {
        'query': query,
        'limit': 10,
        'year': '2021-01-01:',
        'fields': 'title,abstract',
        #'x-api-key': os.getenv('SEMANTIC_SCHOLAR_API_KEY')
    }

    # Make the request with the specified parameters
    print("Making SS request")
    response = requests.get(url, params=query_params)
    print("SS request made")

    # Check if the request was successful (status code 200)
    if response.status_code == 200:
        # Convert response to JSON format
        search_json = response.json()
        for paper in search_json['data']:
            abstract = paper['abstract']
            paper["summary"] = summarize(abstract)

        abstracts = [paper['abstract'] for paper in search_json['data']]
        search_json["overall_summary"] = summarize_search(abstracts)

        return search_json
    else:
        # Handle potential errors or non-200 responses
        raise HTTPException(status_code=response.status_code, detail=response.text)


@router.get("/summarize/{paper_id}")
def api_summarize_paper(paper_id: str):
    url = 'https://api.semanticscholar.org/graph/v1/paper/' + paper_id

    # Define which details about the paper you would like to receive in the response
    paper_data_query_params = {
        'fields': 'title,abstract',
        'x-api-key': os.getenv('SEMANTIC_SCHOLAR_API_KEY')
    }

    # Send the API request and store the response in a variable
    response = requests.get(url, params=paper_data_query_params)
    if response.status_code == 200:
        paper_data = response.json()
        abstract = paper_data['abstract']
        paper_data["summary"] = summarize(abstract)
        return paper_data
    else:
        raise HTTPException(status_code=404, detail="Item not found")
    
