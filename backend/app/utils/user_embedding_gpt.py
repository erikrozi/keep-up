"""
Use GPT to generate user embeddings based on recently read papers and user
interests. This will be used to generate recommendations for the user.
"""


from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from dotenv import load_dotenv
from supabase import create_client, Client
import os
from .specter import generate_specter_embedding


load_dotenv()


# Supabase initialization
url: str = os.getenv("SUPABASE_URL")
key: str = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(url, key)


BACKGROUND_PROMPT = """
You are a world class researcher who is an expert in recommending research
papers.
"""


def main():
    test_user_id = "d4b809c6-668c-410c-b738-e2d2b2320820"
    embedding = get_user_embedding_gpt(test_user_id)
    print(embedding)


def get_user_embedding_gpt(user_id):
    recent_paper_titles = get_recently_liked_papers(user_id)
    interests = get_user_interests(user_id)
    summary_string = generate_summary_string(recent_paper_titles, interests)
    print(summary_string)
    return generate_specter_embedding(summary_string)


def get_recently_liked_papers(user_id, n=10):
    """
    Get the `n` most recently liked papers by the user from Supabase.
    """
    response = supabase.table('liked_papers')\
        .select("*")\
        .eq('user_id', user_id)\
        .order('timestamp', desc=True)\
        .limit(n)\
        .execute()

    # Find the n most recently liked corpus ids
    corpus_ids = [record['corpus_id'] for record in response.data]
    if not corpus_ids:
        return []

    # Find the associated titles
    titles_response = supabase.table('paper_metadata')\
        .select("title")\
        .in_("corpus_id", corpus_ids)\
        .execute()
    
    titles = [record['title'] for record in titles_response.data]
    return titles


def get_user_interests(user_id):
    return [
        "Cardiology",
        "Molecular Biology",
        "Exercise Science",
        "Immunology",
        "Hepatology"
    ]


def generate_summary_string(recent_paper_titles, user_interests):

    llm = ChatOpenAI(model="gpt-3.5-turbo", max_tokens=300)
    prompt = ChatPromptTemplate.from_messages([
        ("system", BACKGROUND_PROMPT),
        ("user", "{input}")
    ])
    output_parser = StrOutputParser()
    chain = prompt | llm | output_parser
    
    gpt_input = f"""
    This user has recently liked the following papers:\n\n
    {recent_paper_titles}
    The user has also expressed interest in the following topics:\n\n
    {user_interests}\n\n
    Generate a summary of the user's interests and recently liked papers.
    Include information on what kind of research papers the user would like to
    read next.
    """
    
    return chain.invoke(gpt_input)

if __name__ == "__main__":
    main()