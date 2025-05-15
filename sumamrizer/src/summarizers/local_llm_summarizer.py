"""
ローカルLLMを使用した要約の実装
"""
import os
from datetime import datetime
from typing import Any, Dict, List, Optional

from langchain.chains.summarize import load_summarize_chain
from langchain.prompts import PromptTemplate
from langchain.schema import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.llms import HuggingFaceEndpoint

from ..utils.logger import get_logger
from . import Summarizer


logger = get_logger("summarizers.local_llm")


class LocalLLMSummarizer(Summarizer):
    """
    ローカルまたはAPI経由のLLMを使用した要約クラス
    LangChainを利用して実装します。
    """
    
    def __init__(self, config: Optional[Dict[str, Any]] = None):
        """
        初期化
        
        Args:
            config (dict, optional): 設定オプション
        """
        super().__init__(config)
        self.model_url = config.get("model_url") or os.environ.get("LOCAL_LLM_URL", "http://localhost:8080/v1")
        self.model_name = config.get("model_name") or os.environ.get("LOCAL_LLM_MODEL", "mistral-7b")
        self.temperature = config.get("temperature", 0.1)
        self.max_tokens = config.get("max_tokens", 2000)
        self.chunk_size = config.get("chunk_size", 2000)  # ローカルLLMは通常コンテキストウィンドウが小さいため
        self.chunk_overlap = config.get("chunk_overlap", 200)
        self.processing_time = 0
        
        logger.debug(f"LocalLLMSummarizer initialized: model={self.model_name}, url={self.model_url}")
    
    def _get_llm(self):
        """
        LangChain用のLLMモデルを取得します。
        
        Returns:
            LLM: LangChain用のLLMモデル
        """
        return HuggingFaceEndpoint(
            endpoint_url=self.model_url,
            task="text-generation",
            model_kwargs={
                "temperature": self.temperature,
                "max_new_tokens": self.max_tokens,
                "do_sample": True
            },
            huggingfacehub_api_token=os.environ.get("HUGGINGFACEHUB_API_TOKEN", None),
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
        
        # チャンク要約用プロンプト（ローカルLLM用に簡略化）
        map_template = PromptTemplate(
            template="""
{context}
以下のテキストを要約してください。重要な情報だけを含め、簡潔にまとめてください。

テキスト:
{text}

要約:
""",
            input_variables=["text"],
            partial_variables={"context": context}
        )
        
        # 最終要約用プロンプト（ローカルLLM用に簡略化）
        combine_template = PromptTemplate(
            template="""
{context}
以下の要約を統合して、マークダウン形式の最終要約を作成してください。
以下の構造に従ってください：

1. タイトル（# で始まる）
2. 概要（2-3文）
3. 主要ポイント（## 見出し、箇条書きリスト）
4. まとめ

要約テキスト:
{text}

マークダウン形式の最終要約:
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
            ValueError: LLMサーバーに接続できない場合や要約に失敗した場合
        """
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
            logger.info(f"Starting summarization with local LLM: {self.model_name}")
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
            "summarizer": "local_llm",
            "model_name": self.model_name,
            "model_url": self.model_url,
            "processing_time_seconds": self.processing_time,
            "timestamp": datetime.now().isoformat(),
            "config": {
                "temperature": self.temperature,
                "max_tokens": self.max_tokens,
                "chunk_size": self.chunk_size,
                "chunk_overlap": self.chunk_overlap
            }
        }
