/* ======= 設定 / 常數 ======= */
const CONFIG = { DEFAULT_PREP_SEC: 60, DEFAULT_ANSWER_SEC: 120, AUTO_START_RECORDING: true };
const STORE_KEY = 'mockInterviewRecords';            // 首頁摘要(localStorage)
const IDB_NAME  = 'mockInterviewDB', IDB_STORE='records'; // 詳情+影片(IndexedDB)

/* ======= 題庫 ======= */
const QUESTION_BANK = [
  d=>({ title:'自我介紹', stem:`請介紹你自己，以及報考「${d}」的動機與優勢。`, prepSec:60, answerSec:120 }),
  ()=>({ title:'團隊合作', stem:'描述一次你與團隊解決問題的經驗（採 STAR 架構）。', prepSec:45, answerSec:120 }),
  ()=>({ title:'壓力調適', stem:'面對壓力時你如何調適並維持表現？', prepSec:45, answerSec:90  }),
  ()=>({ title:'專案分享', stem:'分享最近的一個專案，你的角色與貢獻。', prepSec:60, answerSec:120 }),
  ()=>({ title:'學習計畫', stem:'入學後的課程/實習/證照計畫。',       prepSec:45, answerSec:120 })
];

/* ======= 小工具 ======= */
const $=(s,r=document)=>r.querySelector(s);
const on=(el,ev,fn)=>el&&el.addEventListener(ev,fn);
const pad=n=>String(n).padStart(2,'0');
const fmt=s=>`${pad(Math.floor(s/60))}:${pad(s%60)}`;
const genId=()=>`R${Date.now().toString(36)}${Math.floor(Math.random()*1e4)}`;
function createRecorder(stream){
  const types=['video/webm;codecs=vp9,opus','video/webm;codecs=vp8,opus','video/webm'];
  for(const t of types){ if(MediaRecorder.isTypeSupported(t)) return new MediaRecorder(stream,{mimeType:t}); }
  return new MediaRecorder(stream);
}

/* ======= 儲存層 ======= */
// 首頁摘要(localStorage)
const Store={
  load(){ return JSON.parse(localStorage.getItem(STORE_KEY)||'[]'); },
  save(rows){ localStorage.setItem(STORE_KEY, JSON.stringify(rows)); },
  add(rec){ const rows=this.load(); rows.unshift(rec); this.save(rows); }
};
// IndexedDB（影片+詳情）
const DB={
  open(){ return new Promise((res,rej)=>{ const req=indexedDB.open(IDB_NAME,1);
    req.onupgradeneeded=()=>{ const db=req.result; if(!db.objectStoreNames.contains(IDB_STORE)) db.createObjectStore(IDB_STORE,{keyPath:'id'}); };
    req.onsuccess=()=>res(req.result); req.onerror=()=>rej(req.error); }); },
  async put(record){ const db=await this.open(); return new Promise((res,rej)=>{ const tx=db.transaction(IDB_STORE,'readwrite'); tx.objectStore(IDB_STORE).put(record); tx.oncomplete=()=>{db.close();res();}; tx.onerror=()=>{db.close();rej(tx.error);} }); },
  async get(id){  const db=await this.open(); return new Promise((res,rej)=>{ const tx=db.transaction(IDB_STORE,'readonly'); const rq=tx.objectStore(IDB_STORE).get(id); rq.onsuccess=()=>{const v=rq.result||null; db.close(); res(v);}; rq.onerror=()=>{db.close(); rej(rq.error);} }); }
};

