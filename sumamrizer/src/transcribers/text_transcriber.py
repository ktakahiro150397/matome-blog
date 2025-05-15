"""
テキスト文字起こしの実装（テキストをそのまま返す）
"""
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, Optional, Union

from ..utils.logger import get_logger
from . import Transcriber


logger = get_logger("transcribers.text")


class TextTranscriber(Transcriber):
    """
    テキスト文字起こしクラス。
    既にテキストの場合はそのまま返します。
    """
    
    def __init__(self, config: Optional[Dict[str, Any]] = None):
        """
        初期化
        
        Args:
            config (dict, optional): 設定オプション
        """
        super().__init__(config)
        self.last_transcript = ""
        self.processing_time = 0
        logger.debug("TextTranscriber initialized")
    
    def transcribe(self, source: Union[str, Path]) -> str:
        """
        テキストをそのまま返します。
        ファイルパスの場合はファイルを読み込みます。
        
        Args:
            source (str or Path): テキストまたはテキストファイルのパス
            
        Returns:
            str: 元のテキスト
            
        Raises:
            FileNotFoundError: ファイルが存在しない場合
            IOError: ファイルの読み取りに失敗した場合
        """
        start_time = datetime.now()
        
        # ファイルパスかどうかをチェック
        source_path = Path(source) if isinstance(source, (str, Path)) else None
        
        if source_path and source_path.is_file():
            try:
                logger.info(f"Reading text from file: {source_path}")
                encoding = self.config.get("encoding", "utf-8")
                with open(source_path, 'r', encoding=encoding) as f:
                    self.last_transcript = f.read()
            except (IOError, UnicodeDecodeError) as e:
                error_msg = f"Failed to read file {source_path}: {e}"
                logger.error(error_msg)
                raise IOError(error_msg)
        else:
            # 文字列として処理
            logger.info("Processing direct text input")
            self.last_transcript = str(source)
        
        self.processing_time = (datetime.now() - start_time).total_seconds()
        logger.debug(f"Text processing completed in {self.processing_time:.2f} seconds")
        
        return self.last_transcript
    
    def get_metadata(self) -> Dict[str, Any]:
        """
        文字起こしに関するメタデータを取得します。
        
        Returns:
            dict: メタデータの辞書
        """
        return {
            "transcriber": "text",
            "processing_time_seconds": self.processing_time,
            "timestamp": datetime.now().isoformat(),
            "text_length": len(self.last_transcript),
        }
