"""
テキスト入力ハンドラの実装
"""
import os
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, Optional, Union

from ..utils.logger import get_logger
from . import InputHandler


logger = get_logger("inputs.text")


class TextInputHandler(InputHandler):
    """
    テキストファイルまたは直接テキスト入力のハンドラ
    """
    
    def __init__(self, source: Union[str, Path], config: Optional[Dict[str, Any]] = None):
        """
        初期化
        
        Args:
            source (str or Path): ファイルパスまたはテキスト
            config (dict, optional): 設定オプション
        """
        super().__init__(config)
        self.source = str(source)
        self.is_file = Path(self.source).is_file()
        self.file_path = Path(self.source) if self.is_file else None
        
        logger.debug(f"TextInputHandler initialized: {'file' if self.is_file else 'direct text'}")
    
    def read(self) -> str:
        """
        テキストを読み取ります。
        ファイルの場合はファイルを読み、それ以外の場合は直接テキストとして扱います。
        
        Returns:
            str: 読み取ったテキスト
            
        Raises:
            FileNotFoundError: ファイルが存在しない場合
            IOError: ファイルの読み取りに失敗した場合
        """
        if self.is_file:
            try:
                logger.info(f"Reading text from file: {self.file_path}")
                encoding = self.config.get("encoding", "utf-8")
                with open(self.file_path, 'r', encoding=encoding) as f:
                    content = f.read()
                logger.debug(f"Successfully read {len(content)} characters from file")
                return content
            except (IOError, UnicodeDecodeError) as e:
                logger.error(f"Failed to read file {self.file_path}: {e}")
                raise IOError(f"Failed to read file {self.file_path}: {e}")
        else:
            logger.info("Using direct text input")
            return self.source
    
    def get_metadata(self) -> Dict[str, Any]:
        """
        テキスト入力に関するメタデータを取得します。
        
        Returns:
            dict: メタデータの辞書
        """
        metadata = {
            "type": "text",
            "timestamp": datetime.now().isoformat(),
        }
        
        if self.is_file:
            metadata.update({
                "source": "file",
                "file_path": str(self.file_path),
                "file_name": self.file_path.name,
                "modified_time": datetime.fromtimestamp(
                    os.path.getmtime(self.file_path)
                ).isoformat(),
                "size_bytes": os.path.getsize(self.file_path),
            })
        else:
            metadata.update({
                "source": "direct_input",
                "length": len(self.source),
            })
        
        return metadata