/* ======= 首頁 ======= */
const Home={
  init(){
    const form=$('#deptForm');
    on($('#btnStart'),'click',e=>{
      e.preventDefault();
      const dept=new FormData(form).get('dept');
      if(!dept) return alert('請先選擇一個科系');
      location.href=`mock-interview.html?dept=${encodeURIComponent(dept)}&company=${encodeURIComponent('科技未來有限公司')}&role=${encodeURIComponent('資深前端工程師')}`;
    });

    const tbody=$('#tbody'), filter=$('#filterDept'), search=$('#search'), empty=$('#empty');
    if(!tbody) return;

    on($('#btnFake'),'click',async ()=>{
      const depts=['會計資訊系','財務金融系','資訊管理系','財政稅務系','應用外語系','國際商務系','企業管理系'];
      const id=genId(), dept=depts[Math.floor(Math.random()*depts.length)];
      const date=new Date().toLocaleString(); const score=80+Math.floor(Math.random()*15);
      Store.add({id,date,dept,status:'完成',score});
      await DB.put({id,dept,date,score,segments:[],version:1});
      render();
    });
    on($('#btnClear'),'click',()=>{ if(confirm('確定清除全部紀錄？')){ Store.save([]); render(); }});
    on(filter,'change',render); on(search,'input',render);
    render();

    function render(){
      const rows=Store.load();
      const q=(search.value||'').toLowerCase(), f=filter.value||'';
      const list=rows.filter(r=>(!f||r.dept===f)&&(!q||(r.dept+r.status+r.id).toLowerCase().includes(q)));
      tbody.innerHTML=''; empty.style.display=list.length?'none':'block';
      for(const r of list){
        const tr=document.createElement('tr'); tr.className='row';
        tr.innerHTML=`
          <td>${r.date}</td>
          <td><span class="chip">${r.dept}</span></td>
          <td><span class="status ${r.status==='完成'?'done':'pending'}">${r.status}</span></td>
          <td class="score">${r.score??'-'}</td>
          <td>
            <a class="btn btn-outline" href="interview-report.html?id=${encodeURIComponent(r.id)}">查看報告</a>
            <a class="btn btn-outline" href="mock-interview.html?dept=${encodeURIComponent(r.dept)}">再次練習</a>
          </td>`;
        tbody.appendChild(tr);
      }
    }
  }
};

