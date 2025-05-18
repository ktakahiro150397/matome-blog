# summarizer

## 概要
テキストファイルまたはYouTube動画（※現状は未実装）を要約し、マークダウン形式で出力するPython CLIツールです。要約処理にはLangChainとOpenAI APIを利用しています。

- テキストファイル: ファイル内容を要約し、マークダウン形式で出力
- YouTube動画: URLを指定すると未実装エラー（将来的に音声認識→要約を実装予定）
- 仮想環境・依存管理は[uv](https://github.com/astral-sh/uv)を利用

## セットアップ
1. リポジトリをクローン
2. uvで仮想環境を作成し依存パッケージをインストール

```zsh
uv venv
uv pip install -r pyproject.toml
```

3. `.env` ファイルを作成し、OpenAI APIキーを設定

```zsh
cp .env.sample .env
# .envを編集してOPENAI_API_KEYを記入
```

## 使い方

### テキストファイルを要約
```zsh
python main.py -i 入力ファイル.txt
```

### YouTube動画を要約（未実装）
```zsh
python main.py -i https://www.youtube.com/watch?v=xxxxxx
# → NotImplementedError
```

## 注意事項
- OpenAI APIキーが必要です。
- YouTube動画の音声認識・要約は今後実装予定です。

## ライセンス
MIT
