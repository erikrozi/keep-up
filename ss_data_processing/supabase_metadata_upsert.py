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

def bulk_upsert_metadata(data):
    try:
        response = supabase.table('paper_metadata').upsert(data).execute()
    except Exception as e:
        print(f'Error upserting data: {e}')
        return

def process_jsonl_file(file_path):
    bulk_data = []
    with open(file_path, 'r') as file:
        for line in file:
            data = json.loads(line.strip())
            # Extract relevant fields from the data
            paper_data = {
                'corpusid': data.get('corpusid'),
                'externalids': json.dumps(data.get('externalids')),
                'url': data.get('url'),
                'title': data.get('title'),
                'authors': json.dumps(data.get('authors')),
                'venue': data.get('venue'),
                'publicationvenueid': data.get('publicationvenueid'),
                'year': data.get('year'),
                'referencecount': data.get('referencecount'),
                'citationcount': data.get('citationcount'),
                'influentialcitationcount': data.get('influentialcitationcount'),
                'isopenaccess': data.get('isopenaccess'),
                's2fieldsofstudy': json.dumps(data.get('s2fieldsofstudy')),
                'publicationtypes': json.dumps(data.get('publicationtypes')),
                'publicationdate': data.get('publicationdate'),
                'journal': json.dumps(data.get('journal'))
            }
            bulk_data.append(paper_data)
            # Upsert in batches of 1000 for efficiency
            if len(bulk_data) >= 1000:
                bulk_upsert_metadata(bulk_data)
                bulk_data = []
        # Upsert any remaining data
        if bulk_data:
            bulk_upsert_metadata(bulk_data)

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Upsert paper metadata from a JSONL file into Supabase.')
    parser.add_argument('--file_path', type=str, help='The path to the JSONL file.')
    args = parser.parse_args()
    
    process_jsonl_file(args.file_path)