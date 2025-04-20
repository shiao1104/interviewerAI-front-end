import { useState, useEffect, useRef } from "react";
import VideoRecorder from "react-video-recorder";

export default function VideoRecorderComponent({
  onRecordingChange = () => {},
  onRecordingComplete = () => {},
  isRecordingControlled = false,
  isRecording = false
}) {
  const [internalIsRecording, setInternalIsRecording] = useState(false);
  const [videoBlobUrl, setVideoBlobUrl] = useState(null);
  const [containerSize, setContainerSize] = useState({
    width: "100%",
    height: "100%"
  });
  
  const recorderRef = useRef(null);

  // 在組件掛載和視窗大小變化時調整大小
  useEffect(() => {
    const handleResize = () => {
      const windowWidth = window.innerWidth;
      
      // 計算適中的寬度和高度
      let width, height;
      
      if (windowWidth > 1200) {
        width = "100%";
        height = "100%";
      } else if (windowWidth > 768) {
        width = "100%";
        height = "100%";
      } else {
        width = "100%";
        height = "40vh";
      }
      
      setContainerSize({ width, height });
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  
  // 同步控制狀態
  useEffect(() => {
    if (isRecordingControlled) {
      if (isRecording !== internalIsRecording) {
        setInternalIsRecording(isRecording);
        
        // 觸發VideoRecorder的開始或停止錄製動作
        if (isRecording && recorderRef.current) {
          // 這裡理想情況下應該呼叫組件的startRecording，但react-video-recorder可能沒有直接暴露此方法
          // 這是個模擬方案，實際實現可能需要根據VideoRecorder的API進行調整
          console.log("外部觸發錄製開始");
        } else if (!isRecording && recorderRef.current) {
          console.log("外部觸發錄製停止");
        }
      }
    }
  }, [isRecording, isRecordingControlled, internalIsRecording]);

  // 處理錄影狀態變化
  const handleRecordingStateChange = (isRecordingNow) => {
    if (!isRecordingControlled) {
      setInternalIsRecording(isRecordingNow);
    }
    onRecordingChange(isRecordingNow);
  };

  // 錄影完成時處理影片
  const handleRecordingComplete = (videoBlob) => {
    console.log("錄影完成:", videoBlob);
    const videoUrl = URL.createObjectURL(videoBlob);
    setVideoBlobUrl(videoUrl);
    onRecordingComplete(videoBlob);
  };

  return (
    <div
      style={{
        width: containerSize.width,
        height: containerSize.height,
        overflow: "hidden",
        borderRadius: "8px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
      }}
    >
      <VideoRecorder
        ref={recorderRef}
        isOnInitially
        isFliped
        showReplayControls
        countdownTime="3000"
        timeLimit="0" // 設為0表示無限制，由外部控制時間
        onStartRecording={() => handleRecordingStateChange(true)}
        onStopRecording={() => handleRecordingStateChange(false)}
        onRecordingComplete={handleRecordingComplete}
        style={{ 
          width: "100%", 
          height: "100%", 
          objectFit: "cover" 
        }}
      />
    </div>
  );
}