"use client";
import { useState } from "react";
import { DEPARTMENTS, type Department } from "@/lib/constants";
import InterviewPrepModal from "@/components/InterviewPrepModal";
import { useRouter } from "next/navigation";

export default function Page() {
  const [selectedDept, setSelectedDept] = useState<Department | "">("");
  const [showPrepModal, setShowPrepModal] = useState(false);
  const router = useRouter();

  const handleStartInterview = () => {
    if (!selectedDept) {
      alert("請選擇一個科系後點擊「開始模擬面試」");
      return;
    }
    setShowPrepModal(true);
  };

  const handleStartInterviewSession = () => {
    setShowPrepModal(false);
    const queryParams = new URLSearchParams({
      dept: String(selectedDept)
    });
    router.push(`/interview/session?${queryParams.toString()}`);
  };

  // 模擬的歷次面試記錄
  const interviewHistory = [
    {
      id: "1",
      date: "2025/09/25",
      department: "會計資訊系",
      interviewNumber: "#001",
      status: "已完成",
      score: 87,
      duration: "00:20"
    },
    {
      id: "2", 
      date: "2025/09/20",
      department: "財務金融系",
      interviewNumber: "#002",
      status: "已完成",
      score: 92,
      duration: "00:15"
    },
    {
      id: "3",
      date: "2025/09/15", 
      department: "資訊管理系",
      interviewNumber: "#003",
      status: "已完成",
      score: 75,
      duration: "00:18"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">學生模擬面試 | 首頁</h1>
          <p className="text-slate-300">
            選擇科系後開始，完成後可從下方查看「歷次紀錄」。
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Department Selection Card */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-blue-600">選擇科系開始模擬</h2>
              <div className="text-sm text-gray-500">
                分選一個科系後點擊「開始模擬面試」
              </div>
            </div>

            {/* Department Radio Buttons */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {DEPARTMENTS.map((dept) => (
                <label
                  key={dept}
                  className={`
                    flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all
                    ${selectedDept === dept 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="department"
                    value={dept}
                    checked={selectedDept === dept}
                    onChange={(e) => setSelectedDept(e.target.value as Department)}
                    className="mr-3 text-blue-600"
                  />
                  <span className="text-sm font-medium text-gray-900">
                    {dept}
                  </span>
                </label>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleStartInterview}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                開始模擬面試
              </button>
              <button
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => {
                  // 重新增加紀錄功能（開發）
                  alert("新增歷程紀錄功能正在開發中");
                }}
              >
                （開發）新增歷程紀錄
              </button>
              <button
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => {
                  // 清除所有紀錄功能
                  alert("清除所有紀錄功能");
                }}
              >
                清除全部紀錄
              </button>
            </div>
          </div>

          {/* Interview History Card */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">歷次模擬面試紀錄</h2>
              <div className="text-sm text-gray-500">
                完成會自動加入列表；可點「查看報告」。
              </div>
            </div>

            {/* Filter Controls */}
            <div className="flex gap-4 mb-4">
              <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                <option>全部科系</option>
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="搜尋：科系 / 編號 / 狀態..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      日期
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      科系
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      狀態
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      總分
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {interviewHistory.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-12 text-center text-gray-500">
                        尚無紀錄
                      </td>
                    </tr>
                  ) : (
                    interviewHistory.map((record) => (
                      <tr key={record.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.date}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{record.department}</div>
                            <div className="text-xs text-gray-500 mt-1">
                              <span className="inline-flex items-center gap-1">
                                <span>🔢</span>
                                <span>{record.interviewNumber}</span>
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {record.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center gap-2">
                            <span className={`font-medium ${
                              record.score >= 90 ? 'text-green-600' : 
                              record.score >= 80 ? 'text-blue-600' : 
                              'text-orange-600'
                            }`}>
                              {record.score}
                            </span>
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  record.score >= 90 ? 'bg-green-500' : 
                                  record.score >= 80 ? 'bg-blue-500' : 
                                  'bg-orange-500'
                                }`}
                                style={{ width: `${record.score}%` }}
                              ></div>
                            </div>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">時長: {record.duration}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                          <button 
                            onClick={() => router.push(`/user/report/${record.id}`)}
                            className="text-blue-600 hover:text-blue-800 font-medium mr-4"
                          >
                            查看報告
                          </button>
                          <button 
                            onClick={() => alert(`重新練習: ${record.department}`)}
                            className="text-gray-600 hover:text-gray-800"
                          >
                            重新練習
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Interview Preparation Modal */}
      <InterviewPrepModal
        open={showPrepModal}
        onClose={() => setShowPrepModal(false)}
        onStartInterview={handleStartInterviewSession}
      />
    </div>
  );
}
