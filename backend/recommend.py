from user_embedding import get_user_embedding
from dotenv import load_dotenv
from pinecone import Pinecone
import os


# Pinecone initialization
load_dotenv()
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_INDEX_NAME = "specter-embeddings"
pc = Pinecone(api_key=PINECONE_API_KEY)
index = pc.Index(PINECONE_INDEX_NAME)


def generate_recommendations(user_id=None, k=10, exclude_ids=None):
    """
    Given a user embedding, find the n most similar papers in the database.
    """
    user_embedding = get_user_embedding()
    exclude_ids = exclude_ids or []
    response = index.query(vector=user_embedding, top_k=k,
                           exclude_ids=exclude_ids)
    return [elem['id'] for elem in response["matches"]]


def main():
    # Eventually, exclude_ids should be all the papers the user has seen
    liked_paper_ids = [106495818, 258277383, 256972193, 259669263, 257310957,
                       259229229, 258109193, 259076375, 257557791, 249072890]
    exclude_ids = [str(paper_id) for paper_id in liked_paper_ids]
    recs = generate_recommendations(exclude_ids=exclude_ids)
    print(recs)


if __name__ == "__main__":
    main()
