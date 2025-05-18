import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate


def summarize_text_file(filepath: str) -> str:
    """
    テキストファイルを読み込み、LangChain+OpenAIで要約し、マークダウン形式で返す
    """
    load_dotenv()
    with open(filepath, "r", encoding="utf-8") as f:
        text = f.read()

    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        raise RuntimeError("OPENAI_API_KEYが環境変数に設定されていません")

    llm = ChatOpenAI(api_key=api_key, model="gpt-4.1-mini")
    prompt = ChatPromptTemplate.from_template(
        """
        次のテキストを日本語で分かりやすく要約し、マークダウン形式で出力してください。
        ---
        {text}
        ---
        """
    )
    chain = prompt | llm
    result = chain.invoke({"text": text})
    return result.content
