"""
要約の基底クラスとインターフェースを定義します。
"""
from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional

from ..utils.logger import get_logger


logger = get_logger("summarizers")


class Summarizer(ABC):
    """
    要約の基底クラス
    """
    
    def __init__(self, config: Optional[Dict[str, Any]] = None):
        """
        初期化
        
        Args:
            config (dict, optional): 設定オプション
        """
        self.config = config or {}
    
    @abstractmethod
    def summarize(self, text: str, metadata: Optional[Dict[str, Any]] = None) -> str:
        """
        テキストを要約します。
        
        Args:
            text (str): 要約するテキスト
            metadata (dict, optional): 入力に関するメタデータ
            
        Returns:
            str: 要約結果のテキスト
            
        Raises:
            ValueError: 要約に失敗した場合
        """
        pass
    
    @abstractmethod
    def get_metadata(self) -> Dict[str, Any]:
        """
        要約に関するメタデータを取得します。
        
        Returns:
            dict: メタデータの辞書
        """
        pass


def get_summarizer(
    summarizer_type: str = "openai",
    config: Optional[Dict[str, Any]] = None,
) -> Summarizer:
    """
    適切な要約モジュールを取得します。
    
    Args:
        summarizer_type (str): 要約のタイプ ('openai', 'local_llm')
        config (dict, optional): 設定オプション
        
    Returns:
        Summarizer: 適切な要約モジュール
        
    Raises:
        ValueError: 未対応の要約タイプの場合
    """
    from .openai_summarizer import OpenAISummarizer
    from .local_llm_summarizer import LocalLLMSummarizer
    
    config = config or {}
    
    if summarizer_type == "openai":
        return OpenAISummarizer(config)
    elif summarizer_type == "local_llm":
        return LocalLLMSummarizer(config)
    else:
        raise ValueError(f"Unsupported summarizer type: {summarizer_type}")
