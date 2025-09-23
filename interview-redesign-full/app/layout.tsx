import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "InterviewerAI – 模擬面試",
  description: "科系選擇 → 同意與權限檢查 → 面試畫面",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hant">
      <body>
        <header className="border-b bg-white">
          <div className="container py-4 flex items-center justify-between">
            <a href="/" className="font-semibold">Interviewer AI</a>
            <nav className="flex gap-4 text-sm">
              <a href="/interview" className="hover:underline">開始模擬面試</a>
            </nav>
          </div>
        </header>
        <main className="container py-8">{children}</main>
        <footer className="border-t bg-white">
          <div className="container py-6 text-sm text-slate-500">© {new Date().getFullYear()} Interviewer AI</div>
        </footer>
      </body>
    </html>
  );
}
