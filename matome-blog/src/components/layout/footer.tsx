import Link from "next/link"
import { Separator } from "@/components/ui/separator"

export function Footer() {
  return (
    <footer className="border-t bg-background mt-12">
      <div className="container flex flex-col gap-6 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-semibold">コンテンツ</h3>
            <nav className="flex flex-col gap-2.5 text-sm text-muted-foreground">
              <Link href="/tags" className="hover:text-foreground">タグ一覧</Link>
              <Link href="/about" className="hover:text-foreground">About</Link>
            </nav>
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-semibold">リソース</h3>
            <nav className="flex flex-col gap-2.5 text-sm text-muted-foreground">
              <Link href="/sitemap.xml" className="hover:text-foreground">サイトマップ</Link>
              <Link href="/rss.xml" className="hover:text-foreground">RSS</Link>
            </nav>
          </div>
        </div>
        <Separator />
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} YouTube Summary Blog. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}