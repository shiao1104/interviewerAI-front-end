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
        setCamAllowed(true); 
        setMicAllowed(true);
        if (previewRef.current) {
          previewRef.current.srcObject = stream;
          await previewRef.current.play();
        }
      } catch (e: any) {
        setError(e?.message || String(e));
        // 個別檢查
        try { 
          await navigator.mediaDevices.getUserMedia({ video: true }); 
          setCamAllowed(true); 
        } catch { 
          setCamAllowed(false); 
        }
        try { 
          await navigator.mediaDevices.getUserMedia({ audio: true }); 
          setMicAllowed(true); 
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md mx-4 rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">裝置權限檢查</h3>
          <p className="text-sm text-gray-600">學生模擬面試系統</p>
        </div>
        
        {/* Content */}
        <div className="px-6 py-4">
          {/* Instructions */}
          <div className="mb-4">
            <p className="text-sm text-gray-700 mb-3">
              請確保您的攝影機與麥克風正常運作。面試將包含多個問題，每個問題都有時間限制。
            </p>
            <p className="text-sm text-gray-700 mb-4">
              請在安靜且光線充足的環境中進行面試，確保攝影機能清楚捕捉您的表情。
            </p>
          </div>

          {/* Device Status */}
          <div className="space-y-3 mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full ${
                camAllowed === null ? 'bg-gray-400' : 
                camAllowed ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
              <span className="text-sm flex items-center gap-2">
                📹 攝影機：
                <span className={`px-2 py-1 rounded text-xs ${
                  camAllowed === null ? 'bg-gray-100 text-gray-600' :
                  camAllowed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {camAllowed === null ? "檢查中..." : camAllowed ? "已允許" : "未允許"}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full ${
                micAllowed === null ? 'bg-gray-400' : 
                micAllowed ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
              <span className="text-sm flex items-center gap-2">
                🎤 麥克風：
                <span className={`px-2 py-1 rounded text-xs ${
                  micAllowed === null ? 'bg-gray-100 text-gray-600' :
                  micAllowed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {micAllowed === null ? "檢查中..." : micAllowed ? "已允許" : "未允許"}
                </span>
              </span>
            </div>
          </div>

          {/* Video Preview */}
          <div className="bg-gray-900 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-white text-sm">攝影機預覽</span>
              </div>
              <span className="text-gray-300 text-xs">準備中</span>
            </div>
            
            <div className="bg-black rounded-lg h-40 flex items-center justify-center overflow-hidden">
              {previewRef.current ? (
                <video 
                  ref={previewRef} 
                  className="w-full h-full object-cover rounded-lg" 
                  muted 
                  playsInline
                />
              ) : (
                <div className="text-gray-400 text-center">
                  <div className="text-2xl mb-2">📷</div>
                  <div className="text-sm">等待攝影機連接...</div>
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">
                <strong>權限錯誤：</strong>{error}
              </p>
              <p className="text-red-600 text-xs mt-1">
                請在瀏覽器設定中允許攝影機和麥克風權限，然後重新載入頁面。
              </p>
            </div>
          )}

          {/* Ready Status */}
          {camAllowed && micAllowed && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span className="text-green-800 text-sm font-medium">裝置檢查完成，可以開始面試！</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
          <button 
            className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded hover:bg-gray-50"
            onClick={onCancel}
          >
            返回設定
          </button>
          <button 
            className={`px-4 py-2 text-sm rounded ${
              camAllowed && micAllowed
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            disabled={!camAllowed || !micAllowed} 
            onClick={() => onReady((previewRef.current?.srcObject as MediaStream) || new MediaStream())}
          >
            開始面試
          </button>
        </div>
      </div>
    </div>
  );
}
