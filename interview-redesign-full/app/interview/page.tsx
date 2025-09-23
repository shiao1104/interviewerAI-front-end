"use client";
import { useState } from "react";
import { DEPARTMENTS, type Department } from "@/lib/constants";
import ConsentModal from "@/components/ConsentModal";
import DeviceCheck from "@/components/DeviceCheck";
import { useRouter } from "next/navigation";

export default function InterviewEntry() {
  const [dept, setDept] = useState<Department | "">("");
  const [name, setName] = useState("");
  const [openConsent, setOpenConsent] = useState(false);
  const [openDeviceCheck, setOpenDeviceCheck] = useState(false);
  const router = useRouter();

  return (
    <div className="mx-auto max-w-xl card">
      <h1 className="text-2xl font-semibold">開始模擬面試</h1>
      <p className="mt-2 text-sm text-slate-600">請選擇科系並填入姓名，接著閱讀資料收集說明與檢查攝影機/麥克風權限。</p>
      <label className="label mt-4">姓名</label>
      <input className="input" placeholder="請輸入學生姓名" value={name} onChange={(e)=>setName(e.target.value)} />
      <label className="label mt-4">科系（限定 7 系）</label>
      <select className="input" value={dept} onChange={(e)=>setDept(e.target.value as Department)}>
        <option value="">請選擇</option>
        {DEPARTMENTS.map((d)=>(<option key={d} value={d}>{d}</option>))}
      </select>
      <div className="mt-6 flex gap-3">
        <button className="btn btn-primary" onClick={() => {
          if (!name.trim() || !dept) { alert("請填寫姓名並選擇科系"); return; }
          setOpenConsent(true);
        }}>下一步</button>
        <a className="btn" href="/">回首頁</a>
      </div>
      <ConsentModal open={openConsent} onClose={() => setOpenConsent(false)} onAccept={() => { setOpenConsent(false); setOpenDeviceCheck(true); }} />
      <DeviceCheck open={openDeviceCheck} onCancel={() => setOpenDeviceCheck(false)} onReady={() => {
        const q = new URLSearchParams({ name: name.trim(), dept: String(dept) });
        router.push(`/interview/session?${q.toString()}`);
      }} />
    </div>
  );
}
