"""
入力ハンドラの基底クラスとインターフェースを定義します。
"""
from abc import ABC, abstractmethod
from pathlib import Path
from typing import Any, Dict, Optional, Union


class InputHandler(ABC):
    """
    入力ハンドラの基底クラス
    """
    
    def __init__(self, config: Optional[Dict[str, Any]] = None):
        """
        初期化
        
        Args:
            config (dict, optional): 設定オプション
        """
        self.config = config or {}
    
    @abstractmethod
    def read(self) -> str:
        """
        入力を読み取り、テキスト形式で返します。
        
        Returns:
            str: 読み取ったテキスト
        
        Raises:
            ValueError: 入力の読み取りに失敗した場合
        """
        pass
    
    @abstractmethod
    def get_metadata(self) -> Dict[str, Any]:
        """
        入力に関するメタデータを取得します。
        
        Returns:
            dict: メタデータの辞書（タイトル、URL、作成日時など）
        """
        pass


def get_input_handler(
    source: Union[str, Path],
    input_type: Optional[str] = None,
    config: Optional[Dict[str, Any]] = None,
) -> InputHandler:
    """
    適切な入力ハンドラを取得します。
    入力タイプが指定されていない場合は自動的に判別します。
    
    Args:
        source (str or Path): 入力ソース（ファイルパス、URL、テキストなど）
        input_type (str, optional): 入力タイプ ('text', 'url', 'file')
        config (dict, optional): 設定オプション
        
    Returns:
        InputHandler: 適切な入力ハンドラ
        
    Raises:
        ValueError: 入力タイプの判別に失敗した場合、または未対応の入力タイプの場合
    """
    from .text_handler import TextInputHandler
    from .url_handler import URLInputHandler
    from .media_handler import MediaInputHandler
    
    config = config or {}
    source_str = str(source)
    
    # 入力タイプが指定されていない場合は自動的に判別
    if input_type is None:
        if source_str.startswith(("http://", "https://")):
            input_type = "url"
        elif Path(source_str).is_file():
            # ファイル拡張子で判別
            ext = Path(source_str).suffix.lower()
            if ext in [".mp3", ".mp4", ".wav", ".m4a", ".webm"]:
                input_type = "media"
            else:
                input_type = "text"
        else:
            # ファイルでもURLでもない場合はテキストとして扱う
            input_type = "text"
    
    # 適切なハンドラを返す
    if input_type == "text":
        return TextInputHandler(source, config)
    elif input_type == "url":
        return URLInputHandler(source, config)
    elif input_type == "media":
        return MediaInputHandler(source, config)
    else:
        raise ValueError(f"Unsupported input type: {input_type}")
