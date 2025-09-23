"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { SAMPLE_QUESTIONS, type Department, type Question } from "@/lib/constants";

export default function InterviewSession() {
  const params = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
  const name = params.get("name") || "匿名";
  const dept = (params.get("dept") || "") as Department;

  const qList: Question[] = useMemo(() => {
    return dept && SAMPLE_QUESTIONS[dept] ? SAMPLE_QUESTIONS[dept] : [];
  }, [dept]);

  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"prep" | "answer">("prep");
  const [remain, setRemain] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    (async () => {
      stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream; await videoRef.current.play();
      }
    })();
    return () => { stream?.getTracks().forEach(t=>t.stop()); };
  }, []);

  useEffect(() => {
    const q = qList[index];
    if (!q) return;
    const secs = phase === "prep" ? (q.prepSec || 30) : (q.answerSec || 90);
    setRemain(secs);
    const iv = setInterval(() => setRemain((s) => s - 1), 1000);
    return () => clearInterval(iv);
  }, [index, phase, qList]);

  useEffect(() => {
    if (remain > 0) return;
    const q = qList[index];
    if (!q) return;
    if (phase === "prep") {
      setPhase("answer");
    } else {
      setPhase("prep");
      setIndex((i) => i + 1);
    }
  }, [remain, index, phase, qList]);

  const q = qList[index];
  if (!dept || !q) {
    return (
      <div className="card max-w-2xl mx-auto">
        <h1 className="text-xl font-semibold">面試結束或參數缺失</h1>
        <p className="mt-2 text-slate-600">{!dept ? "缺少科系參數" : "已完成所有題目。"}</p>
        <a className="btn mt-4" href="/interview">返回選擇頁</a>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <section className="card order-2 md:order-1">
        <div className="text-sm text-slate-500">面試公司：科技未來有限公司（示意）</div>
        <h1 className="mt-1 text-3xl font-semibold">面試職位：{dept} 面試</h1>
        <div className="mt-6">
          <div className="text-lg font-semibold">問題 #{index + 1}</div>
          <p className="mt-2 text-slate-800">{q.text}</p>
          <div className="mt-4 flex items-center gap-3 text-sm">
            <span className="badge">{phase === "prep" ? "準備中" : "作答中"}</span>
            <span className="badge">剩餘 {remain} 秒</span>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            {phase === "prep" && (<button className="btn btn-primary" onClick={() => setPhase("answer")}>跳過準備時間</button>)}
            <button className="btn" onClick={() => { setPhase("prep"); setIndex(qList.length); }}>結束面試</button>
          </div>
        </div>
      </section>
      <section className="card order-1 md:order-2">
        <video ref={videoRef} className="aspect-video w-full rounded-xl bg-black" autoPlay playsInline muted></video>
      </section>
    </div>
  );
}
