"use client";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SAMPLE_QUESTIONS, type Department } from "@/lib/constants";

export default function InterviewSession() {
  const searchParams = useSearchParams();
  const dept = searchParams.get("dept") as Department;
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [phase, setPhase] = useState<"prep" | "answer">("prep"); // 準備階段或回答階段
  const [timeRemaining, setTimeRemaining] = useState(30); // 預設準備時間30秒
  const [isRecording, setIsRecording] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const questions = SAMPLE_QUESTIONS[dept] || SAMPLE_QUESTIONS["會計資訊系"];
  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  
  // 取得當前階段的時間設定
  const getCurrentPhaseDuration = () => {
    if (phase === "prep") {
      return currentQuestion?.prepSec || 30; // 準備時間
    } else {
      return currentQuestion?.answerSec || 90; // 回答時間
    }
  };

  // 設置視訊串流
  useEffect(() => {
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: true 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      } catch (error) {
        console.error("無法獲取媒體權限:", error);
      }
    })();
  }, []);

  // 當問題或階段改變時，重設時間
  useEffect(() => {
    const duration = getCurrentPhaseDuration();
    setTimeRemaining(duration);
  }, [currentQuestionIndex, phase, currentQuestion]);

  // 倒數計時器
  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      // 時間到了，自動切換階段
      handleTimeUp();
    }
  }, [timeRemaining]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTimeUp = () => {
    if (phase === "prep") {
      // 準備時間結束，進入回答階段
      setPhase("answer");
    } else {
      // 回答時間結束，進入下一題
      handleNextQuestion();
    }
  };

  const handleSkipPrep = () => {
    if (phase === "prep") {
      setPhase("answer");
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setPhase("prep"); // 重設為準備階段
    } else {
      // 所有問題完成
      if (confirm("面試已完成！是否返回首頁？")) {
        window.location.href = "/";
      }
    }
  };

  const handleEndInterview = () => {
    if (confirm("確定要退出面試嗎？")) {
      window.location.href = "/";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-white">
              面試公司：科技未來有限公司
            </h1>
            <p className="text-slate-300">面試職位：資深前端工程師</p>
          </div>
          <div className="text-right text-slate-300">
            <div>問題 {currentQuestionIndex + 1}/{questions.length}</div>
            <div>進度: {Math.round(progress)}%</div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Panel - Question */}
        <div className="w-1/2 p-6">
          <div className="bg-white rounded-lg shadow-lg h-full flex flex-col">
            {/* Question Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  phase === "prep" 
                    ? "bg-blue-100 text-blue-800" 
                    : "bg-green-100 text-green-800"
                }`}>
                  {phase === "prep" ? "準備中" : "回答中"}
                </span>
                <span className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm">
                  時間限制: {formatTime(timeRemaining)}
                </span>
              </div>
            </div>

            {/* Question Content */}
            <div className="flex-1 p-6">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  問題 {currentQuestionIndex + 1}：
                </h2>
                <p className="text-gray-700 text-lg leading-relaxed">
                  {currentQuestion?.text || "請介紹一下你自己以及你過去的工作經驗。"}
                </p>
              </div>

              {/* Phase Instructions */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                {phase === "prep" ? (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">準備階段</h3>
                    <p className="text-sm text-gray-600">
                      請利用這段時間思考您的回答。準備時間結束後將自動開始錄製您的回答。
                    </p>
                  </div>
                ) : (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">回答階段</h3>
                    <p className="text-sm text-gray-600">
                      現在開始錄製您的回答。請對著攝影機清楚地回答問題。
                    </p>
                  </div>
                )}
              </div>

              {/* Timer Bar */}
              <div className="mb-6">
                <div className="bg-gray-200 rounded-full h-2 mb-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-1000 ${
                      phase === "prep" ? "bg-blue-500" : "bg-green-500"
                    }`}
                    style={{ width: `${(timeRemaining / getCurrentPhaseDuration()) * 100}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600">
                  {phase === "prep" ? "準備時間剩餘" : "回答時間剩餘"}: {formatTime(timeRemaining)}
                </p>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="p-6 border-t border-gray-200">
              <div className="flex gap-3">
                {phase === "prep" ? (
                  <>
                    <button 
                      onClick={handleSkipPrep}
                      className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      跳過準備時間
                    </button>
                    <button 
                      onClick={handleEndInterview}
                      className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      🚪 退出面試
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={handleNextQuestion}
                      className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
                      disabled={currentQuestionIndex >= questions.length - 1}
                    >
                      {currentQuestionIndex >= questions.length - 1 ? "完成面試" : "> 下一題"}
                    </button>
                    <button 
                      onClick={handleEndInterview}
                      className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      🚪 退出面試
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Video */}
        <div className="w-1/2 p-6">
          <div className="bg-white rounded-lg shadow-lg h-full">
            {/* Video Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  phase === "answer" && isRecording ? "bg-red-500 animate-pulse" : "bg-gray-400"
                }`}></div>
                <span className="text-sm font-medium text-gray-700">
                  {phase === "answer" && isRecording ? "錄製中" : "準備中"}
                </span>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                phase === "answer" && isRecording 
                  ? "bg-red-100 text-red-800" 
                  : "bg-gray-100 text-gray-800"
              }`}>
                {phase === "prep" ? `準備 ${formatTime(timeRemaining)}` : `錄製中 ${formatTime(timeRemaining)}`}
              </span>
            </div>

            {/* Video Content */}
            <div className="p-4 h-[calc(100%-120px)]">
              <div className="relative w-full h-full bg-black rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  muted
                  playsInline
                />
                
                {/* Video Overlay */}
                <div className="absolute inset-0 pointer-events-none">
                  {phase === "prep" && (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <div className="text-white text-center">
                        <div className="text-2xl mb-2">⏱️</div>
                        <div className="text-lg font-medium">準備中...</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Video Controls */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex justify-center gap-4">
                <button 
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                    phase === "answer" && isRecording 
                      ? 'bg-red-600 text-white hover:bg-red-700' 
                      : 'bg-gray-300 text-gray-600'
                  }`}
                  onClick={() => phase === "answer" && setIsRecording(!isRecording)}
                  disabled={phase === "prep"}
                >
                  📹
                </button>
                <button 
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                    phase === "answer" 
                      ? 'bg-gray-600 text-white hover:bg-gray-700' 
                      : 'bg-gray-300 text-gray-600'
                  }`}
                  disabled={phase === "prep"}
                >
                  🎤
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
