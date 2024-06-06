import json
import argparse
import supabase
from supabase import create_client, Client
import os 
from dotenv import load_dotenv

load_dotenv()

# Initialize Supabase client
url = os.getenv('SUPABASE_URL')
key = os.getenv('SUPABASE_KEY')
supabase: Client = create_client(url, key)

def bulk_upsert_paper_data(data):
    try:
        response = supabase.table('paper_abstract').upsert(data).execute()
    except Exception as e:
        # print corpus ids that failed to upsert
        corpus_counts = {}
        for d in data:
            corpus_counts[d['corpus_id']] = corpus_counts.get(d['corpus_id'], 0) + 1
        # print corpus counts that are greater than 1
        for corpusid, count in corpus_counts.items():
            if count > 1:
                print(corpusid, count)
        print(f'Error upserting data: {e}')
        return

def process_jsonl_file(file_path):
    bulk_data = []
    seen_corpusids = set()
    with open(file_path, 'r') as file:
        for line in file:
            data = json.loads(line.strip())
            # Extract relevant fields from the data
            paper_data = {
                'corpus_id': data.get('corpusid'),
                'openaccessinfo': data.get('openaccessinfo'),
                'abstract': data.get('abstract')
            }
            if paper_data['corpus_id'] in seen_corpusids:
                continue

            seen_corpusids.add(paper_data['corpus_id'])
            bulk_data.append(paper_data)
            # Upsert in batches of 1000 for efficiency
            if len(bulk_data) >= 1000:
                # only keep first instance of corpusid
                bulk_upsert_paper_data(bulk_data)
                bulk_data = []
                seen_corpusids = set()
        # Upsert any remaining data
        if bulk_data:
            bulk_upsert_paper_data(bulk_data)

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Upsert paper abstract data from a JSONL file into Supabase.')
    parser.add_argument('--file_path', type=str, help='The path to the JSONL file.')
    args = parser.parse_args()
    
    process_jsonl_file(args.file_path)