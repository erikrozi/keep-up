from tqdm import tqdm
import os
import json
import gzip
from concurrent.futures import ProcessPoolExecutor, as_completed

download_dir = "data"
save_path = "processed_data/filtered_papers.jsonl.gz"
corpus_ids_path = "processed_data/filtered_corpus_ids.txt"

# Criteria for filtering the data
# Each value in the dictionary is a set of valid values for the corresponding key
in_set_criteria = {
    "year": set([2023, 2024]),
}

# Each value in the dictionary is a minimum value for the corresponding key
greaterthanorequal_criteria = {
    "citationcount": 5
}

# Filter each file based on the criteria
def process_file(file):
    file_path = os.path.join(download_dir, file)
    filtered_data = []
    filtered_corpus_ids = []

    with gzip.open(file_path, 'rt', encoding='utf-8') as f:
        # Estimate total lines for tqdm progress bar
        total_lines = sum(1 for line in f)
        f.seek(0)  # Reset file pointer to beginning

        for line in tqdm(f, total=total_lines, desc=f"Processing {file}"):
            json_line = json.loads(line)
            if all(json_line.get(key, None) in value for key, value in in_set_criteria.items()) and \
                    all(json_line.get(key, float('-inf')) >= value for key, value in greaterthanorequal_criteria.items()):
                filtered_data.append(line)
                filtered_corpus_ids.append(json_line.get("corpusid"))

    return filtered_data, filtered_corpus_ids, file

def main():
    count = 0
    if not os.path.exists("processed_data"):
        os.makedirs("processed_data")

    files = [file for file in os.listdir(download_dir) if file.endswith(".jsonl.gz")]

    # Process files in parallel
    with ProcessPoolExecutor() as executor:
        print("Number of processes: ", executor._max_workers)

        futures = {executor.submit(process_file, file): file for file in files}

        # Assumes downloaded files are in gzip format
        with gzip.open(save_path, 'wt', encoding='utf-8') as output_file, open(corpus_ids_path, 'w', encoding='utf-8') as ids_file:
            for future in as_completed(futures):
                filtered_data, filtered_corpus_ids, file = future.result()
                if filtered_data:
                    print(f"Processing complete for file: {file}")
                    output_file.writelines(filtered_data)
                    ids_file.writelines([f"{corpus_id}\n" for corpus_id in filtered_corpus_ids])
                    count += len(filtered_data)
                    print(f"Total papers for {file}: {len(filtered_data)}")
                    print(f"Total papers for all files: {count}")

if __name__ == "__main__":
    main()
