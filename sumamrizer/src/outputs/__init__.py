"""
出力処理の基底クラスとインターフェースを定義します。
"""
from abc import ABC, abstractmethod
from pathlib import Path
from typing import Any, Dict, Optional, Union

from ..utils.logger import get_logger


logger = get_logger("outputs")


class OutputHandler(ABC):
    """
    出力処理の基底クラス
    """
    
    def __init__(self, config: Optional[Dict[str, Any]] = None):
        """
        初期化
        
        Args:
            config (dict, optional): 設定オプション
        """
        self.config = config or {}
    
    @abstractmethod
    def write(self, content: str, metadata: Optional[Dict[str, Any]] = None) -> str:
        """
        コンテンツを出力します。
        
        Args:
            content (str): 出力するコンテンツ
            metadata (dict, optional): 入力や処理に関するメタデータ
            
        Returns:
            str: 出力先の情報（ファイルパスなど）
            
        Raises:
            IOError: 出力に失敗した場合
        """
        pass


def get_output_handler(
    output_type: str = "markdown",
    config: Optional[Dict[str, Any]] = None,
) -> OutputHandler:
    """
    適切な出力ハンドラを取得します。
    
    Args:
        output_type (str): 出力タイプ ('markdown', 'console')
        config (dict, optional): 設定オプション
        
    Returns:
        OutputHandler: 適切な出力ハンドラ
        
    Raises:
        ValueError: 未対応の出力タイプの場合
    """
    from .markdown_output import MarkdownOutputHandler
    from .console_output import ConsoleOutputHandler
    
    config = config or {}
    
    if output_type == "markdown":
        return MarkdownOutputHandler(config)
    elif output_type == "console":
        return ConsoleOutputHandler(config)
    else:
        raise ValueError(f"Unsupported output type: {output_type}")
