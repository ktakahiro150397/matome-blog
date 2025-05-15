import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import type { Metadata } from "next";
import { M_PLUS_1p } from "next/font/google";
import "./globals.css";

const mplus1p = M_PLUS_1p({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "YouTube Summary Blog",
    template: "%s | YouTube Summary Blog",
  },
  description: "YouTube動画のサマリーブログプラットフォーム",
  keywords: ["YouTube", "サマリー", "要約", "ブログ"],
  authors: [
    {
      name: "YouTube Summary Blog",
    },
  ],
  creator: "YouTube Summary Blog",
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://example.com",
    title: "YouTube Summary Blog",
    description: "YouTube動画のサマリーブログプラットフォーム",
    siteName: "YouTube Summary Blog",
  },
  twitter: {
    card: "summary_large_image",
    title: "YouTube Summary Blog",
    description: "YouTube動画のサマリーブログプラットフォーム",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
  manifest: "/site.webmanifest",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://example.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={mplus1p.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