/* ======= 面試頁（自動錄影） ======= */
const Mock={
  idx:0, phase:'prep', left:0, t:null,
  stream:null, rec:null, chunks:[], answerStartTs:0,
  bank:[], total:0, dept:'', segments:[], recordId:genId(),

  async init(){
    const url=new URL(location.href);
    this.dept=url.searchParams.get('dept')||'未選擇';
    const company=url.searchParams.get('company')||'—';
    const role=url.searchParams.get('role')||'—';
    $('#companyName').textContent=company; $('#roleName').textContent=role;

    this.bank=QUESTION_BANK.map(fn=>fn(this.dept)); this.total=this.bank.length;
    $('#headerQPos').textContent=`1/${this.total}`;

    // 同意 + 權限
    const modal=$('#consentPermModal'), consentCheck=$('#consentCheck');
    const btnBegin=$('#btnBegin'), btnCheckPerm=$('#btnCheckPerm'), btnBackHome=$('#btnBackHome');
    $('#mCompany').textContent=company; $('#mRole').textContent=role;
    let camOK=false, micOK=false;
    const updateReady=()=>{ btnBegin.disabled=!(consentCheck.checked && camOK && micOK); };

    const checkPerm=async ()=>{
      try{
        if(!this.stream) this.stream=await navigator.mediaDevices.getUserMedia({video:true,audio:true});
        camOK=this.stream.getVideoTracks().some(t=>t.readyState==='live');
        micOK=this.stream.getAudioTracks().some(t=>t.readyState==='live');
        $('#camRow').className='statusItem '+(camOK?'ok':'bad'); $('#camStatus').textContent=camOK?'已允許':'未允許';
        $('#micRow').className='statusItem '+(micOK?'ok':'bad'); $('#micStatus').textContent=micOK?'已允許':'未允許';
        const v=$('#preview'), ph=$('#placeholder'); v.srcObject=this.stream; v.style.display='block'; ph.style.display='none'; try{ await v.play(); }catch(_){}
      }catch{ camOK=micOK=false; $('#camRow').className='statusItem bad'; $('#camStatus').textContent='未允許'; $('#micRow').className='statusItem bad'; $('#micStatus').textContent='未允許'; }
      updateReady();
    };

    on(consentCheck,'change',updateReady);
    on(btnCheckPerm,'click',checkPerm);
    on(btnBackHome,'click',()=>location.href='interview-home.html');
    on(btnBegin,'click',()=>{ modal.remove(); this.startFlow(); });
    checkPerm();

    // 左側操作
    on($('#btnSkip'),'click',()=>{ if(this.phase==='prep') this.toAnswer(true); });
    on($('#btnNext'),'click',()=>{ if(!$('#btnNext').disabled) this.nextQuestion(); });
    on($('#btnExit'),'click',()=>{ if(confirm('確定要結束並返回首頁？')){ this.cleanup(); location.href='interview-home.html'; }});
    window.addEventListener('beforeunload',()=>this.cleanup());
  },

  startFlow(){ this.loadQ(0); this.setPhase('prep'); this.tickStart(); },

  loadQ(i){
    this.idx=i; const q=this.bank[i];
    $('#chipType').textContent=q.title;
    $('#qTitle').textContent=`問題 ${i+1}：${q.title}`;
    $('#qStem').textContent=q.stem;
    $('#chipAnsLimit').textContent=fmt(q.answerSec||CONFIG.DEFAULT_ANSWER_SEC);
    $('#chipPrepInit').textContent=fmt(q.prepSec||CONFIG.DEFAULT_PREP_SEC);
    $('#headerQPos').textContent=`${i+1}/${this.total}`;
    $('#headerProgBar').style.width=`${Math.floor(i/this.total*100)}%`;
    $('#headerProgPct').textContent=`${Math.floor(i/this.total*100)}%`;
    $('#btnNext').disabled=true;
    $('#prepFill').style.width='0%'; $('#prepLeft').textContent=fmt(q.prepSec||CONFIG.DEFAULT_PREP_SEC);
  },

  setPhase(p){
    this.phase=p;
    this.left=(p==='prep')?(this.bank[this.idx].prepSec||CONFIG.DEFAULT_PREP_SEC)
                           :(this.bank[this.idx].answerSec||CONFIG.DEFAULT_ANSWER_SEC);
    $('#cornerBadge').textContent=(p==='prep')?`⏳ 準備時間剩餘 ${fmt(this.left)}`:`🔴 錄製中 ${fmt(this.left)}`;
  },

  tickStart(){
    if(this.t) return;
    this.t=setInterval(async ()=>{
      if(this.left>0){
        this.left--;
        if(this.phase==='prep'){
          const total=this.bank[this.idx].prepSec||CONFIG.DEFAULT_PREP_SEC;
          const done=total-this.left;
          $('#prepLeft').textContent=fmt(this.left);
          $('#prepFill').style.width=`${Math.min(100,Math.floor(done/total*100))}%`;
          $('#cornerBadge').textContent=`⏳ 準備時間剩餘 ${fmt(this.left)}`;
        }else{
          $('#cornerBadge').textContent=`🔴 錄製中 ${fmt(this.left)}`;
        }
        return;
      }
      clearInterval(this.t); this.t=null;
      if(this.phase==='prep'){ this.toAnswer(true); }  // 準備結束→自動錄
      else{ this.stopRecording(); }                    // 作答結束→自動停
    },1000);
  },

  async toAnswer(autoStart){
    this.setPhase('answer');
    if(CONFIG.AUTO_START_RECORDING && autoStart) await this.startRecording();
    this.tickStart();
  },

  async startRecording(){
    if(this.rec && this.rec.state==='recording') return;
    if(!this.stream){
      try{ this.stream=await navigator.mediaDevices.getUserMedia({video:true,audio:true}); }
      catch{ alert('未取得相機/麥克風權限'); return; }
      const v=$('#preview'), ph=$('#placeholder'); v.srcObject=this.stream; v.style.display='block'; ph.style.display='none'; try{ await v.play(); }catch(_){}
    }
    this.chunks=[]; this.rec=createRecorder(this.stream); this.answerStartTs=performance.now();
    this.rec.ondataavailable=e=>{ if(e.data&&e.data.size>0) this.chunks.push(e.data); };
    this.rec.onstop=()=>{
      const type=this.rec.mimeType||'video/webm';
      const blob=new Blob(this.chunks,{type});
      const duration=Math.max(1,Math.round((performance.now()-this.answerStartTs)/1000));
      const q=this.bank[this.idx];
      this.segments.push({ idx:this.idx, title:q.title, answerSec:q.answerSec||CONFIG.DEFAULT_ANSWER_SEC, duration, blob, type });
      $('#btnNext').disabled=false;

      if(this.idx===this.total-1){ this.saveRecordAndGoReport(); }
    };
    this.rec.start();
  },

  stopRecording(){ if(this.rec && this.rec.state==='recording'){ this.rec.stop(); } },

  nextQuestion(){
    if(this.idx < this.total-1){
      clearInterval(this.t); this.t=null; this.stopRecording();
      this.loadQ(this.idx+1); this.setPhase('prep'); this.tickStart();
    }
  },

  /* demo 評分：之後可改成呼叫後端回傳 */
  buildScores(){
    const seedStr=this.recordId; let seed=0; for(const c of seedStr) seed=(seed*31 + c.charCodeAt(0))>>>0;
    const rnd=()=>{ seed=(seed*1664525+1013904223)>>>0; return (seed>>>0)/4294967296; };

    const perQ=this.segments.map(seg=>{
      const completion=Math.min(100,Math.round((seg.duration/seg.answerSec)*100));
      const structure=Math.round(60+completion*0.3 + rnd()*10);
      const relevance=Math.round(60+completion*0.3 + rnd()*10);
      const fluency  =Math.round(60+completion*0.3 + rnd()*10);
      const score=Math.round((structure+relevance+fluency)/3);
      const comment= completion<60 ? '時間偏短，建議補充具體案例。' :
                      score>85      ? '表達清楚、內容完整，可再加上量化成果。' :
                                      '有重點但結構可再明確。';
      return { idx:seg.idx, title:seg.title, duration:seg.duration, score, completion, breakdown:{structure,relevance,fluency}, comment };
    });
    const overall=Math.round(perQ.reduce((a,b)=>a+b.score,0)/Math.max(1,perQ.length));
    const bars=[
      {name:'結構清晰',value:Math.round(perQ.reduce((a,b)=>a+b.breakdown.structure,0)/perQ.length)},
      {name:'切題程度',value:Math.round(perQ.reduce((a,b)=>a+b.breakdown.relevance,0)/perQ.length)},
      {name:'口條流暢',value:Math.round(perQ.reduce((a,b)=>a+b.breakdown.fluency,0)/perQ.length)},
      {name:'完成度',  value:Math.round(perQ.reduce((a,b)=>a+b.completion,0)/perQ.length)},
    ];
    return { overall, perQ, bars };
  },

  async saveRecordAndGoReport(){
    const scores=this.buildScores();
    const date=new Date().toLocaleString();

    await DB.put({
      id:this.recordId,
      dept:this.dept,
      date,
      score:scores.overall,
      segments:this.segments.map(s=>({idx:s.idx,title:s.title,duration:s.duration,answerSec:s.answerSec,type:s.type,blob:s.blob})),
      scores,
      version:1
    });

    Store.add({ id:this.recordId, date, dept:this.dept, status:'完成', score:scores.overall });
    location.href = `interview-report.html?id=${encodeURIComponent(this.recordId)}`;
  },

  cleanup(){
    try{ if(this.rec && this.rec.state!=='inactive') this.rec.stop(); }catch{}
    try{ if(this.stream){ this.stream.getTracks().forEach(t=>t.stop()); } }catch{}
  }
};

