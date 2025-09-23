"use client";
import { useState } from "react";

type Props = { open: boolean; onClose: () => void; onAccept: () => void; };

export default function ConsentModal({ open, onClose, onAccept }: Props) {
  const [checked, setChecked] = useState(false);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-lg mx-4 rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">資料收集與使用聲明</h2>
          <p className="text-sm text-gray-600">學生模擬面試系統</p>
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
                本次模擬面試將收集您的影音資料，請詳細閱讀以下說明
              </span>
            </div>
          </div>

          {/* Data Collection Notice */}
          <div className="mb-4">
            <h3 className="font-medium text-gray-900 mb-3">資料收集與使用說明</h3>
            <p className="text-sm text-gray-700 mb-3">
              在您進行模擬面試過程中，我們將會收集以下資訊：
            </p>
            
            <div className="space-y-2 text-sm text-gray-700 mb-4">
              <div>• 面試過程的錄影內容</div>
              <div>• 您的語音及回答內容</div>
              <div>• 表情和眼部關注的視覺資料</div>
              <div>• 您選擇的科系和面試表現資料</div>
            </div>

            <div className="mb-4">
              <p className="text-sm font-medium text-gray-900 mb-2">這些資料將用於：</p>
              <div className="space-y-1 text-sm text-gray-700">
                <div>• 提供面試表現的分析和反饋</div>
                <div>• 改善您的面試技巧和表達能力</div>
                <div>• 生成個人化的學習建議報告</div>
                <div>• 幫助您為真實面試做好準備</div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-yellow-800">
                <strong>隱私保護：</strong>您的資料安全對我們至關重要。所有收集的資料將依照我們的隱私政策進行加密存儲，
                僅用於提供面試分析服務，不會在未經您同意的情況下分享給第三方。您可以隨時聯繫我們關於您的隱私資料處理。
              </p>
            </div>
          </div>

          {/* Consent Checkbox */}
          <label className="flex items-start gap-3 cursor-pointer">
            <input 
              type="checkbox" 
              className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" 
              checked={checked} 
              onChange={(e) => setChecked(e.target.checked)} 
            />
            <span className="text-sm text-gray-700">
              我已閱讀並同意上述資料收集與使用說明，同意進行模擬面試錄製
            </span>
          </label>
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
            className={`px-4 py-2 text-sm rounded ${
              checked 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            disabled={!checked} 
            onClick={onAccept}
          >
            同意並繼續
          </button>
        </div>
      </div>
    </div>
  );
}
