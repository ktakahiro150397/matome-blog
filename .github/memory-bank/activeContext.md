# Active Context

## Current Focus

- ブログ機能の拡張
- UI/UXの改善（ナビゲーションのLink構造刷新、BlogCard・記事リストのデザイン微調整）
- SEO対応の実装
- 検索・ページネーション・同期スクリプトの実装・テスト
- 検索・ページネーション・UIの異常系・エッジケースのテスト拡充（完了）

### BlogCard・記事リストのUI/UX細部改善

- タグリンクのUI/UX向上（hover/focus時の色強調、タップ領域拡大、丸み・アクセシビリティ向上）
- サムネイル画像の角丸・影・レイアウト最適化
- タイトルの太字・サイズ調整・hover時色変化
- カードの余白・影・ボーダー強調、hover時はボーダー色のみprimaryでアニメーション強調（ease-in-out）
- カードの角丸をrounded-mdに変更し、エッジの丸みを狭めた
- 日付表示を「yyyy/MM/dd HH:mm」形式に統一
- カード間のグリッドgap拡大で見やすく

## Recent Decisions

1. コンテンツ管理方式
   - MDXファイルベースを採用（実装完了）
   - メタデータ検索用にSQLiteを使用（実装完了）
   - フロントマターでメタデータを管理（publishedAtに統一、全記事修正済み）
   - コンテンツ同期スクリプトの堅牢化（videoId, videoUrlの補完対応）

2. 技術スタックの実装状況
   - ✅ Next.js App Router
   - ✅ shadcn/ui
   - ✅ Tailwind CSS
   - ✅ next-themes
   - ✅ Prisma (SQLite)
   - ✅ MDX

3. コンポーネント設計
   - Client/Server Componentの使い分け
   - BlogCard, TableOfContentsなどの対話的なコンポーネントはClient Components
   - ページレベルのコンポーネントはServer Components

4. タグ機能の実装
   - ✅ タグユーティリティ関数（getAllTags, getPostsByTag, findTagBySlug, tagToSlug）
   - ✅ タグ表示コンポーネント（TagList, TagCloud）
   - ✅ タグ一覧ページ（/tags）とタグ詳細ページ（/tags/[slug]）
   - ✅ 日本語タグのURLエンコード対応
   - ✅ ユニットテスト実装

5. グローバルレイアウトの実装
   - ✅ ヘッダーの実装（サイト名「つべのまとめ」を設定）
   - ✅ ナビゲーションの実装（「新着」と「タグ一覧」リンクを追加）
   - ✅ フッターの実装（コンテンツリンク、リソースリンク、お問い合わせ、コピーライト、その他リンク）
   - ✅ モバイル対応ナビゲーションの実装（ハンバーガーメニューとスライドインナビゲーション）

6. 検索・ページネーション・同期スクリプトの実装
   - ✅ 記事タイトル・タグ・抜粋・本文による全文検索ロジック（Prisma/SQLite）
   - ✅ 検索UIコンポーネント（SearchInput, SearchPage）
   - ✅ ページネーション対応（ルート・検索画面ともに上下ページャー）
   - ✅ BlogListのページャーprops拡張（showPagerTop/showPagerBottom）
   - ✅ テスト用MDXデータ20件自動生成
   - ✅ Prismaクライアントのモック化
   - ✅ 検索・ページネーションのテストカバレッジ確保
   - ✅ 同期スクリプトの堅牢化（frontmatter.publishedAt統一、videoId/videoUrl補完）
   - ✅ ナビゲーションのLink構造刷新（legacyBehavior廃止、asChild構文統一）
   - ✅ BlogCardのタグリンク入れ子エラー解消（button化）
   - ✅ 新着ページ（/blog）を実装。最新記事を降順・ページネーション付きで表示。
   - ✅ Google Fonts「M PLUS 1p」フォントを全体に適用（Next.js font API）。UI改善の一環。
   - ✅ 検索履歴機能（localStorage）をSearchInputに実装。履歴ドロップダウン、個別削除・全削除、履歴選択で入力欄にセット可能。
   - ✅ 検索UI/UXの改善（履歴、ローディング表示、アクセシビリティ強化）
   - ✅ 検索対象に本文(content)も追加し、テストも修正・パス済み。
   - ✅ 検索・ページネーション・UIの異常系・エッジケースのテスト拡充（DBエラー、極端なページ番号、UIエラー表示、タグボタンのテスト修正）

## Next Steps

1. 検索・ページネーションのテスト拡充（完了）
2. 記事一覧・カードUIの改善（画像比率統一、スケルトン表示、タグや日付の視認性向上）
3. モバイル最適化（余白やフォントサイズ調整、ナビゲーション改善）
4. アクセシビリティ強化（コントラスト最適化、キーボード操作・aria属性追加）
5. フィードバック・エラー表示（検索結果0件時や通信エラー時の案内文・おすすめ記事表示）
6. ページネーションUI改善（現在ページの強調、ページ数ジャンプなど）
7. 記事詳細ページの目次・関連記事デザイン強化
8. 記事ごとのSNSシェア機能の検討・実装（新規要望）
