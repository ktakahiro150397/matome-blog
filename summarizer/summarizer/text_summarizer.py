import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate


def _summarize(text: str, logger, prompt_template: str) -> str:
    """
    共通の要約処理本体。text, logger, prompt_templateを受け取る。
    """
    load_dotenv()
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        logger.error("OPENAI_API_KEYが環境変数に設定されていません")
        raise RuntimeError("OPENAI_API_KEYが環境変数に設定されていません")
    llm = ChatOpenAI(api_key=api_key, model="gpt-4.1-mini")
    prompt = ChatPromptTemplate.from_template(prompt_template)
    chain = prompt | llm
    logger.info("要約リクエスト送信中...")
    try:
        result = chain.invoke({"text": text})
        logger.info("要約完了")
        return result.content
    except Exception as e:
        logger.error(f"LangChain/OpenAI error: {e}")
        raise


PROMPT_TEMPLATE = """
次のテキストを日本語で分かりやすく要約し、マークダウン形式で出力してください。
---
{text}
---
"""


def summarize_text_file(filepath: str) -> str:
    """
    テキストファイルを読み込み、LangChain+OpenAIで要約し、マークダウン形式で返す
    """
    from summarizer.youtube_summarizer import logger

    logger.info(f"summarize_text_file called with: {filepath}")
    with open(filepath, "r", encoding="utf-8") as f:
        text = f.read()
    logger.debug(f"File loaded: {filepath}, {len(text)} bytes")
    return _summarize(text, logger, PROMPT_TEMPLATE)


def summarize_text(text: str) -> str:
    """
    テキストを直接受け取り、LangChain+OpenAIで要約し、マークダウン形式で返す
    """
    from summarizer.youtube_summarizer import logger

    logger.info(f"summarize_text called. text length: {len(text)}")
    return _summarize(text, logger, PROMPT_TEMPLATE)
