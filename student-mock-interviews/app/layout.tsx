import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "InterviewerAI – 學生模擬面試系統",
  description: "科系選擇 → 資料收集同意 → 裝置權限檢查 → 面試畫面",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hant">
      <body>
        {children}
      </body>
    </html>
  );
}
