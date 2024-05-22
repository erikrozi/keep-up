from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from dotenv import load_dotenv
from typing import List


BACKGROUND_PROMPT = "You are a world class researcher that is able to explain any research paper."


def llm_init():
    # The API key should be automatically filled in from environment variable
    llm = ChatOpenAI()
    prompt = ChatPromptTemplate.from_messages([
        ("system", BACKGROUND_PROMPT),
        ("user", "{input}")
    ])
    output_parser = StrOutputParser()
    chain = prompt | llm | output_parser
    return chain


def create_abstract_summary(abstract: str):
    prompt = f"Generate a two sentence summary of the following research abstract \
               in simple terms, bolding important keywords and phrases in markdown: {abstract}"
    chain = llm_init()
    result = chain.invoke(prompt)
    return result


def summarize_search(abstracts: List[str]):
    prompt = """
    Generate an overall summary of research from the following abstracts. The \
    overall summary should be integrated together like a cohesive news story 
    which directly mentions some paper topics. Give this to me in markdown format, 
    so I can easily read it. Bold important keywords and phrases. 
    
    Here are the abstracts:\n\n
    """
    for abstract in abstracts:
        if type(abstract) == str:
            prompt += abstract
            prompt += "\n\n"

    chain = llm_init()
    result = chain.invoke(prompt)
    return result