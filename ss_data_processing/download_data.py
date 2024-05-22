import requests
import urllib.request
import json
import os
from tqdm import tqdm
import argparse
from dotenv import load_dotenv
from concurrent.futures import ThreadPoolExecutor, as_completed
from tenacity import retry, wait_fixed, stop_after_attempt, RetryError
from urllib.parse import urlparse, parse_qs

load_dotenv()

@retry(wait=wait_fixed(5), stop=stop_after_attempt(3))
def download_file(url, download_dir, success_log_file, failure_log_file):
    parsed_url = urlparse(url)
    file_name = os.path.basename(parsed_url.path)
    
    file_path = os.path.join(download_dir, file_name)
    if os.path.exists(file_path):
        print(f"File {file_path} already exists, skipping download.")
        return

    try:
        print(f"Attempting to download {file_name}")
        urllib.request.urlretrieve(url, file_path)
        print(f"Successfully downloaded {file_name}")

        # Log the successful download
        with open(success_log_file, 'a') as log:
            log.write(f"SUCCESS: {url}\n")

    except Exception as e:
        print(f"Attempt failed for {file_name}")
        # Log the failure
        with open(failure_log_file, 'a') as log:
            log.write(f"FAILED ATTEMPT: {url}: {e}\n")
        raise

def verify_and_redownload(files, download_dir, success_log_file, failure_log_file, num_workers=5):
    missing_files = []
    for url in files:
        parsed_url = urlparse(url)
        file_name = os.path.basename(parsed_url.path)

        file_path = os.path.join(download_dir, file_name)
        if not os.path.exists(file_path):
            missing_files.append(url)

    if missing_files:
        print(f"Missing files found: {len(missing_files)}. Attempting to re-download.")
        with ThreadPoolExecutor(max_workers=num_workers) as executor:
            futures = [executor.submit(download_file, url, download_dir, success_log_file, failure_log_file) for url in missing_files]
            for future in tqdm(as_completed(futures), total=len(futures), desc="Re-downloading missing files"):
                try:
                    future.result()  # Wait for all futures to complete
                except Exception as e:
                    print(f"An error occurred while re-downloading: {e}")

def download_dataset(dataset, output_dir, version="latest", num_workers=5):
    print(f"Downloading {dataset} dataset")
    download_dir = os.path.join(output_dir, dataset)
    os.makedirs(download_dir, exist_ok=True)
    print(f"Saving files to {download_dir}")

    success_log_file = os.path.join(download_dir, "download_success_log.txt")
    failure_log_file = os.path.join(download_dir, "download_failure_log.txt")
    mapping_log_file = os.path.join(download_dir, "url_part_mapping.txt")
    urls_txt_file = os.path.join(download_dir, "urls.txt")

    api_key = os.getenv("S2_API_KEY")
    if not api_key:
        print("API key not found. Please set S2_API_KEY in your environment.")
        return

    dataset_url = f"http://api.semanticscholar.org/datasets/v1/release/{version}/dataset/{dataset}"
    print(f"Fetching dataset information from {dataset_url}")

    # Get info about the dataset
    try:
        response = requests.get(dataset_url, headers={'x-api-key': api_key})

        # Check if the request was successful (status code 200)
        if response.status_code == 200:
            # Extract the diffs from the response
            urls = response.json()
            # Save the URLs to a file
            with open(urls_txt_file, 'w') as f:
                json.dump(urls, f)

        else:
            # Handle potential errors or non-200 responses
            print(f"Request failed with status code {response.status_code}: {response.text}")
            return
    except requests.exceptions.RequestException as e:
        print(f"Request failed: {e}")
        return

    files = urls['files']
    futures = []
    with ThreadPoolExecutor(max_workers=num_workers) as executor:
        for url in files:
            futures.append(executor.submit(download_file, url, download_dir, success_log_file, failure_log_file))

        for i, future in tqdm(enumerate(as_completed(futures)), total=len(futures), desc="Downloading files"):
            try:
                future.result()  # Wait for all futures to complete
            except RetryError as e:
                # Log the final failure after all retry attempts
                print(f"FAILED: {files[i]} after {e.last_attempt.attempt_number} attempts\n")
                with open(failure_log_file, 'a') as log:
                    log.write(f"FAILED: {files[i]} after {e.last_attempt.attempt_number} attempts\n")
            except Exception as e:
                print(f"An error occurred: {e}")

    # Verify and re-download any missing parts
    verify_and_redownload(files, download_dir, success_log_file, failure_log_file, num_workers)

def main():
    parser = argparse.ArgumentParser(description="Download Semantic Scholar Academic Graph Datasets")
    parser.add_argument("--dataset", type=str, default="papers", help="Dataset to download")
    parser.add_argument("--output_dir", type=str, default="data", help="Directory to save downloaded files")
    parser.add_argument("--version", type=str, default="latest", help="Version of the dataset")
    parser.add_argument("--num_workers", type=int, default=max(1, os.cpu_count() - 1), help="Number of parallel workers")

    args = parser.parse_args()
    print("Arguments:", args)
    download_dataset(args.dataset, args.output_dir, args.version, args.num_workers)

if __name__ == "__main__":
    main()
