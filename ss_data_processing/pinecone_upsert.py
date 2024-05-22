from pinecone import Pinecone, ServerlessSpec
# import environment variables from .env file
from dotenv import load_dotenv
import os
import json
import itertools

load_dotenv()
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))

index_name = "specter-embeddings"
if index_name not in pc.list_indexes().names():
  pc.create_index(
      name=index_name,
        dimension=768,
        metric="cosine",
        spec=ServerlessSpec(
            cloud='aws', 
            region='us-east-1'
      ) 
    )

index = pc.Index(index_name)

# load the jsonl file containing the embeddings
file_path = "/Volumes/daily 2/KeepUp/processed_data/final_embeddings.jsonl"

def chunks(iterable, batch_size=100):
    """A helper function to break an iterable into chunks of size batch_size."""
    it = iter(iterable)
    chunk = tuple(itertools.islice(it, batch_size))
    while chunk:
        embeddings = []
        for line in chunk:
            data = json.loads(line)
            id = data["corpusid"]
            vector = json.loads(data["vector"])
            embeddings.append((str(data["corpusid"]), json.loads(data["vector"])))

        yield tuple(embeddings)
        chunk = tuple(itertools.islice(it, batch_size))

# format of each line: {"corpusid": 263831205, "vector": "[0.4912266135215759, 0.1234567890123456, ...]"}
# vector should be a list of floats
# do so in parallel

with pc.Index(index_name, pool_threads=8) as index:
    with open(file_path, 'r') as f:
        async_results = [
            index.upsert(vectors=ids_vectors_chunk, async_req=True)
            for ids_vectors_chunk in chunks(f, batch_size=100)
        ]
        # Wait for and retrieve responses (this raises in case of error)
        [async_result.get() for async_result in async_results]

print("Upserted embeddings successfully!")

