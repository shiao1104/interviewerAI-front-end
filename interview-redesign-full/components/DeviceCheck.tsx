"use client";
import { useEffect, useRef, useState } from "react";

type Props = { open: boolean; onCancel: () => void; onReady: (stream: MediaStream) => void; };

export default function DeviceCheck({ open, onCancel, onReady }: Props) {
  const [camAllowed, setCamAllowed] = useState<boolean | null>(null);
  const [micAllowed, setMicAllowed] = useState<boolean | null>(null);
  const [error, setError] = useState<string>("");
  const previewRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!open) return;
    let stream: MediaStream | null = null;
    (async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setCamAllowed(true); setMicAllowed(true);
        if (previewRef.current) {
          previewRef.current.srcObject = stream;
          await previewRef.current.play();
        }
      } catch (e: any) {
        setError(e?.message || String(e));
        // 個別檢查
        try { await navigator.mediaDevices.getUserMedia({ video: true }); setCamAllowed(true); } catch { setCamAllowed(false); }
        try { await navigator.mediaDevices.getUserMedia({ audio: true }); setMicAllowed(true); } catch { setMicAllowed(false); }
      }
    })();
    return () => { stream?.getTracks().forEach(t=>t.stop()); };
  }, [open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-xl">
        <h3 className="text-xl font-semibold">檢查權限</h3>
        <p className="mt-2 text-sm text-slate-600">請確認瀏覽器已允許攝影機與麥克風。</p>
        <div className="mt-3 text-sm">
          <span className={`badge ${camAllowed? "bg-green-100 text-green-700":"bg-red-100 text-red-700"}`}>攝影機：{camAllowed===null?"檢查中":camAllowed?"允許":"未允許"}</span>
          <span className={`badge ml-2 ${micAllowed? "bg-green-100 text-green-700":"bg-red-100 text-red-700"}`}>麥克風：{micAllowed===null?"檢查中":micAllowed?"允許":"未允許"}</span>
        </div>
        {error && <div className="mt-2 text-red-600 text-sm">{error}</div>}
        <video ref={previewRef} className="mt-3 w-full rounded-xl bg-black/5" muted playsInline></video>
        <div className="mt-6 flex justify-end gap-3">
          <button className="btn" onClick={onCancel}>返回</button>
          <button className="btn btn-primary disabled:opacity-50" disabled={!camAllowed || !micAllowed} onClick={() => onReady((previewRef.current?.srcObject as MediaStream) || new MediaStream())}>開始面試</button>
        </div>
      </div>
    </div>
  );
}
