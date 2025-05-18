# summarizer

## 概要
テキストファイルまたはYouTube動画を要約し、マークダウン形式で出力するPython CLIツールです。要約処理にはLangChainとOpenAI APIを利用しています。

- テキストファイル: ファイル内容を要約し、output/配下にマークダウン形式で出力
- YouTube動画: URLを指定すると音声を文字起こしし、その生データと要約をoutput/配下にテキストで出力
- 進捗やエラーはsummarizer.logに詳細に記録
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
# → output/入力ファイル名_summary.txt に要約結果が保存されます
```

### YouTube動画を要約
```zsh
python main.py -i https://www.youtube.com/watch?v=xxxxxx
# → output/youtube_日付時刻_raw.txt に文字起こし生データ
# → output/youtube_日付時刻_summary.txt に要約結果
```

#### 出力先ディレクトリを変更したい場合
```zsh
python main.py -i 入力ファイル.txt --output-dir results
```

## ログについて
- 実行中の進捗やエラーは summarizer.log に記録されます。
- ログにはファイル名・行数・タイムスタンプも含まれます。

## 注意事項
- OpenAI APIキーが必要です。
- YouTube動画の要約は音声認識＋要約の2段階で行われるため、処理に時間がかかる場合があります。
- output/・summarizer.logは.gitignoreによりGit管理対象外です。

## ライセンス
MIT
