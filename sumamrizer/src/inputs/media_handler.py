"""
動画/音声ファイル入力ハンドラの実装
"""
import os
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, Optional, Union

from ..utils.logger import get_logger
from . import InputHandler


logger = get_logger("inputs.media")


class MediaInputHandler(InputHandler):
    """
    動画/音声ファイルの入力ハンドラ
    """
    
    def __init__(self, file_path: Union[str, Path], config: Optional[Dict[str, Any]] = None):
        """
        初期化
        
        Args:
            file_path (str or Path): 動画/音声ファイルのパス
            config (dict, optional): 設定オプション
        """
        super().__init__(config)
        self.file_path = Path(file_path)
        
        if not self.file_path.exists():
            raise FileNotFoundError(f"File not found: {self.file_path}")
        
        # サポートする拡張子をチェック
        supported_exts = [".mp3", ".mp4", ".wav", ".m4a", ".webm"]
        if self.file_path.suffix.lower() not in supported_exts:
            raise ValueError(
                f"Unsupported file format: {self.file_path.suffix}. "
                f"Supported formats: {', '.join(supported_exts)}"
            )
        
        logger.debug(f"MediaInputHandler initialized for: {self.file_path}")
    
    def read(self) -> str:
        """
        動画/音声ファイルの情報を読み取ります。
        実際の文字起こしはtranscribersモジュールで行われるため、
        このメソッドではファイルの存在確認とメタデータ収集のみを行います。
        
        Returns:
            str: ファイルパス（文字列形式）
            
        Raises:
            FileNotFoundError: ファイルが存在しない場合
            ValueError: サポートされていないファイル形式の場合
        """
        if not self.file_path.exists():
            error_msg = f"File not found: {self.file_path}"
            logger.error(error_msg)
            raise FileNotFoundError(error_msg)
        
        logger.info(f"Media file ready for transcription: {self.file_path}")
        return str(self.file_path)
    
    def get_metadata(self) -> Dict[str, Any]:
        """
        メディアファイルに関するメタデータを取得します。
        
        Returns:
            dict: メタデータの辞書
        """
        # ファイルの基本情報を取得
        stat = os.stat(self.file_path)
        
        metadata = {
            "type": "media",
            "source": "file",
            "file_path": str(self.file_path),
            "file_name": self.file_path.name,
            "file_extension": self.file_path.suffix.lower(),
            "size_bytes": stat.st_size,
            "created_time": datetime.fromtimestamp(stat.st_ctime).isoformat(),
            "modified_time": datetime.fromtimestamp(stat.st_mtime).isoformat(),
            "timestamp": datetime.now().isoformat(),
        }
        
        # 動画/音声の詳細情報取得を試みる（オプション）
        try:
            # この部分は将来的にffprobeなどを使って拡張することができます
            # 現時点では基本情報のみを返します
            pass
        except Exception as e:
            logger.warning(f"Failed to get detailed media info: {e}")
        
        return metadata
