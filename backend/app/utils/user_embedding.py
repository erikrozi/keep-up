from pinecone import Pinecone
import os
import numpy as np
from dotenv import load_dotenv
from supabase import create_client, Client


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


def get_n_recent_papers(user_id=None, n=10):
    """
    Find the n most recently liked papers by the user.
    """
    response = supabase.table('liked_papers')\
        .select("*")\
        .eq('user_id', user_id)\
        .order('timestamp', desc=True)\
        .limit(n)\
        .execute()
    # Extract corpus_ids from the response
    corpus_ids = [record['corpus_id'] for record in response.data]
    return corpus_ids


def get_user_embedding(user_id=None):
    """
    Given a user_id, find the user's interests and 10 most recently liked papers
    and generate a SPECTER2 embedding based on the average of the embeddings of
    the papers.

    TODO: Figure out how to incorporate user's interests into this embedding.
    """
    n_recent_papers = get_n_recent_papers()
    # Get the embeddings of liked papers from Pinecone
    response = index.fetch(n_recent_papers)
    vectors = [response["vectors"][key]["values"]
               for key in response["vectors"]]
    # Average the vectors
    user_embedding = np.mean(vectors, axis=0)
    return user_embedding.tolist()


def main():
    get_n_recent_papers(user_id="d4b809c6-668c-410c-b738-e2d2b2320820")


if __name__ == "__main__":
    main()
    