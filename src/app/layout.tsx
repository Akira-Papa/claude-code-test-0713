import type { Metadata } from "next";
import { Providers } from "@/app/providers";
import Header from "@/components/Header";
import "./globals.css";


export const metadata: Metadata = {
  title: "掲示板アプリ",
  description: "シンプルな掲示板アプリケーション",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head />
      <body>
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
