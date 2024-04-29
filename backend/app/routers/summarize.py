from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from dotenv import load_dotenv
from typing import List


BACKGROUND_PROMPT = "You are a world class technical documentation writer."


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


def summarize(text: str):
    prompt = f"Generate a two sentence summary of the following research abstract \
               in simple terms: {text}"
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


def test():
    abstract = """
    The dominant sequence transduction models are based on complex recurrent or
    convolutional neural networks in an encoder-decoder configuration. The best
    performing models also connect the encoder and decoder through an attention
    mechanism. We propose a new simple network architecture, the Transformer,
    based solely on attention mechanisms, dispensing with recurrence and
    convolutions entirely. Experiments on two machine translation tasks show
    these models to be superior in quality while being more parallelizable and
    requiring significantly less time to train. Our model achieves 28.4 BLEU on
    the WMT 2014 English-to-German translation task, improving over the existing
    best results, including ensembles by over 2 BLEU. On the WMT 2014
    English-to-French translation task, our model establishes a new single-model
    state-of-the-art BLEU score of 41.8 after training for 3.5 days on eight
    GPUs, a small fraction of the training costs of the best models from the
    literature. We show that the Transformer generalizes well to other tasks by
    applying it successfully to English constituency parsing both with large and
    limited training data.
    """
    print("Abstract:", abstract)
    result = summarize(abstract)
    print("Summary:", result)

if __name__ == '__main__':
    load_dotenv()
    test()





