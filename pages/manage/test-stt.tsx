import React, { useState } from "react";
import { transcribeAudio } from "@/lib/api/STTAPI";

export default function TestSTT() {
  const [audio, setAudio] = useState<File | null>(null);
  const [result, setResult] = useState("");
  const [summary, setSummary] = useState("");
  const [error, setError] = useState("");

  const handleUpload = async () => {
    console.log("👉 點擊上傳轉換按鈕");
    setError("");
    setResult("");
    setSummary("");

    if (!audio) {
      setError("請先選擇音檔！");
      return;
    }

    try {
      const res = await transcribeAudio(audio);
      console.log("🔥 API 回傳內容：", res);
      setResult(res.transcript);
      setSummary(res.summary);
    } catch (err) {
      console.error("❌ 發生錯誤：", err);
      setError("上傳失敗，請查看 console");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>語音轉文字測試</h2>
      <input
        type="file"
        accept="audio/*"
        onChange={e => setAudio(e.target.files?.[0] || null)}
      />
      <button onClick={handleUpload} style={{ marginTop: "10px" }}>
        上傳轉換
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <h3>逐字稿：</h3>
      <pre>{result}</pre>

      <h3>重點摘要：</h3>
      <pre>{summary}</pre>

    </div>
  );
}
