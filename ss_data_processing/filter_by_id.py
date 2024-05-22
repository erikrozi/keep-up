from tqdm import tqdm
import os
import json
import gzip
from concurrent.futures import ProcessPoolExecutor, as_completed
import argparse

# Filter each file based on the criteria
def process_file(file, download_dir, corpus_ids):
    try: 
        file_path = os.path.join(download_dir, file)
        filtered_data = []

        with gzip.open(file_path, 'rt', encoding='utf-8') as f:
            for line in f:
                json_line = json.loads(line)
                if json_line.get("corpusid", None) in corpus_ids:
                    filtered_data.append(line)

        return filtered_data, file
    except Exception as e:
        print(f"An error occurred while processing file: {file}")
        print(e)
        return None, file

def main():
    parser = argparse.ArgumentParser(description="Filter Semantic Scholar Academic Graph Datasets")
    parser.add_argument("--download_dir", type=str, default="data", help="Directory containing downloaded files")
    parser.add_argument("--save_path", type=str, default="processed_data", help="Path to save filtered data")
    parser.add_argument("--corpus_ids_path", type=str, default="processed_data/filtered_corpus_ids.txt", help="Path to filtered corpus ids")
    parser.add_argument("--dataset", type=str, default="abstracts", help="Dataset to filter")

    args = parser.parse_args()
    download_dir = os.path.join(args.download_dir, args.dataset)
    save_path = os.path.join(args.save_path, f"filtered_{args.dataset}.jsonl.gz")

    files = [file for file in os.listdir(download_dir) if file.endswith(".gz")]

    # read each line in filtered_corpus_ids.txt, convert to int, and store in a set
    with open("processed_data/filtered_corpus_ids.txt", 'r') as f:
        filtered_corpus_ids = set(map(int, f.readlines()))

    # Process files in parallel
    with ProcessPoolExecutor() as executor:
        print("Number of processes: ", executor._max_workers)

        futures = {executor.submit(process_file, file, download_dir, filtered_corpus_ids): file for file in files}

        # Assumes downloaded files are in gzip format
        with gzip.open(save_path, 'wt', encoding='utf-8') as output_file:
            for future in tqdm(as_completed(futures), total=len(futures), desc="Processing files"):
                filtered_data, file = future.result()
                if filtered_data:
                    output_file.writelines(filtered_data)

if __name__ == "__main__":
    main()
