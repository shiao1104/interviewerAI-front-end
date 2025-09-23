"use client";
import { useState } from "react";

type Props = { open: boolean; onClose: () => void; onAccept: () => void; };

export default function ConsentModal({ open, onClose, onAccept }: Props) {
  const [checked, setChecked] = useState(false);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-xl font-semibold">資料收集與使用說明</h2>
        <p className="mt-3 text-sm text-slate-600">
          本次面試準備將收集您的影音資料（影像、聲音、表情與眼部資訊），僅用於面試表現分析與回饋，並依隱私政策加密保存。
        </p>
        <ul className="mt-3 list-disc pl-5 text-sm text-slate-700 space-y-1">
          <li>提供面試表現的分析與回饋，改善您的面試技巧</li>
          <li>不會在未經同意情況下分享給第三方</li>
        </ul>
        <label className="mt-5 flex items-start gap-2 text-sm text-slate-700">
          <input type="checkbox" className="mt-1" checked={checked} onChange={(e)=>setChecked(e.target.checked)} />
          <span>我已閱讀並同意上述資料收集與使用說明</span>
        </label>
        <div className="mt-6 flex justify-end gap-3">
          <button className="btn" onClick={onClose}>取消</button>
          <button className="btn btn-primary disabled:opacity-50" disabled={!checked} onClick={onAccept}>前往權限檢查</button>
        </div>
      </div>
    </div>
  );
}
