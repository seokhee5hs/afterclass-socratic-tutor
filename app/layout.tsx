import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Afterclass · 감성컴퓨팅 소크라테스 튜터",
  description: "감성컴퓨팅 5주차: 질문을 통해 자신의 생각을 설명하고 수정하는 학습 공간.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">{children}</body>
    </html>
  );
}
