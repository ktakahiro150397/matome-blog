"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Separator } from "@/components/ui/separator";
import { Menu, Search, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // ナビゲーションリンク定義
  const navLinks = [
    { href: "/blog", label: "新着" },
    { href: "/tags", label: "タグ一覧" },
    { href: "/search", label: "検索", icon: <Search size={16} /> },
    { href: "/about", label: "About" },
  ];

  // カテゴリー（例）
  const categoryLinks = [
    {
      href: "/tags/technology",
      label: "テクノロジー",
      desc: "最新のテクノロジートレンドと解説",
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <Link
          href="/"
          className="flex items-center space-x-2 text-lg font-semibold"
          aria-label="トップページへ"
        >
          <span>つべのまとめ</span>
        </Link>

        {/* デスクトップナビゲーション */}
        <div className="hidden md:flex items-center">
          <Separator orientation="vertical" className="mx-6 h-6" />
          <NavigationMenu>
            <NavigationMenuList>
              {navLinks.map((link) => (
                <NavigationMenuItem key={link.href}>
                  <NavigationMenuLink asChild>
                    <Link
                      href={link.href}
                      className={
                        "flex flex-row items-center gap-1 px-3 py-2 rounded transition-colors " +
                        (pathname === link.href
                          ? "text-primary font-bold underline underline-offset-4"
                          : "hover:text-primary/80 text-muted-foreground")
                      }
                      aria-current={pathname === link.href ? "page" : undefined}
                      aria-label={link.label}
                    >
                      {/* flex-rowで横並びを強制 */}
                      {link.icon && <span className="mr-1 flex items-center">{link.icon}</span>}
                      <span>{link.label}</span>
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
              <NavigationMenuItem>
                <NavigationMenuTrigger>カテゴリー</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-3 p-4 w-[400px]">
                    {categoryLinks.map((cat) => (
                      <NavigationMenuLink asChild key={cat.href}>
                        <Link
                          href={cat.href}
                          className={
                            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors " +
                            (pathname === cat.href
                              ? "bg-accent text-accent-foreground font-bold"
                              : "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground")
                          }
                          aria-current={
                            pathname === cat.href ? "page" : undefined
                          }
                          aria-label={cat.label}
                        >
                          <div className="text-sm font-medium leading-none">
                            {cat.label}
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            {cat.desc}
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* モバイル用ハンバーガーメニュー */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <button
              className="md:hidden p-2 text-foreground"
              aria-label="メニューを開く"
            >
              <Menu size={24} />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[250px] sm:w-[300px] p-0">
            <div className="flex flex-col h-full py-6">
              <div className="px-6 mb-4 flex justify-between items-center">
                <Link
                  href="/"
                  className="text-lg font-bold"
                  onClick={() => setIsOpen(false)}
                  aria-label="トップページへ"
                >
                  つべのまとめ
                </Link>
                <button
                  className="p-2 text-foreground"
                  onClick={() => setIsOpen(false)}
                  aria-label="メニューを閉じる"
                >
                  <X size={24} />
                </button>
              </div>
              <nav className="flex flex-col space-y-3 px-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={
                      "py-2 border-b border-muted flex items-center gap-2 rounded transition-colors " +
                      (pathname === link.href
                        ? "text-primary font-bold underline underline-offset-4"
                        : "hover:text-primary/80 text-muted-foreground")
                    }
                    onClick={() => setIsOpen(false)}
                    aria-current={pathname === link.href ? "page" : undefined}
                    aria-label={link.label}
                  >
                    {link.icon}
                    <span>{link.label}</span>
                  </Link>
                ))}
                {categoryLinks.map((cat) => (
                  <Link
                    key={cat.href}
                    href={cat.href}
                    className={
                      "py-2 border-b border-muted rounded transition-colors " +
                      (pathname === cat.href
                        ? "text-primary font-bold underline underline-offset-4"
                        : "hover:text-primary/80 text-muted-foreground")
                    }
                    onClick={() => setIsOpen(false)}
                    aria-current={pathname === cat.href ? "page" : undefined}
                    aria-label={cat.label}
                  >
                    <span>{cat.label}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