/* ======= 報告頁（同頁播放影片） ======= */
const Report={
  async init(){
    const id=new URL(location.href).searchParams.get('id');
    if(!id){ alert('缺少報告 id'); location.href='interview-home.html'; return; }
    $('#reportId').textContent = `報表 ID：${id}`;

    const rec = await DB.get(id);
    if(!rec){ alert('找不到此報告，可能已被清除。'); location.href='interview-home.html'; return; }

    // 總覽
    $('#scoreBadge').textContent = rec.score ?? '—';
    $('#deptChip').textContent   = rec.dept;
    $('#dateChip').textContent   = rec.date;
    $('#statusChip').textContent = '完成';
    $('#statusText').textContent = '完成';
    $('#qCount').textContent     = `${rec.segments?.length||0} 題`;
    const totalSec = (rec.segments||[]).reduce((s,x)=>s+(x.duration||0),0);
    $('#talkTime').textContent   = fmt(totalSec);
    $('#btnRemock').href         = `mock-interview.html?dept=${encodeURIComponent(rec.dept)}`;

    // 能力向度
    const bars = rec.scores?.bars || [];
    const barsWrap = $('#bars'); barsWrap.innerHTML = '';
    for(const b of bars){
      const row = document.createElement('div');
      row.innerHTML = `
        <div style="display:flex;align-items:center;gap:10px;margin:8px 0">
          <div style="width:120px">${b.name}</div>
          <div style="flex:1;height:10px;background:#eef2f7;border-radius:999px;overflow:hidden">
            <div style="height:100%;width:${b.value||0}%;background:linear-gradient(90deg,#2F80ED,#00DBDE)"></div>
          </div>
          <div style="width:48px;text-align:right;font-weight:800">${b.value||0}</div>
        </div>`;
      barsWrap.appendChild(row);
    }

    // 每題表 + 右側播放器
    const tbody = $('#tbody'); tbody.innerHTML='';
    const segs = (rec.segments||[]).slice().sort((a,b)=>a.idx-b.idx);
    if(!segs.length){ $('#emptyQ').style.display='block'; return; }

    segs.forEach((seg,i)=>{
      const qScore = rec.scores?.perQ?.[i]?.score ?? '-';
      const comment= rec.scores?.perQ?.[i]?.comment ?? '—';
      const tr = document.createElement('tr');
      tr.className = 'row';
      tr.dataset.i = i;
      tr.innerHTML = `
        <td>${seg.idx+1}. ${seg.title}</td>
        <td>${fmt(seg.duration||0)}</td>
        <td class="score">${qScore}</td>
        <td>${comment}</td>`;
      tbody.appendChild(tr);
    });

    const player=$('#player'), btnDown=$('#btnDownload'), titleEl=$('#playerTitle');

    function playIndex(i){
      const seg=segs[i]; if(!seg) return;
      const url=URL.createObjectURL(seg.blob);
      player.src=url; player.play();
      btnDown.href=url; btnDown.download=`${id}-q${seg.idx+1}.webm`;
      titleEl.textContent=`第 ${seg.idx+1} 題：${seg.title}`;
      // 高亮目前列
      [...tbody.children].forEach(el=>el.classList.remove('active'));
      tbody.children[i]?.classList.add('active');
    }

    // 點任何一列即播放
    tbody.addEventListener('click',e=>{
      const row = e.target.closest('tr[data-i]'); if(!row) return;
      playIndex(parseInt(row.dataset.i,10));
    });

    // 預設播第一題
    playIndex(0);
  }
};


/* ======= 啟動 ======= */
document.addEventListener('DOMContentLoaded', ()=>{
  const page=document.body.dataset.page;
  if(page==='home')  Home.init();
  if(page==='mock')  Mock.init();
  if(page==='report')Report.init();
});
