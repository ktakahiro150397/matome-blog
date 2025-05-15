"""
Whisperを使用した音声・動画文字起こしの実装
"""
import os
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, Optional, Union

from ..utils.logger import get_logger
from . import Transcriber


logger = get_logger("transcribers.whisper")


class WhisperTranscriber(Transcriber):
    """
    OpenAI WhisperまたはFaster-Whisperを使用した文字起こしクラス
    """
    
    def __init__(self, config: Optional[Dict[str, Any]] = None):
        """
        初期化
        
        Args:
            config (dict, optional): 設定オプション
        """
        super().__init__(config)
        self.model = None
        self.model_name = config.get("model_name", "base")
        self.use_faster_whisper = config.get("use_faster_whisper", True)
        self.device = self._get_device()
        self.language = config.get("language", "auto")
        self.last_transcript = ""
        self.processing_time = 0
        self.segments = []
        
        logger.debug(f"WhisperTranscriber initialized: model={self.model_name}, device={self.device}")
    
    def _get_device(self) -> str:
        """
        使用するデバイスを取得します。
        
        Returns:
            str: 'cuda'（GPU）または'cpu'
        """
        use_gpu = self.config.get("use_gpu", "auto")
        
        if use_gpu == "false":
            return "cpu"
        
        # GPUが利用可能かチェック
        try:
            import torch
            if use_gpu == "true" or (use_gpu == "auto" and torch.cuda.is_available()):
                logger.info("Using GPU for transcription")
                return "cuda"
            else:
                logger.info("GPU not available, using CPU")
                return "cpu"
        except ImportError:
            logger.warning("PyTorch not installed, falling back to CPU")
            return "cpu"
        except Exception as e:
            logger.warning(f"Error checking GPU availability: {e}, falling back to CPU")
            return "cpu"
    
    def _load_model(self):
        """
        Whisperモデルをロードします。
        faster-whisperが利用可能な場合はそちらを優先して使用します。
        
        Raises:
            ImportError: 必要なライブラリがインストールされていない場合
            RuntimeError: モデルのロードに失敗した場合
        """
        if self.model is not None:
            return
        
        try:
            if self.use_faster_whisper:
                try:
                    from faster_whisper import WhisperModel
                    
                    logger.info(f"Loading faster-whisper model: {self.model_name}")
                    # CPUの場合はint8を使用し、GPUの場合はfloat16を使用
                    compute_type = "float16" if self.device == "cuda" else "int8"
                    
                    self.model = WhisperModel(
                        self.model_name,
                        device=self.device,
                        compute_type=compute_type
                    )
                    logger.info("faster-whisper model loaded successfully")
                    return
                except ImportError:
                    logger.warning("faster-whisper not available, falling back to openai-whisper")
                    self.use_faster_whisper = False
            
            # OpenAI Whisperを使用
            import whisper
            
            logger.info(f"Loading openai-whisper model: {self.model_name}")
            self.model = whisper.load_model(
                self.model_name,
                device=self.device
            )
            logger.info("openai-whisper model loaded successfully")
            
        except Exception as e:
            error_msg = f"Failed to load Whisper model: {e}"
            logger.error(error_msg)
            raise RuntimeError(error_msg)
    
    def transcribe(self, source: Union[str, Path]) -> str:
        """
        音声または動画ファイルを文字起こしします。
        
        Args:
            source (str or Path): 音声または動画ファイルのパス
            
        Returns:
            str: 文字起こし結果のテキスト
            
        Raises:
            FileNotFoundError: ファイルが存在しない場合
            ValueError: サポートされていないファイル形式の場合
            RuntimeError: 文字起こしに失敗した場合
        """
        source_path = Path(source)
        
        if not source_path.exists():
            error_msg = f"File not found: {source_path}"
            logger.error(error_msg)
            raise FileNotFoundError(error_msg)
        
        # サポートする拡張子をチェック
        supported_exts = [".mp3", ".mp4", ".wav", ".m4a", ".webm"]
        if source_path.suffix.lower() not in supported_exts:
            error_msg = (f"Unsupported file format: {source_path.suffix}. "
                        f"Supported formats: {', '.join(supported_exts)}")
            logger.error(error_msg)
            raise ValueError(error_msg)
        
        start_time = datetime.now()
        
        try:
            # モデルをロード
            self._load_model()
            
            # 文字起こしを実行
            logger.info(f"Starting transcription of: {source_path}")
            
            if self.use_faster_whisper:
                # faster-whisperの場合
                segments, info = self.model.transcribe(
                    str(source_path),
                    language=None if self.language == "auto" else self.language,
                    beam_size=5,
                    word_timestamps=True
                )
                
                # セグメントを保存しテキストを結合
                self.segments = list(segments)  # segmentsはジェネレータなのでリストに変換
                self.last_transcript = "\n".join([segment.text for segment in self.segments])
                
                detected_language = info.language
                logger.info(f"Detected language: {detected_language}")
                
            else:
                # openai-whisperの場合
                transcribe_options = {
                    "language": None if self.language == "auto" else self.language,
                    "fp16": self.device == "cuda"
                }
                
                result = self.model.transcribe(str(source_path), **transcribe_options)
                
                self.last_transcript = result["text"]
                self.segments = result["segments"]
                detected_language = result["language"]
                logger.info(f"Detected language: {detected_language}")
            
            self.processing_time = (datetime.now() - start_time).total_seconds()
            logger.info(f"Transcription completed in {self.processing_time:.2f} seconds")
            
            return self.last_transcript
            
        except Exception as e:
            self.processing_time = (datetime.now() - start_time).total_seconds()
            error_msg = f"Transcription failed after {self.processing_time:.2f} seconds: {e}"
            logger.error(error_msg)
            raise RuntimeError(error_msg)
    
    def get_metadata(self) -> Dict[str, Any]:
        """
        文字起こしに関するメタデータを取得します。
        
        Returns:
            dict: メタデータの辞書
        """
        return {
            "transcriber": "whisper",
            "implementation": "faster-whisper" if self.use_faster_whisper else "openai-whisper",
            "model_name": self.model_name,
            "device": self.device,
            "processing_time_seconds": self.processing_time,
            "timestamp": datetime.now().isoformat(),
            "text_length": len(self.last_transcript),
            "segment_count": len(self.segments) if hasattr(self, "segments") else 0,
        }
