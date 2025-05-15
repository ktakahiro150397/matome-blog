"""
OpenAI APIを使用した要約の実装
"""
import os
from datetime import datetime
from typing import Any, Dict, List, Optional

from langchain.chains.summarize import load_summarize_chain
from langchain.prompts import PromptTemplate
from langchain.schema import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import ChatOpenAI

from ..utils.logger import get_logger
from . import Summarizer


logger = get_logger("summarizers.openai")


class OpenAISummarizer(Summarizer):
    """
    OpenAI API (GPT)を使用した要約クラス
    LangChainを利用して実装します。
    """
    
    def __init__(self, config: Optional[Dict[str, Any]] = None):
        """
        初期化
        
        Args:
            config (dict, optional): 設定オプション
        """
        super().__init__(config)
        self.model_name = config.get("model_name", "gpt-3.5-turbo")
        self.temperature = config.get("temperature", 0)
        self.max_tokens = config.get("max_tokens", 2000)
        self.chunk_size = config.get("chunk_size", 4000)
        self.chunk_overlap = config.get("chunk_overlap", 200)
        self.processing_time = 0
        self.input_tokens = 0
        self.output_tokens = 0
        self.api_key = config.get("api_key") or os.environ.get("OPENAI_API_KEY")
        
        # APIキーが設定されているか確認
        if not self.api_key:
            logger.warning("OpenAI API key not set. Please set OPENAI_API_KEY environment variable.")
        
        logger.debug(f"OpenAISummarizer initialized: model={self.model_name}")
    
    def _get_llm(self):
        """
        LangChain用のLLMモデルを取得します。
        
        Returns:
            ChatOpenAI: LangChain用のLLMモデル
        """
        return ChatOpenAI(
            model_name=self.model_name,
            temperature=self.temperature,
            max_tokens=self.max_tokens,
            api_key=self.api_key,
            verbose=self.config.get("verbose", False)
        )
    
    def _get_prompt_templates(self, metadata: Optional[Dict[str, Any]] = None):
        """
        要約用のプロンプトテンプレートを取得します。
        
        Args:
            metadata (dict, optional): 入力に関するメタデータ
            
        Returns:
            tuple: (map_template, combine_template)のタプル
        """
        # メタデータからタイトルを取得（あれば）
        title = ""
        if metadata and "title" in metadata:
            title = metadata["title"]
        elif metadata and "file_name" in metadata:
            title = metadata["file_name"]
        
        # 要約の文脈を設定
        context = ""
        if metadata and "type" in metadata:
            if metadata["type"] == "url":
                context = f"このテキストはウェブページ「{title}」から抽出されたものです。"
            elif metadata["type"] == "media":
                context = f"このテキストは音声/動画ファイル「{title}」から文字起こしされたものです。"
            elif metadata["type"] == "text":
                context = f"このテキストは「{title}」から取得されたものです。"
        
        # チャンク要約用プロンプト
        map_template = PromptTemplate(
            template="""
{context}
以下のテキストの重要な情報を抽出し、簡潔に要約してください。
テキストの内容を忠実に反映し、情報を追加したり省略したりしないでください。

テキスト:
{text}

要約:
""",
            input_variables=["text"],
            partial_variables={"context": context}
        )
        
        # 最終要約用プロンプト
        combine_template = PromptTemplate(
            template="""
{context}
以下の要約を統合して、一貫性のある最終的な要約を作成してください。
要約はマークダウン形式で、以下の構造で作成してください：

1. タイトル（# で始まる）
2. 概要（2-3文で全体を要約）
3. 主要ポイント（## 見出しで区切られた箇条書きリスト）
4. 詳細（必要に応じて ### 見出しで区切られたサブセクション）
5. まとめ（全体の結論）

要約は簡潔で読みやすく、元の内容を正確に反映するものにしてください。
見出しは内容を適切に反映した具体的なものにしてください。
「主要ポイント」「詳細」などの一般的な見出しは避けてください。

テキスト要約:
{text}

最終要約（マークダウン形式）:
""",
            input_variables=["text"],
            partial_variables={"context": context}
        )
        
        return map_template, combine_template
    
    def summarize(self, text: str, metadata: Optional[Dict[str, Any]] = None) -> str:
        """
        テキストを要約します。
        長いテキストは自動的にチャンクに分割して処理します。
        
        Args:
            text (str): 要約するテキスト
            metadata (dict, optional): 入力に関するメタデータ
            
        Returns:
            str: 要約結果のテキスト（マークダウン形式）
            
        Raises:
            ValueError: APIキーが設定されていない場合や要約に失敗した場合
        """
        if not self.api_key:
            error_msg = "OpenAI API key not set. Please set OPENAI_API_KEY environment variable."
            logger.error(error_msg)
            raise ValueError(error_msg)
        
        if not text or len(text) < 100:
            logger.warning("Text is too short to summarize, returning original text")
            return text
        
        start_time = datetime.now()
        
        try:
            # テキストをチャンクに分割
            text_splitter = RecursiveCharacterTextSplitter(
                chunk_size=self.chunk_size,
                chunk_overlap=self.chunk_overlap,
                separators=["\n\n", "\n", "。", ".", " ", ""]
            )
            
            docs = [Document(page_content=t) for t in text_splitter.split_text(text)]
            logger.info(f"Text split into {len(docs)} chunks")
            
            # プロンプトテンプレートを取得
            map_template, combine_template = self._get_prompt_templates(metadata)
            
            # 要約チェーンを作成
            chain = load_summarize_chain(
                llm=self._get_llm(),
                chain_type="map_reduce",
                map_prompt=map_template,
                combine_prompt=combine_template,
                verbose=self.config.get("verbose", False)
            )
            
            # 要約を実行
            logger.info("Starting summarization with OpenAI API")
            summary = chain.invoke(docs)
            
            self.processing_time = (datetime.now() - start_time).total_seconds()
            logger.info(f"Summarization completed in {self.processing_time:.2f} seconds")
            
            # 結果からテキストを取得
            summary_text = summary["output_text"] if isinstance(summary, dict) else str(summary)
            
            return summary_text.strip()
            
        except Exception as e:
            self.processing_time = (datetime.now() - start_time).total_seconds()
            error_msg = f"Summarization failed after {self.processing_time:.2f} seconds: {e}"
            logger.error(error_msg)
            raise ValueError(error_msg)
    
    def get_metadata(self) -> Dict[str, Any]:
        """
        要約に関するメタデータを取得します。
        
        Returns:
            dict: メタデータの辞書
        """
        return {
            "summarizer": "openai",
            "model_name": self.model_name,
            "processing_time_seconds": self.processing_time,
            "timestamp": datetime.now().isoformat(),
            "config": {
                "temperature": self.temperature,
                "max_tokens": self.max_tokens,
                "chunk_size": self.chunk_size,
                "chunk_overlap": self.chunk_overlap
            }
        }
