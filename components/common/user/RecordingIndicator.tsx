// RecordingIndicator.tsx - 整合實時音頻可視化的錄音指示器
import { Box, Typography } from "@mui/material";
import { RealTimeAudioVisualizer } from "./RealTimeAudioVisualizer";
import styles from "@/styles/pages/user/Interview.module.scss";

interface RecordingIndicatorProps {
  isRecording: boolean;
  timeLeft: number;
  formatTime: (seconds: number) => string;
}

export function RecordingIndicator({
  isRecording,
  timeLeft,
  formatTime,
}: RecordingIndicatorProps) {
  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        backgroundColor: "#000",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%",
        }}
      >
        <Typography variant="h5" color="#fff" gutterBottom>
          正在計時中
        </Typography>
        <Typography variant="h2" color="#fff" className={styles.timerDisplay}>
          {formatTime(timeLeft)}
        </Typography>
      </Box>

      {/* 紅色錄製指示器 */}
      <Box
        sx={{
          position: "absolute",
          top: 16,
          left: 16,
          backgroundColor: "rgba(255, 0, 0, 0.7)",
          padding: "4px 12px",
          borderRadius: 4,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            backgroundColor: "#f00",
            marginRight: 1,
            animation: "pulse 1.5s infinite",
          }}
        />
        <Typography variant="body2" color="#fff">
          回答中
        </Typography>
      </Box>

      {/* 實時音頻可視化 */}
      <RealTimeAudioVisualizer isRecording={isRecording} />

      {/* 添加全局脈衝動畫 */}
      <style jsx global>{`
        @keyframes pulse {
          0% {
            opacity: 0.5;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0.5;
          }
        }
      `}</style>
    </Box>
  );
}
