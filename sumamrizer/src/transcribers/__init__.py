"""
文字起こしの基底クラスとインターフェースを定義します。
"""
from abc import ABC, abstractmethod
from pathlib import Path
from typing import Any, Dict, Optional, Union

from ..utils.logger import get_logger


logger = get_logger("transcribers")


class Transcriber(ABC):
    """
    文字起こしの基底クラス
    """
    
    def __init__(self, config: Optional[Dict[str, Any]] = None):
        """
        初期化
        
        Args:
            config (dict, optional): 設定オプション
        """
        self.config = config or {}
        
    @abstractmethod
    def transcribe(self, source: Union[str, Path]) -> str:
        """
        ソースを文字起こしします。
        
        Args:
            source (str or Path): 文字起こし対象のソース（ファイルパスなど）
            
        Returns:
            str: 文字起こし結果のテキスト
            
        Raises:
            ValueError: 文字起こしに失敗した場合
        """
        pass
    
    @abstractmethod
    def get_metadata(self) -> Dict[str, Any]:
        """
        文字起こしに関するメタデータを取得します。
        
        Returns:
            dict: メタデータの辞書
        """
        pass


def get_transcriber(
    transcriber_type: str = "auto",
    config: Optional[Dict[str, Any]] = None,
) -> Transcriber:
    """
    適切な文字起こしモジュールを取得します。
    
    Args:
        transcriber_type (str): 文字起こしのタイプ ('whisper', 'faster_whisper', 'text', 'auto')
        config (dict, optional): 設定オプション
        
    Returns:
        Transcriber: 適切な文字起こしモジュール
        
    Raises:
        ValueError: 未対応の文字起こしタイプの場合
    """
    from .text_transcriber import TextTranscriber
    from .whisper_transcriber import WhisperTranscriber
    
    config = config or {}
    
    if transcriber_type == "text":
        return TextTranscriber(config)
    elif transcriber_type == "whisper":
        return WhisperTranscriber(config)
    elif transcriber_type == "auto":
        # 自動選択ロジック（設定や入力タイプに基づいて適切なものを選択）
        use_gpu = config.get("use_gpu", "auto")
        if use_gpu == "true" or (use_gpu == "auto" and _is_gpu_available()):
            logger.info("GPU detected, using Whisper for transcription")
            return WhisperTranscriber(config)
        else:
            logger.info("Using generic text transcriber")
            return TextTranscriber(config)
    else:
        raise ValueError(f"Unsupported transcriber type: {transcriber_type}")


def _is_gpu_available() -> bool:
    """
    GPUが利用可能かどうかを確認します。
    
    Returns:
        bool: GPUが利用可能な場合はTrue、そうでない場合はFalse
    """
    try:
        import torch
        return torch.cuda.is_available()
    except ImportError:
        logger.warning("PyTorch not installed, GPU detection skipped")
        return False
    except Exception as e:
        logger.warning(f"Error checking GPU availability: {e}")
        return False
