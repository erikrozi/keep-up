from pinecone import Pinecone
import os
import numpy as np
from dotenv import load_dotenv


# Pinecone initialization
load_dotenv()
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_INDEX_NAME = "specter-embeddings"
pc = Pinecone(api_key=PINECONE_API_KEY)
index = pc.Index(PINECONE_INDEX_NAME)


def get_n_recent_papers(user_id=None, n=10):
    """
    Find the n most recently liked papers by the user.
    """
    # Replace this with a query to Supabase database
    liked_paper_ids = [106495818, 258277383, 256972193, 259669263, 257310957,
                       259229229, 258109193, 259076375, 257557791, 249072890]
    liked_paper_ids_strs = [str(paper_id) for paper_id in liked_paper_ids]
    return liked_paper_ids_strs


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
    embedding = get_user_embedding()
    print(embedding)


if __name__ == "__main__":
    main()
    
