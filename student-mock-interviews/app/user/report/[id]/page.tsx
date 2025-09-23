"use client";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import VideoPlayer from "@/components/VideoPlayer";

// 模擬報告數據
const mockReportData = {
  "1": {
    id: "1",
    interviewInfo: {
      department: "會計資訊系",
      date: "2025/09/25",
      duration: "00:20",
      interviewNumber: "#001"
    },
    overallScore: 87,
    scores: {
      communication: { score: 22, total: 25, label: "語言表達力" },
      accuracy: { score: 21, total: 25, label: "精確度分析" },
      technical: { score: 24, total: 26, label: "技術能力測測" },
      teamwork: { score: 20, total: 25, label: "團隊合作" }
    },
    feedback: {
      communication: "表達能力良好，語調清晰，用詞恰當，能流暢表達想法。",
      accuracy: "回答過程中表現出較佳的主題掌握性，語言自性，對問題回應度具完整性。",
      technical: "展現良好的技術能力分析，展現良好的邏輯架構和技術能力，專業知識豐富。",
      teamwork: "團隊合作能力充盈，展現良好的溝通與協作能力，過去的團隊經驗豐富。"
    },
    questions: [
      {
        id: 1,
        text: "請做一下自我介紹，並說明為何選擇本系？",
        videoUrl: "/mock-video-1.mp4", // 模擬影片路徑
        analysis: "自我介紹清晰完整，展現良好的表達能力。"
      },
      {
        id: 2,
        text: "分享一個與本系相關的經驗或專題。",
        videoUrl: "/mock-video-2.mp4",
        analysis: "能具體說明專題經驗，技術細節豐富。"
      },
      {
        id: 3,
        text: "遇到困難時，你是如何解決問題的？",
        videoUrl: "/mock-video-3.mp4",
        analysis: "問題解決思路清晰，展現良好的邏輯思維。"
      }
    ]
  },
  "2": {
    id: "2",
    interviewInfo: {
      department: "財務金融系",
      date: "2025/09/20",
      duration: "00:15",
      interviewNumber: "#002"
    },
    overallScore: 92,
    scores: {
      communication: { score: 23, total: 25, label: "語言表達力" },
      accuracy: { score: 24, total: 25, label: "精確度分析" },
      technical: { score: 25, total: 26, label: "技術能力測測" },
      teamwork: { score: 23, total: 25, label: "團隊合作" }
    },
    feedback: {
      communication: "優秀的表達能力，邏輯清晰，回答完整。",
      accuracy: "答題準確度極高，完全理解問題重點。",
      technical: "技術能力出色，深度與廣度兼具。",
      teamwork: "展現出色的團隊協作精神和領導能力。"
    },
    questions: [
      {
        id: 1,
        text: "描述您在後端開發方面的經驗。",
        videoUrl: "/mock-video-4.mp4",
        analysis: "技術描述詳細，經驗豐富。"
      },
      {
        id: 2,
        text: "如何處理系統性能優化？",
        videoUrl: "/mock-video-5.mp4",
        analysis: "展現深度的技術理解和實務經驗。"
      }
    ]
  },
  "3": {
    id: "3",
    interviewInfo: {
      department: "資訊管理系",
      date: "2025/09/15",
      duration: "00:18",
      interviewNumber: "#003"
    },
    overallScore: 75,
    scores: {
      communication: { score: 18, total: 25, label: "語言表達力" },
      accuracy: { score: 19, total: 25, label: "精確度分析" },
      technical: { score: 20, total: 26, label: "技術能力測測" },
      teamwork: { score: 18, total: 25, label: "團隊合作" }
    },
    feedback: {
      communication: "表達能力有待加強，建議多練習口語表達。",
      accuracy: "基本概念正確，但需要更深入的理解。",
      technical: "技術基礎扎實，但需要更多實務經驗。",
      teamwork: "團隊協作意識良好，可進一步發展領導技能。"
    },
    questions: [
      {
        id: 1,
        text: "解釋機器學習的基本概念。",
        videoUrl: "/mock-video-6.mp4",
        analysis: "概念理解正確，但表達可以更清晰。"
      },
      {
        id: 2,
        text: "如何進行數據預處理？",
        videoUrl: "/mock-video-7.mp4",
        analysis: "步驟完整，但缺乏實務細節。"
      }
    ]
  }
};

