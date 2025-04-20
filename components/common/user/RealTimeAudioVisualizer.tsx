// RealTimeAudioVisualizer.tsx - 真實反映聲音強度的音頻可視化組件
import { useEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";

interface RealTimeAudioVisualizerProps {
  isRecording: boolean;
}

export function RealTimeAudioVisualizer({
  isRecording,
}: RealTimeAudioVisualizerProps) {
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);

  // 初始化和清理音頻流
  useEffect(() => {
    if (isRecording) {
      let stream: MediaStream | null = null;

      // 請求麥克風權限並設置音頻分析
      const setupAudio = async () => {
        try {
          // 獲取麥克風音頻流
          stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: false,
          });
          setAudioStream(stream);

          // 創建音頻上下文和分析器
          const audioContext = new (window.AudioContext ||
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (window as any).webkitAudioContext)();
          const analyser = audioContext.createAnalyser();

          // 配置分析器
          analyser.fftSize = 256; // 較小的FFT尺寸提供更好的視覺效果反饋
          analyser.smoothingTimeConstant = 0.7; // 使波形更平滑

          // 連接音頻源到分析器
          const source = audioContext.createMediaStreamSource(stream);
          source.connect(analyser);

          // 儲存引用以供動畫使用
          audioContextRef.current = audioContext;
          analyserRef.current = analyser;

          // 開始繪製
          startDrawing();
        } catch (error) {
          console.error("無法獲取麥克風或設置音頻分析:", error);
        }
      };

      setupAudio();

      // 組件卸載或錄製停止時清理
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
          animationRef.current = null;
        }

        if (audioContextRef.current) {
          audioContextRef.current.close();
          audioContextRef.current = null;
        }

        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
        }

        setAudioStream(null);
      };
    } else {
      // 當停止錄製時清理
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }

      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }

      if (audioStream) {
        audioStream.getTracks().forEach((track) => track.stop());
        setAudioStream(null);
      }
    }
  }, [isRecording]);

  // 開始繪製音頻波形
  const startDrawing = () => {
    if (!canvasRef.current || !analyserRef.current) return;

    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext("2d");
    if (!canvasCtx) return;

    // 確保canvas尺寸與顯示尺寸匹配
    const resizeCanvas = () => {
      const { width, height } = canvas.getBoundingClientRect();
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
    };

    resizeCanvas();

    // 音頻分析器頻率數據
    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    // 動畫繪製函數
    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);

      // 獲取頻率數據
      analyser.getByteFrequencyData(dataArray);

      // 清除canvas
      canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

      // 設置波形繪製參數
      const barWidth = (canvas.width / bufferLength) * 2.5;
      let barHeight;
      let x = 0;

      // 繪製波形
      for (let i = 0; i < bufferLength; i++) {
        // 使用音頻數據控制波形高度
        barHeight = (dataArray[i] / 255) * canvas.height * 0.8;

        // 根據頻率和強度創建漸變顏色
        const hue = (i / bufferLength) * 220 + 180; // 藍綠色調
        canvasCtx.fillStyle = `hsl(${hue}, 80%, ${
          50 + (dataArray[i] / 255) * 30
        }%)`;

        // 繪製波形柱狀條（從中央向上和向下對稱）
        const centerY = canvas.height / 2;
        canvasCtx.fillRect(x, centerY - barHeight / 2, barWidth, barHeight);

        x += barWidth + 1;
      }
    };

    // 開始動畫循環
    draw();
  };

  return (
    <Box
      sx={{
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100%",
        height: "150px",
        overflow: "hidden",
        opacity: isRecording ? 1 : 0.5,
        transition: "opacity 0.3s ease",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          background: "transparent",
        }}
      />
      {!isRecording && (
        <Typography
          variant="caption"
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "#fff",
            textAlign: "center",
            width: "100%",
          }}
        >
          開始回答後，即可看到聲音波形
        </Typography>
      )}
    </Box>
  );
}
