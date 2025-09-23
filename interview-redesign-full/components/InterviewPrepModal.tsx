"use client";
import { useEffect, useRef, useState } from "react";

type Props = { 
  open: boolean; 
  onClose: () => void; 
  onStartInterview: () => void; 
};

export default function InterviewPrepModal({ open, onClose, onStartInterview }: Props) {
  const [agreed, setAgreed] = useState(false);
  const [camAllowed, setCamAllowed] = useState<boolean | null>(null);
  const [micAllowed, setMicAllowed] = useState<boolean | null>(null);
  const previewRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!open) return;
    let stream: MediaStream | null = null;
    (async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setCamAllowed(true); 
        setMicAllowed(true);
        if (previewRef.current) {
          previewRef.current.srcObject = stream;
          await previewRef.current.play();
        }
      } catch (e: any) {
        console.error("媒體權限錯誤:", e);
        // 個別檢查攝像頭
        try { 
          const videoStream = await navigator.mediaDevices.getUserMedia({ video: true }); 
          setCamAllowed(true);
          videoStream.getTracks().forEach(track => track.stop());
        } catch { 
          setCamAllowed(false); 
        }
        // 個別檢查麥克風
        try { 
          const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true }); 
          setMicAllowed(true);
          audioStream.getTracks().forEach(track => track.stop());
        } catch { 
          setMicAllowed(false); 
        }
      }
    })();
    return () => { 
      stream?.getTracks().forEach(t => t.stop()); 
    };
  }, [open]);

  if (!open) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-lg mx-4 rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">準備開始面試</h2>
          <div className="text-sm text-gray-600 mt-1">
            <div>科技未來有限公司 | 資深前端工程師</div>
          </div>
        </div>
        
        {/* Content */}
        <div className="px-6 py-4">
          {/* Info Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">ℹ</span>
              </div>
              <span className="text-sm text-blue-800 font-medium">
                本次面試準備將收集您的影音資料，請閱讀以下隱私說明
              </span>
            </div>
          </div>

          {/* Data Collection Notice */}
          <div className="mb-4">
            <h3 className="font-medium text-gray-900 mb-3">資料收集與使用說明</h3>
            <p className="text-sm text-gray-700 mb-3">
              在您進行面試準備過程中，我們將會收集以下資訊：
            </p>
            
            <div className="space-y-1 text-sm text-gray-700 mb-4">
              <div>• 面試過程的影音錄影</div>
              <div>• 您的語音及回答內容</div>
              <div>• 表情和眼部關注的視覺資料</div>
            </div>

            <div className="mb-4">
              <p className="text-sm font-medium text-gray-900 mb-2">這些資料將用於：</p>
              <div className="space-y-1 text-sm text-gray-700">
                <div>• 提供面試表現的分析和回饋</div>
                <div>• 改善您的面試技巧</div>
                <div>• 生成個人化的建議報告</div>
              </div>
            </div>

            <p className="text-sm text-gray-700 mb-4">
              您的資料將安全地封存加密保存，未經同意不會分享給第三方。
            </p>

            {/* Consent Checkbox */}
            <label className="flex items-start gap-3 cursor-pointer mb-4">
              <input 
                type="checkbox" 
                className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" 
                checked={agreed} 
                onChange={(e) => setAgreed(e.target.checked)} 
              />
              <span className="text-sm text-gray-700">
                我已閱讀並同意上述資料收集與使用說明
              </span>
            </label>
          </div>

          {/* Device Status */}
          <div className="mb-4">
            <h3 className="font-medium text-gray-900 mb-3">設備權限檢查</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-sm">📹 攝像頭</span>
                </div>
                <span className={`text-sm font-medium ${
                  camAllowed === null ? 'text-gray-600' :
                  camAllowed ? 'text-green-600' : 'text-red-600'
                }`}>
                  {camAllowed === null ? '檢查中...' : camAllowed ? '已允許' : '未允許'}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-sm">🎤 麥克風</span>
                </div>
                <span className={`text-sm font-medium ${
                  micAllowed === null ? 'text-gray-600' :
                  micAllowed ? 'text-green-600' : 'text-red-600'
                }`}>
                  {micAllowed === null ? '檢查中...' : micAllowed ? '已允許' : '未允許'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
          <button 
            className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded hover:bg-gray-50"
            onClick={onClose}
          >
            取消
          </button>
          <button 
            className="px-4 py-2 text-sm bg-gray-300 text-gray-500 rounded cursor-not-allowed"
            disabled
          >
            檢查權限
          </button>
          <button 
            className={`px-4 py-2 text-sm rounded ${
              agreed && camAllowed && micAllowed
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            disabled={!agreed || !camAllowed || !micAllowed} 
            onClick={onStartInterview}
          >
            開始面試
          </button>
        </div>
      </div>
    </div>
  );
}