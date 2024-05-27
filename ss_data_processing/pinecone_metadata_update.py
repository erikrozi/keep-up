'''
I want to update the metadata for the pinecone index to include the new fields that we are adding to the search results.
This metadata should come from the corresponding fields in the paper metadata table in the supabase database.

The metadata fields that we need to add are:
- citationcount
- category keys in s2fieldsofstudy
'''

import os
from dotenv import load_dotenv
from pinecone import Pinecone
from supabase import create_client, Client

from tqdm import tqdm


load_dotenv()
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_INDEX_NAME = "specter-embeddings"

# Create a Supabase client
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Get the index
pc = Pinecone(api_key=PINECONE_API_KEY)
index = pc.Index(PINECONE_INDEX_NAME)

# Get the metadata from the paper_metadata table
# Iterate over the entire table using range queries

limit = 1000
offset = 42000
continue_fetching = True

# Function to process metadata
def process_metadata(metadata):
    for item in metadata:
        if item['s2fieldsofstudy'] is not None:
            item['s2fieldsofstudy'] = list(set(field['category'] for field in item['s2fieldsofstudy'] if field is not None))
        else:
            del item['s2fieldsofstudy']

    # Update the metadata in the Pinecone index
    for item in tqdm(metadata):
        corpus_id = item.pop('corpus_id')
        index.update(id=str(corpus_id), set_metadata=item)

while continue_fetching:
    # Fetch data in batches
    metadata_response = supabase.table('paper_metadata').select(
        'corpus_id, citationcount, s2fieldsofstudy'
    ).range(offset, offset + limit - 1).execute()

    metadata = metadata_response.data

    # Check if there are more records to fetch
    if len(metadata) == 0:
        continue_fetching = False
    else:
        # Process the current batch of metadata
        process_metadata(metadata)
        # Update offset for the next batch
        offset += limit

print("Metadata updated successfully!")