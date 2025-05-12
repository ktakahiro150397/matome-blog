# Active Context

## 2025-05-11 更新

### 実施内容

- `content/posts/markdown-sample.mdx` をDBに投入し、記事として追加。
- `scripts/sync-content.ts` を利用し、全MDX記事をDB同期。
- 必要な依存（tsx）を `npm install tsx` で追加。
- テスト（`npm test`）を実行し、全テストパスを確認。
- 変更ファイル（同期スクリプト・mdx記事）のエラーなしを確認。

### 現状

- markdown-sample.mdxを含む全記事がDBに投入済み。
- テスト・型・ESLintエラーなし。
- Memory Bankも最新化。

### 次のアクション

- UI上でmarkdown-sample.mdxが正しく表示されるか確認。
- 必要に応じてUI/UXや記事表示の改善を検討。

---

## 2025-05-12 Aboutページ追加

### 実施内容

- `/src/app/about/page.tsx` を新規作成し、プロジェクトの目的・特徴・技術スタック・目指すものを記載したAboutページを実装。
- 既存のナビゲーション（Header）から `/about` へのリンクが有効であることを確認。
- `npm test` をmatome-blogディレクトリで実行し、全テストパスを確認。
- Aboutページ追加による型・ESLintエラーなしを確認。

### 現状

- Aboutページが `/about` で正しく表示される状態。
- テスト・型・ESLintエラーなし。
- Memory Bankも最新化。

### 次のアクション

- Aboutページの内容やデザインのフィードバックを受けて必要に応じて改善。
- 他の静的ページ（例: 利用規約、プライバシーポリシー等）が必要な場合は同様に追加。

---

## 2025-05-12 サイトマップ自動生成API実装

### 実施内容

- `/src/app/sitemap.xml/route.ts` を新規作成し、静的ページ・記事・タグを含むサイトマップ（XML）を自動生成するAPIを実装。
- フッターの「サイトマップ」リンク（/sitemap.xml）からアクセス可能。
- `npm test` を実行し、全テストパスを確認。
- 追加・変更ファイルの型・ESLintエラーなしを確認。

### 現状

- サイトマップ（/sitemap.xml）が自動生成され、フッターからもアクセス可能。
- テスト・型・ESLintエラーなし。
- Memory Bankも最新化。

### 次のアクション

- サイトマップの内容や仕様のフィードバックを受けて必要に応じて改善。
- robots.txtやRSSの自動生成も必要に応じて実装。

---

## 2025-05-12 フッターお問い合わせ削除・RSSフィード実装

### 実施内容

- フッター（/src/components/layout/footer.tsx）から「お問い合わせフォーム」セクションを削除。
- `/src/app/rss.xml/route.ts` を新規作成し、最新記事のRSSフィード（RSS2.0形式）を自動生成するAPIを実装。
  - descriptionはPost.excerptを利用。
- `npm test` を実行し、全テストパスを確認。
- 追加・変更ファイルの型・ESLintエラーなしを確認。

### 現状

- フッターからお問い合わせフォームが削除済み。
- RSSフィード（/rss.xml）が自動生成され、フッターからもアクセス可能。
- テスト・型・ESLintエラーなし。
- Memory Bankも最新化。

### 次のアクション

- RSSフィードの内容や仕様のフィードバックを受けて必要に応じて改善。
- 他の静的ページやAPIの拡充も必要に応じて実施。

---

## Current Focus

- 記事ごとのSNSシェアボタン（X対応、今後拡張可能設計）の実装・UI/UX改善
- BlogCard/BlogList/記事詳細ページのUI/UX最適化
- TableOfContentsのkey重複エラー修正
- すべてのテストがパスすることを確認済み
- 記事詳細ページのMarkdown本文表示を強化。h1〜h5やコードブロック、リスト、引用などの見た目をカスタムコンポーネントで最適化。
- @mdx-js/reactのMDXProviderを導入し、/blog/[slug]/page.tsxで本文をラップ。
- src/components/blog/MarkdownComponents.tsxを新規作成し、各要素のスタイルを細かく調整。
- Server Componentでdynamic/ssr: falseを使わず、MarkdownBodyは通常importで利用する形に修正。
- Prismaの関連投稿取得クエリのwhere句・include句を正しい形に修正。

### BlogCard・記事リストのUI/UX細部改善

- タグリンクのUI/UX向上（hover/focus時の色強調、タップ領域拡大、丸み・アクセシビリティ向上）
- サムネイル画像の角丸・影・レイアウト最適化
- タイトルの太字・サイズ調整・hover時色変化
- カードの余白・影・ボーダー強調、hover時はボーダー色のみprimaryでアニメーション強調（ease-in-out）
- カードの角丸をrounded-mdに変更し、エッジの丸みを狭めた
- 日付表示を「yyyy/MM/dd HH:mm」形式に統一
- カード間のグリッドgap拡大で見やすく

### シェアボタン・UI/UX改善

- ShareButtonコンポーネント新規作成（X用、今後拡張可能なprops設計）
- BlogCard・記事詳細ページにXシェアボタンを追加
- ボタンのカラー・hover時のエフェクト・アクセシビリティ対応
- aタグの入れ子エラーをbutton化で根本解消
- TableOfContentsのリストkeyを`${id}-${idx}`形式でユニーク化し、重複keyエラーを解消

### Next.js App Routerのパラメータ取得の警告対応

- searchParams/paramsのプロパティ利用前にawaitを徹底し、全ページで警告が出ないよう修正
- `/`, `/blog`, `/search`, `/blog/[slug]`, `/tags/[slug]` など全ての該当ページで対応済み

## Recent Decisions

- テストはAppRouterContext.Providerでラップし、useRouterのエラーを回避
- searchPostsのモックはvi.fn()で直接作成し、vi.mockの初期化順序もESM対応
- BlogCardの日付テストは実際の出力に合わせて修正
- すべての修正内容はメモリバンク・進捗ファイルに反映
- ShareButtonはClient Componentとして"use client"を明示
- variant propsは将来拡張用で現状未使用
- すべてのテストがパスし、ESLint等のエラーもなし
- Prismaの関連投稿取得クエリのwhere句・include句を正しい形に修正。

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
   - BlogCard, TableOfContents, ShareButtonなどの対話的なコンポーネントはClient Components
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
   - ✅ フッターの実装（コンテンツリンク、リソースリンク、コピーライト、その他リンク）
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
9. 実際の表示確認（UIの微調整が必要なら追加対応）
10. 他ページやリスト表示でのMarkdown利用有無を確認し、必要なら同様の強化を展開
11. ユーザーからのフィードバックを受けてさらなるUI/UX改善
12. UI表示確認・フィードバック対応
13. 他ページへの展開が必要なら同様のパターンで実装
