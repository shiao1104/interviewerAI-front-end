import React, { useState } from "react";
import { transcribeAudio } from "@/lib/api/STTAPI";

type STTApiShape =
  | { result: boolean; message?: string; data?: { transcript?: string; summary?: string } }
  | { transcript?: string; summary?: string };

export default function TestSTT() {
  const [audio, setAudio] = useState<File | null>(null);
  const [result, setResult] = useState("");
  const [summary, setSummary] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    console.log("👉 點擊上傳轉換按鈕");
    setError("");
    setResult("");
    setSummary("");

    if (!audio) {
      setError("請先選擇音檔！");
      return;
    }

    setLoading(true);
    try {
      const res: STTApiShape = await transcribeAudio(audio);
      console.log("🔥 API 回傳內容：", res);

      // 兼容兩種回傳格式：{result,message,data:{...}} 或 {transcript,summary}
      const payload =
        "data" in (res as any) && (res as any).data
          ? (res as any).data
          : (res as any);

      const t = payload?.transcript ?? "";
      const s = payload?.summary ?? "";

      if (!t && !s) {
        // 後端沒帶到資料或攔截器丟掉了
        setError("後端未回傳 transcript/summary，請檢查回傳格式或攔截器。");
      }

      setResult(t);
      setSummary(s);
    } catch (err: any) {
      console.error("❌ 發生錯誤：", err);
      // 你的 axios 攔截器若丟 {result:false,message}，這裡讀 message
      setError(err?.message || err?.detail || "上傳失敗，請查看 console");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>語音轉文字測試</h2>
      <input
        type="file"
        accept="audio/*"
        onChange={(e) => setAudio(e.target.files?.[0] || null)}
      />
      <button onClick={handleUpload} style={{ marginTop: 10 }} disabled={loading}>
        {loading ? "處理中..." : "上傳轉換"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <h3>逐字稿：</h3>
      <pre style={{ whiteSpace: "pre-wrap" }}>{result}</pre>

      <h3>重點摘要：</h3>
      <pre style={{ whiteSpace: "pre-wrap" }}>{summary}</pre>
    </div>
  );
}
