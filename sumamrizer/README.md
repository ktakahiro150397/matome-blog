# サマライザー（Summarizer）

## 概要

本プロジェクトは、URL・テキスト・動画など多様な入力から内容を文字起こしし、要約をマークダウン形式で出力するPythonアプリケーションです。動画の文字起こしにはローカルGPUを活用し、高速かつ高精度な処理を実現します。

## インストール方法

### 前提条件
- Python 3.8以上
- GPU対応の場合はCUDA環境（オプション）

### インストール手順

1. リポジトリをクローン
```bash
git clone https://github.com/your-username/sumamrizer.git
cd sumamrizer
```

2. 環境変数の設定
```bash
cp .env.example .env
# .envファイルを編集してAPIキーなどを設定
```

3. 依存パッケージのインストール
```bash
# uvを使用する場合
pip install uv
uv pip install -e .

# pipを使用する場合
pip install -e .
```

## 使用方法

### 基本的な使い方

```bash
# URLから取得して要約
python main.py https://example.com/article

# ローカルテキストファイルを要約
python main.py path/to/document.txt

# 動画/音声ファイルを文字起こしして要約
python main.py path/to/video.mp4
```

### オプション

```bash
# コンソールに出力
python main.py input.txt -o console

# GPU使用を指定
python main.py video.mp4 -g true

# OpenAI GPT-4モデルを使用
python main.py input.txt -s openai -m gpt-4

# ローカルLLMを使用
python main.py input.txt -s local_llm

# Whisperモデルサイズを変更
python main.py audio.mp3 -w medium
```

### ヘルプ
```bash
python main.py --help
```

## 主な処理フロー

1. **入力取得**
    - URL、テキスト、動画ファイルなど、さまざまな入力に対応
2. **文字起こし**
    - テキストはそのまま、動画や音声はGPU対応の音声認識ライブラリ（例：Whisper等）で文字起こし
    - GPUが利用可能な場合は自動でGPUを使用
3. **要約**
    - 文字起こし結果を要約モデル（例：LLM、HuggingFace Transformers等）でマークダウン形式に要約
4. **出力**
    - 要約結果をマークダウン形式でファイル出力、または標準出力

## アーキテクチャ

- `inputs/`：各種入力ハンドラ
- `transcribers/`：文字起こし実装（GPU対応）
- `summarizers/`：要約実装
- `outputs/`：出力実装
- `utils/logger.py`：ローテーション付きロガー設定
- `main.py`：全体フロー制御

## ログ出力
- Python標準の`logging`＋`RotatingFileHandler`でローカルファイルにログ出力
- ログレベル（DEBUG/INFO/WARNING/ERROR）を適切に設定
- ログファイルはサイズや世代で自動ローテーション

## 今後の実装予定
- 要約テンプレートのカスタマイズ
- Web UIの追加
- より多様な入力形式のサポート
- 複数言語対応の強化

---

ご要望・ご質問はIssueまたはPRでお知らせください。
