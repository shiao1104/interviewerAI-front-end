export default function Page() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <section className="card">
        <h1 className="text-2xl font-semibold mb-2">學生模擬面試</h1>
        <p className="text-slate-600 mb-4">選擇科系後，將引導你完成資料收集同意與裝置權限檢查，並進入面試畫面。</p>
        <ul className="text-sm text-slate-700 list-disc pl-6 space-y-1">
          <li>會計資訊系、財務金融系、資訊管理系</li>
          <li>財政稅務系、應用外語系、國際商務系、企業管理系</li>
        </ul>
        <div className="mt-6"><a href="/interview" className="btn btn-primary">開始模擬面試</a></div>
      </section>
      <section className="card">
        <h2 className="text-xl font-semibold mb-2">流程</h2>
        <ol className="list-decimal pl-6 text-sm space-y-1 text-slate-700">
          <li>選擇科系與輸入姓名</li>
          <li>閱讀資料收集與使用說明（同意）</li>
          <li>檢查攝影機與麥克風權限</li>
          <li>進入面試畫面（準備 → 作答）</li>
        </ol>
      </section>
    </div>
  );
}
