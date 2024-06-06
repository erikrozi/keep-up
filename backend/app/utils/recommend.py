from .user_embedding_gpt import get_user_embedding_gpt
from dotenv import load_dotenv
from pinecone import Pinecone
from supabase import Client, create_client
import os


# Pinecone initialization
load_dotenv()
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_INDEX_NAME = "specter-embeddings"
pc = Pinecone(api_key=PINECONE_API_KEY)
index = pc.Index(PINECONE_INDEX_NAME)

# Supabase initialization
url: str = os.getenv("SUPABASE_URL")
key: str = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(url, key)

def filter_recommendations(pinecone_response, exclude_ids):
    corpus_ids = [elem['id'] for elem in pinecone_response["matches"]]
    supabase_response = supabase.table('paper_metadata')\
        .select('corpus_id, citationcount')\
        .in_('corpus_id', corpus_ids)\
        .execute()
    data = supabase_response.data

    # add similarity score to data
    for i, elem in enumerate(pinecone_response["matches"]):
        data[i]['score'] = elem['score']

    # Get abstracts for each corpus_id
    abstracts_response = supabase.table('paper_abstract')\
        .select('corpus_id, abstract')\
        .in_('corpus_id', corpus_ids)\
        .execute()
    
    # Filter out papers that are in exclude_ids
    data = [elem for elem in data if elem['corpus_id'] not in exclude_ids]

    # Filter out papers with abstracts that are too short (under 100 characters) or with no abstract
    abstracts_data = abstracts_response.data
    abstracts_data = [elem for elem in abstracts_data if elem['abstract'] and len(elem['abstract']) > 100]
    # Filter out papers with abstracts that aren't at least 50% ascii characters
    abstracts_data = [elem for elem in abstracts_data if sum(c.isascii() for c in elem['abstract']) / len(elem['abstract']) > 0.5]

    # remove data not in abstracts_data
    data = [elem for elem in data if elem['corpus_id'] in [elem['corpus_id'] for elem in abstracts_data]]

    # Sort data in buckets of similarity score
    # Similarity score buckets: 0.9-1, 0.8-0.9, 0.7-0.8, 0.6-0.7, 0-0.6
    # Sort each bucket by citation count
    # Concatenate the sorted buckets
    sorted_data = []
    for i in range(9, -1, -1):
        bucket = [elem for elem in data if elem['score'] >= i / 10 and elem['score'] < (i + 1) / 10]
        sorted_bucket = sorted(bucket, key=lambda x: x['citationcount'], reverse=True)
        sorted_data += sorted_bucket

    sorted_corpus_ids = [item['corpus_id'] for item in sorted_data]
    return sorted_corpus_ids

def recommend_from_id(id, k=10, sample_size=100, exclude_ids=None) -> list[int]:
    exclude_ids = exclude_ids or []
    sorted_corpus_ids = []

    top_k = sample_size
    while len(sorted_corpus_ids) < k:
        pinecone_response = index.query(id=str(id), top_k=top_k)
        sorted_corpus_ids = filter_recommendations(pinecone_response, exclude_ids)        

        top_k *= 2
    return sorted_corpus_ids[:k]

def recommend_from_embedding(embedding, k=10, sample_size=100, exclude_ids=None) -> list[int]:
    exclude_ids = exclude_ids or []
    sorted_corpus_ids = []

    top_k = sample_size
    while len(sorted_corpus_ids) < k:
        pinecone_response = index.query(vector=embedding, top_k=top_k)

        sorted_corpus_ids = filter_recommendations(pinecone_response, exclude_ids)

        top_k *= 2
    return sorted_corpus_ids[:k]

def generate_user_recommendations(user_id, k=10, exclude_ids=None) -> list[int]:
    """
    Given a user embedding, find the n most similar papers in the database.
    """
    user_embedding = get_user_embedding_gpt(user_id=user_id)
    return recommend_from_embedding(user_embedding, k=k, sample_size=100, exclude_ids=exclude_ids)

def main():
    test_user_id = "d4b809c6-668c-410c-b738-e2d2b2320820"
    recs = generate_user_recommendations(test_user_id, k=10, exclude_ids=[])
    print(recs)


if __name__ == "__main__":
    main()