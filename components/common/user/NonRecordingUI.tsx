// NonRecordingUI.tsx - 非錄製狀態的用戶界面
import { Box, Typography, Button } from "@mui/material";
import { RealTimeAudioVisualizer } from "./RealTimeAudioVisualizer";

interface NonRecordingUIProps {
  isInterviewStarted: boolean;
  isPreparing: boolean;
  prepTimeLeft: number;
  formatTime: (seconds: number) => string;
  mediaPermissions: {
    camera: boolean;
    microphone: boolean;
  };
  onCheckPermissions: () => void;
}

export function NonRecordingUI({
  isInterviewStarted,
  isPreparing,
  prepTimeLeft,
  formatTime,
  mediaPermissions,
  onCheckPermissions,
}: NonRecordingUIProps) {
  if (!isInterviewStarted) {
    // 面試尚未開始
    return (
      <Box
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#333",
          color: "#fff",
          padding: 2,
        }}
      >
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            bgcolor: "rgba(0, 123, 255, 0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 2,
          }}
        >
          <Box
            component="span"
            sx={{
              fontSize: 32,
              lineHeight: 1,
            }}
          >
            🎙️
          </Box>
        </Box>
        <Typography variant="h6" gutterBottom>
          面試尚未開始
        </Typography>
        <Typography variant="body1" align="center">
          請點擊「開始面試」按鈕並授予媒體權限
        </Typography>
      </Box>
    );
  }

  if (isPreparing) {
    // 準備時間
    return (
      <Box
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          backgroundColor: "#003366",
          color: "#fff",
          padding: 3,
        }}
      >
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #0099ff 0%, #004488 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 2,
            boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
          }}
        >
          <Typography variant="h3">⏱️</Typography>
        </Box>
        <Typography variant="h5" gutterBottom>
          準備時間
        </Typography>
        <Typography
          variant="h2"
          sx={{
            marginBottom: 2,
            fontWeight: "bold",
            textShadow: "0 2px 4px rgba(0,0,0,0.3)",
          }}
        >
          {formatTime(prepTimeLeft)}
        </Typography>
        <Typography variant="body1" align="center" sx={{ maxWidth: "80%" }}>
          請思考您的回答，準備時間結束後會自動開始計時
        </Typography>

        {/* 預覽音頻波形 */}
        <RealTimeAudioVisualizer isRecording={false} />
      </Box>
    );
  }

  // 準備回答狀態
  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#333",
        color: "#fff",
        padding: 2,
      }}
    >
      <Typography variant="h6" gutterBottom>
        準備回答
      </Typography>
      <Typography
        variant="body1"
        align="center"
        sx={{ marginTop: 2, marginBottom: 4 }}
      >
        請點擊「開始回答」按鈕開始計時
      </Typography>

      {!mediaPermissions.camera || !mediaPermissions.microphone ? (
        <Button
          variant="outlined"
          color="info"
          size="small"
          onClick={onCheckPermissions}
          sx={{ marginTop: 2 }}
        >
          請求權限
        </Button>
      ) : (
        <Box
          sx={{
            width: "100%",
            maxWidth: 300,
            padding: 2,
            borderRadius: 2,
            bgcolor: "rgba(255, 255, 255, 0.1)",
            textAlign: "center",
          }}
        >
          <Typography variant="body2">
            麥克風和攝像頭已就緒，準備開始回答
          </Typography>
        </Box>
      )}

      {/* 預覽音頻波形 */}
      <RealTimeAudioVisualizer isRecording={false} />
    </Box>
  );
}
