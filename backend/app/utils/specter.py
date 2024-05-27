import requests
from dotenv import load_dotenv
import os

load_dotenv()

HUGGINGFACE_API_KEY = os.getenv("HUGGINGFACE_API_KEY")

API_URL = "https://api-inference.huggingface.co/models/allenai/specter2_base"
HEADERS = {f"Authorization": "Bearer {HUGGINGFACE_API_KEY}"}


def generate_specter_embedding(input: str):
	payload = {"inputs": input, "wait_for_model": True}
	response = requests.post(API_URL, headers=HEADERS, json=payload)
	response_json = response.json()
	return response_json[0][0]
	

def main():
	test_query_string = """
	The user is interested in:

    1. **Vision-Language Models**: Integrating visual and textual information.
    2. **Data Annotation**: Addressing challenges in labeling ambiguous data.
    3. **Accessibility**: Enhancing tech accessibility using large language models.
    4. **Medical AI**: Applying AI to medical diagnostics and guidelines.
    5. **Health Informatics**: Using social media data for health research.
    """
	embedding = generate_specter_embedding(test_query_string)
	print(embedding)

if __name__ == '__main__':
	main()