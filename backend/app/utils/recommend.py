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

def generate_recommendations(user_id, k=10, exclude_ids=None) -> list[int]:
    """
    Given a user embedding, find the n most similar papers in the database.
    """
    user_embedding = get_user_embedding_gpt(user_id=user_id)
    exclude_ids = exclude_ids or []
    response = index.query(vector=user_embedding, top_k=100,
                           exclude_ids=exclude_ids)
    corpus_ids = [elem['id'] for elem in response["matches"]]
    response = supabase.table('paper_metadata')\
        .select('corpus_id, citationcount')\
        .in_('corpus_id', corpus_ids)\
        .execute()
    data = response.data
    sorted_data = sorted(data, key=lambda x: x['citationcount'], reverse=True)
    sorted_corpus_ids = [item['corpus_id'] for item in sorted_data]
    return sorted_corpus_ids[:k]

def main():
    test_user_id = "d4b809c6-668c-410c-b738-e2d2b2320820"
    recs = generate_recommendations(test_user_id, k=10, exclude_ids=[])
    print(recs)


if __name__ == "__main__":
    main()