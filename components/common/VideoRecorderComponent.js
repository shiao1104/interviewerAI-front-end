import { useState } from "react";
import VideoRecorder from "react-video-recorder";

export default function VideoRecorderComponent() {
  const [isRecording, setIsRecording] = useState(false);
  const [videoBlobUrl, setVideoBlobUrl] = useState(null);

  // Blob 下載工具函數
  const downloadBlob = (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // 錄影完成時處理影片
  const handleRecordingComplete = (videoBlob) => {
    console.log("錄影完成:", videoBlob);
    const videoUrl = URL.createObjectURL(videoBlob);
    setVideoBlobUrl(videoUrl);
    downloadBlob(videoBlob, "recorded-video.mp4");
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">影片錄製器 🎥</h2>

      <VideoRecorder
        isOnInitially
        isFliped
        showReplayControls
        countdownTime="3000"
        timeLimit="60000"
        onStartRecording={() => setIsRecording(true)}
        onStopRecording={() => setIsRecording(false)}
        onRecordingComplete={handleRecordingComplete}
      />

      {videoBlobUrl && (
        <div>
          <h3 className="text-lg font-semibold mt-4">預覽錄製影片：</h3>
          <video src={videoBlobUrl} controls autoPlay loop className="w-full max-w-md" />
        </div>
      )}
    </div>
  );
}