export default function ReportPage() {
  const params = useParams();
  const router = useRouter();
  const reportId = params.id as string;
  const [activeTab, setActiveTab] = useState<"overview" | "detail">("overview");
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null);

  const reportData = mockReportData[reportId as keyof typeof mockReportData];

  if (!reportData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 text-center">
          <h1 className="text-xl font-semibold mb-4">找不到報告</h1>
          <button 
            onClick={() => router.push("/")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            返回首頁
          </button>
        </div>
      </div>
    );
  }

  const { interviewInfo, overallScore, scores, feedback, questions } = reportData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => router.push("/")}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                ← 返回主畫面
              </button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">🎓</span>
                </div>
                <span className="font-semibold text-lg">模擬面試分析報告</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">
                面試練習讓您更有自信！
              </span>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">學</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Interview Info Section */}
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-xl font-semibold mb-4">模擬面試資訊</h1>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-lg">🎓</span>
                </div>
                <div>
                  <h2 className="font-medium text-gray-900 text-lg">{interviewInfo.department}</h2>
                  <div className="text-sm text-gray-600 mt-2 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4">📅</span>
                      <span>面試日期：{interviewInfo.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4">⏱️</span>
                      <span>面試時長：{interviewInfo.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4">🔢</span>
                      <span>面試編號：{interviewInfo.interviewNumber}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      ✅ 已完成
                    </span>
                  </div>
                </div>
              </div>
              
              {/* 總體評分預覽 */}
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <div className="relative w-20 h-20 mx-auto mb-2">
                    <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="35"
                        stroke="#e5e7eb"
                        strokeWidth="6"
                        fill="transparent"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="35"
                        stroke="#3b82f6"
                        strokeWidth="6"
                        fill="transparent"
                        strokeDasharray={`${(overallScore / 100) * 219.8} 219.8`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-lg font-bold text-gray-900">{overallScore}</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">總體評分</div>
                </div>
              </div>
            </div>
          </div>

          {/* Report Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab("overview")}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "overview"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                總評
              </button>
              <button
                onClick={() => setActiveTab("detail")}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "detail"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                詳細分析
              </button>
            </div>
          </div>

          {/* Report Content */}
          <div className="p-6">
            {activeTab === "overview" && (
              <div>
                <h2 className="text-lg font-semibold mb-6">AI 面試分析報告</h2>
                
                {/* Overall Score */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-8 mb-8">
                  <div className="flex items-center justify-center mb-6">
                    <div className="relative w-40 h-40">
                      <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="35"
                          stroke="#e5e7eb"
                          strokeWidth="6"
                          fill="transparent"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="35"
                          stroke={overallScore >= 90 ? "#10b981" : overallScore >= 80 ? "#3b82f6" : "#f59e0b"}
                          strokeWidth="6"
                          fill="transparent"
                          strokeDasharray={`${(overallScore / 100) * 219.8} 219.8`}
                          strokeLinecap="round"
                          className="drop-shadow-sm"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className={`text-4xl font-bold ${
                            overallScore >= 90 ? 'text-green-600' : 
                            overallScore >= 80 ? 'text-blue-600' : 
                            'text-orange-600'
                          }`}>{overallScore}</div>
                          <div className="text-sm text-gray-600 font-medium">總體評分</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <p className={`text-lg font-medium mb-2 ${
                      overallScore >= 90 ? 'text-green-700' : 
                      overallScore >= 80 ? 'text-blue-700' : 
                      'text-orange-700'
                    }`}>
                      {overallScore >= 90 ? '🎉 表現優異！' : 
                       overallScore >= 80 ? '👏 表現良好！' : 
                       '💪 持續加油！'}
                    </p>
                    <p className="text-gray-600">
                      {overallScore >= 90 ? '您的面試表現非常出色，各項能力都達到優秀水準。' : 
                       overallScore >= 80 ? '您的面試表現良好，在多個領域都有不錯的表現。' : 
                       '您已經踏出重要的一步，繼續練習將會有更大的進步。'}
                    </p>
                  </div>
                </div>

                {/* Score Breakdown */}
                <div className="grid md:grid-cols-2 gap-6">
                  {Object.entries(scores).map(([key, score]) => {
                    const percentage = Math.round((score.score / score.total) * 100);
                    const scoreColor = percentage >= 90 ? 'green' : percentage >= 80 ? 'blue' : percentage >= 70 ? 'yellow' : 'red';
                    
                    return (
                      <div key={key} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-base font-medium text-gray-900 flex items-center gap-2">
                            <span className="text-lg">
                              {key === 'communication' ? '💬' : 
                               key === 'accuracy' ? '🎯' : 
                               key === 'technical' ? '⚙️' : '🤝'}
                            </span>
                            {score.label}
                          </span>
                          <span className={`text-sm font-semibold px-2 py-1 rounded-full ${
                            scoreColor === 'green' ? 'bg-green-100 text-green-700' :
                            scoreColor === 'blue' ? 'bg-blue-100 text-blue-700' :
                            scoreColor === 'yellow' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {score.score}/{score.total}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                          <div
                            className={`h-3 rounded-full transition-all duration-1000 ${
                              scoreColor === 'green' ? 'bg-green-500' :
                              scoreColor === 'blue' ? 'bg-blue-500' :
                              scoreColor === 'yellow' ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-gray-500">評分</span>
                          <span className={`text-sm font-medium ${
                            scoreColor === 'green' ? 'text-green-600' :
                            scoreColor === 'blue' ? 'text-blue-600' :
                            scoreColor === 'yellow' ? 'text-yellow-600' :
                            'text-red-600'
                          }`}>
                            {percentage}%
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">{feedback[key as keyof typeof feedback]}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === "detail" && (
              <div>
                <h2 className="text-lg font-semibold mb-6">題目回顧與分析</h2>
                
                <div className="space-y-4">
                  {questions.map((question, index) => (
                    <div key={question.id} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                      <div 
                        className="p-5 bg-gradient-to-r from-gray-50 to-gray-100 cursor-pointer hover:from-blue-50 hover:to-blue-100 transition-all duration-200"
                        onClick={() => setSelectedQuestion(selectedQuestion === index ? null : index)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0 mt-1">
                              {question.id}
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900 text-base leading-relaxed">
                                {question.text}
                              </h3>
                              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                  <span>🎥</span>
                                  回答影片
                                </span>
                                <span className="flex items-center gap-1">
                                  <span>🤖</span>
                                  AI分析
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              selectedQuestion === index 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                              {selectedQuestion === index ? '收合' : '展開'}
                            </span>
                            <span className={`text-gray-400 transform transition-transform duration-200 ${
                              selectedQuestion === index ? 'rotate-180' : ''
                            }`}>
                              ▽
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {selectedQuestion === index && (
                        <div className="p-6 bg-white border-t border-gray-200">
                          <div className="grid lg:grid-cols-2 gap-8">
                            {/* Video Player */}
                            <div className="space-y-4">
                              <div className="flex items-center gap-2 mb-4">
                                <span className="text-lg">🎥</span>
                                <h4 className="font-semibold text-gray-900">回答影片</h4>
                              </div>
                              <VideoPlayer
                                videoUrl={question.videoUrl}
                                title={`問題 ${question.id} 回答`}
                                onPlay={() => console.log(`開始播放問題 ${question.id}`)}
                                onPause={() => console.log(`暫停播放問題 ${question.id}`)}
                              />
                            </div>
                            
                            {/* Analysis */}
                            <div className="space-y-4">
                              <div className="flex items-center gap-2 mb-4">
                                <span className="text-lg">🤖</span>
                                <h4 className="font-semibold text-gray-900">AI 分析回饋</h4>
                              </div>
                              
                              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-5">
                                <div className="flex items-start gap-3">
                                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-blue-600 text-sm">✨</span>
                                  </div>
                                  <p className="text-blue-800 leading-relaxed">
                                    {question.analysis}
                                  </p>
                                </div>
                              </div>
                              
                              <div className="bg-gray-50 rounded-lg p-4">
                                <h5 className="font-medium text-gray-900 mb-3">詳細評估</h5>
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600 flex items-center gap-2">
                                      <span>💬</span>
                                      表達流暢度
                                    </span>
                                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">良好</span>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600 flex items-center gap-2">
                                      <span>📝</span>
                                      內容完整性
                                    </span>
                                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">優秀</span>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600 flex items-center gap-2">
                                      <span>🎯</span>
                                      專業度
                                    </span>
                                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">中等</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}