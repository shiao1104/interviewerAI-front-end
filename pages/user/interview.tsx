// Interview.tsx - 整合實時音頻可視化和自動錄影的面試頁面
import { useState, useEffect, useRef } from "react";
import styles from "@/styles/pages/user/Interview.module.scss";
import {
  Typography,
  Button,
  Paper,
  Box,
  LinearProgress,
  Chip,
} from "@mui/material";
import {
  ExitToAppOutlined,
  PlayArrowOutlined,
  TimerOutlined,
} from "@mui/icons-material";
import { mockInterviewQuestions } from "@/lib/data/testData";

// 導入拆分後的組件
import {
  StartInterviewDialog,
  EndInterviewDialog,
  NotificationSnackbar,
  PermissionCheckingBackdrop,
} from "@/components/common/user";

// 導入音頻可視化相關組件
import { RecordingIndicator } from "@/components/common/user/RecordingIndicator";
import { NonRecordingUI } from "@/components/common/user/NonRecordingUI";
import VideoRecorder, {
  VideoRecorderRef,
} from "@/components/common/user/VideoRecorder";
import QuestionAPI from "@/lib/api/QuestionAPI";
import QuestionTempAPI from "@/lib/api/QuestionTempAPI";
import AnalyzeAPI from "@/lib/api/AnalyzeAPI";

export default function Interview() {
  const [isClient, setIsClient] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [completedQuestions, setCompletedQuestions] = useState<number[]>([]);
  const [showEndDialog, setShowEndDialog] = useState(false);
  const [isInterviewComplete, setIsInterviewComplete] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "info" as "info" | "error" | "success" | "warning",
  });

  // 面試狀態
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [showStartDialog, setShowStartDialog] = useState(true);
  const [mediaPermissions, setMediaPermissions] = useState({
    camera: false,
    microphone: false,
    checking: false,
  });

  // 準備時間相關狀態
  const [isPreparing, setIsPreparing] = useState(false);
  const [prepTimeLeft, setPrepTimeLeft] = useState(60); // 1分鐘 = 60秒

  // 使用 NodeJS.Timeout 類型的計時器引用
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const prepTimerRef = useRef<NodeJS.Timeout | null>(null);
  const nextQuestionTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 錄影相關
  const recorderRef = useRef<VideoRecorderRef>(null);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      const response = await QuestionAPI.getRandom(1);
      console.log(response);
    }

    fetch();
  }, []);

  const fetchQuestion = async () => {
    try {
      const response = await QuestionTempAPI.getNextQuestion(1);
      console.log("獲取到的問題:", response);
    } catch (error) {
      console.error("無法獲取問題:", error);
    }
  };

  useEffect(() => {
    fetchQuestion();
  }, []);

  // 初始化客戶端渲染
  useEffect(() => {
    setIsClient(true);

    // 組件卸載時清除所有計時器
    return () => {
      clearAllTimers();
    };
  }, []);

  // 清除所有計時器的輔助函數
  const clearAllTimers = () => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (prepTimerRef.current !== null) {
      clearInterval(prepTimerRef.current);
      prepTimerRef.current = null;
    }
    if (nextQuestionTimerRef.current !== null) {
      clearTimeout(nextQuestionTimerRef.current);
      nextQuestionTimerRef.current = null;
    }
  };

  // 當前題目
  const currentQuestion = mockInterviewQuestions[currentQuestionIndex];

  // 開始錄影函數
  const handleStartRecording = () => {
    if (recorderRef.current) {
      recorderRef.current.startRecording();
      setIsRecording(true);
    }
  };

  // 停止錄影函數
  const handleStopRecording = () => {
    if (recorderRef.current) {
      recorderRef.current.stopRecording();
      setIsRecording(false);
    }
  };

  const uploadVideo = async (formData: FormData) => {
    try {
      const response = await AnalyzeAPI.uploadMedia(formData);
    } catch (error) {
      console.error("上傳錯誤:", error);
    }
  };

  const handleRecordingComplete = async (blobs: Blob[]) => {
    const formData = new FormData();
    formData.append('interview_id', '1');
    formData.append('question_id', '9');

    const videoBlob = new Blob(blobs, { type: 'video/webm' });
    const audioBlob = new Blob(blobs, { type: 'audio/mp3' });

    formData.append('audio_file', videoBlob, 'interview_video.webm');
    formData.append('video_file', audioBlob, 'interview_video.mp3');

    await uploadVideo(formData);
  };

  // 檢查媒體權限
  const checkMediaPermissions = async () => {
    setMediaPermissions((prev) => ({ ...prev, checking: true }));

    try {
      // 只檢查權限，不實際啟動媒體設備
      await navigator.mediaDevices
        .getUserMedia({
          video: true,
          audio: true,
        })
        .then((stream) => {
          // 立即停止所有軌道，不保留流
          stream.getTracks().forEach((track) => track.stop());

          setMediaPermissions({
            camera: true,
            microphone: true,
            checking: false,
          });
        });

      return true;
    } catch (error) {
      console.error("無法取得媒體權限:", error);
      setMediaPermissions({
        camera: false,
        microphone: false,
        checking: false,
      });

      showNotification("無法取得攝像頭或麥克風權限，請確保已授予權限", "error");
      return false;
    }
  };

  // 開始面試
  const startInterview = async () => {
    const hasPermissions = await checkMediaPermissions();

    if (hasPermissions) {
      setIsInterviewStarted(true);
      setShowStartDialog(false);

      // 開始準備時間
      startPreparationTime();

      // 啟動攝像頭預覽
      if (recorderRef.current) {
        recorderRef.current.startPreview();
      }

      showNotification("面試已開始，您有1分鐘準備時間", "success");
    } else {
      showNotification("請先允許攝像頭和麥克風權限才能開始面試", "error");
    }
  };

  // 開始準備時間
  const startPreparationTime = () => {
    // 先清除任何現有的計時器
    clearAllTimers();

    // 重置準備狀態
    setIsPreparing(true);
    setIsRecording(false);
    setPrepTimeLeft(60); // 重置為60秒

    // 開始準備計時
    prepTimerRef.current = setInterval(() => {
      setPrepTimeLeft((prev) => {
        if (prev <= 1) {
          if (prepTimerRef.current !== null) {
            clearInterval(prepTimerRef.current);
            prepTimerRef.current = null;
          }
          finishPreparation();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // 結束準備時間，自動開始錄影和回答
  const finishPreparation = () => {
    // 確保準備計時器已被清除
    if (prepTimerRef.current !== null) {
      clearInterval(prepTimerRef.current);
      prepTimerRef.current = null;
    }

    setIsPreparing(false);

    // 自動開始錄影和回答
    handleStartRecording(); // 開始錄影
    startAnswering();

    showNotification("準備時間結束，開始回答", "info");
  };

  // 開始回答問題
  const startAnswering = () => {
    // 檢查是否有權限
    if (!mediaPermissions.camera || !mediaPermissions.microphone) {
      showNotification("請先允許攝像頭和麥克風權限才能開始回答", "error");
      checkMediaPermissions();
      return;
    }

    // 清除任何可能存在的計時器
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setTimeLeft(currentQuestion.timeLimit);

    // 開始計時
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current !== null) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          finishAnswer();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    showNotification("開始計時回答", "info");
  };

  // 結束回答並自動停止錄影
  const finishAnswer = () => {
    // 確保回答計時器已被清除
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // 自動停止錄影
    handleStopRecording();

    setCompletedQuestions((prev) => [...prev, currentQuestion.id]);
    showNotification("回答已完成並儲存", "success");

    // 自動進入下一題
    nextQuestionTimerRef.current = setTimeout(() => {
      if (currentQuestionIndex < mockInterviewQuestions.length - 1) {
        // 移動到下一個問題
        setCurrentQuestionIndex((prev) => prev + 1);

        // 開始下一題的準備時間
        startPreparationTime();
        showNotification("已進入下一題，您有1分鐘準備時間", "info");
      } else {
        setIsInterviewComplete(true);
        setShowEndDialog(true);
      }

      // 清除 next question 計時器引用
      nextQuestionTimerRef.current = null;
    }, 1000); // 延遲1秒後自動進入下一題
  };

  // 顯示通知
  const showNotification = (
    message: string,
    severity: "info" | "error" | "success" | "warning"
  ) => {
    setNotification({
      open: true,
      message,
      severity,
    });
  };

  // 關閉通知
  const handleCloseNotification = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  // 格式化秒數為時間格式
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // 計算面試進度百分比
  const progressPercentage =
    (completedQuestions.length / mockInterviewQuestions.length) * 100;

  // 確認退出面試
  const handleConfirmExit = () => {
    // 停止錄影（如果正在錄影）
    if (isRecording) {
      handleStopRecording();
    }

    // 停止預覽
    if (recorderRef.current) {
      recorderRef.current.stopPreview();
    }

    // 清除所有計時器
    clearAllTimers();

    // 實作退出面試功能
    window.location.href = "/user"; // 假設退出後返回儀表板
  };

  if (!isClient) {
    return <div className={styles.loadingContainer}>載入中...</div>;
  }

  return (
    <section className={styles.container}>
      {/* 使用拆分後的彈跳視窗組件 */}
      <StartInterviewDialog
        open={showStartDialog}
        mediaPermissions={mediaPermissions}
        totalQuestions={mockInterviewQuestions.length}
        onCheckPermissions={checkMediaPermissions}
        onStartInterview={startInterview}
      />

      <Box className={styles.header}>
        <Typography variant="h4" className={styles.title}>
          面試公司: 科技未來有限公司
        </Typography>
        <Typography variant="subtitle1" className={styles.subtitle}>
          面試職位: 資深前端工程師
        </Typography>

        <Box className={styles.progressSection}>
          <Box
            display="flex"
            justifyContent="space-between"
            width="100%"
            mb={1}
          >
            <Typography variant="body2" color="white">
              問題 {currentQuestionIndex + 1}/{mockInterviewQuestions.length}
            </Typography>
            <Typography variant="body2" color="white">
              進度: {Math.round(progressPercentage)}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progressPercentage}
            className={styles.progressBar}
          />
        </Box>
      </Box>

      <Box className={styles.mainContent}>
        <Box className={styles.leftPanel}>
          {/* 題目卡片，用遮罩遮擋 */}
          <Paper elevation={3} className={styles.questionCard}>
            {!isInterviewStarted ? (
              <Box className={styles.questionMask}>
                <Typography variant="h6" align="center">
                  請點擊「開始面試」按鈕以查看第一個問題
                </Typography>
              </Box>
            ) : (
              <>
                <Box className={styles.questionHeader}>
                  <Chip
                    label={currentQuestion.category}
                    color="primary"
                    size="small"
                    className={styles.categoryChip}
                  />
                  <Chip
                    label={`時間限制: ${formatTime(currentQuestion.timeLimit)}`}
                    color="secondary"
                    size="small"
                    variant="outlined"
                  />
                  {isPreparing && (
                    <Chip
                      label={`準備時間: ${formatTime(prepTimeLeft)}`}
                      color="info"
                      size="small"
                      className={styles.prepTimeChip}
                    />
                  )}
                </Box>

                <Typography variant="h6" className={styles.questionTitle}>
                  問題 {currentQuestionIndex + 1}:
                </Typography>

                <Typography variant="body1" className={styles.questionText}>
                  {currentQuestion.question}
                </Typography>

                <Box className={styles.timerBox}>
                  {isPreparing ? (
                    <>
                      <Typography variant="h6" color="info.main">
                        準備時間剩餘: {formatTime(prepTimeLeft)}
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={(prepTimeLeft / 60) * 100}
                        color="info"
                        className={styles.timerProgress}
                      />
                    </>
                  ) : (
                    <>
                      <Typography
                        variant="h6"
                        color={timeLeft < 30 ? "error" : "primary"}
                      >
                        回答時間剩餘: {formatTime(timeLeft)}
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={(timeLeft / currentQuestion.timeLimit) * 100}
                        color={timeLeft < 30 ? "error" : "primary"}
                        className={styles.timerProgress}
                      />
                    </>
                  )}
                </Box>
              </>
            )}
          </Paper>

          <Box className={styles.buttonContainer}>
            {!isInterviewStarted ? (
              <Button
                variant="contained"
                color="primary"
                startIcon={<PlayArrowOutlined />}
                onClick={startInterview}
                className={styles.actionButton}
                fullWidth
              >
                開始面試
              </Button>
            ) : isPreparing ? (
              <Button
                variant="contained"
                color="info"
                startIcon={<TimerOutlined />}
                onClick={finishPreparation}
                className={styles.actionButton}
                fullWidth
              >
                跳過準備時間
              </Button>
            ) : !isRecording ? (
              <Button
                variant="contained"
                color="primary"
                startIcon={<PlayArrowOutlined />}
                onClick={startAnswering}
                disabled={
                  completedQuestions.includes(currentQuestion.id) ||
                  !mediaPermissions.camera ||
                  !mediaPermissions.microphone
                }
                className={styles.actionButton}
                fullWidth
              >
                {completedQuestions.includes(currentQuestion.id)
                  ? "已回答"
                  : "開始回答"}
              </Button>
            ) : (
              <Button
                variant="contained"
                color="error"
                onClick={finishAnswer}
                className={styles.actionButton}
                fullWidth
              >
                {">  "}下一題
              </Button>
            )}

            <Button
              variant="outlined"
              color="inherit"
              startIcon={<ExitToAppOutlined />}
              onClick={() => setShowEndDialog(true)}
              className={styles.exitButton}
              fullWidth
            >
              退出面試
            </Button>
          </Box>
        </Box>

        <Box className={styles.videoRecorderContainer}>
          {/* 影片錄製元件 - 使用鏡像反轉並調整比例 */}
          <VideoRecorder
            ref={recorderRef}
            onRecordingComplete={handleRecordingComplete}
            width="100%"
            height="auto" // 設為 auto 讓它根據比例自動調整
            autoStartPreview={false} // 不自動開始，而是在開始面試時手動啟動
            mirrored={true} // 啟用鏡像反轉
            aspectRatio="16:9" // 使用 16:9 的寬高比例
          />

          {/* 錄製狀態指示器 */}
          <Box className={styles.recordingStatusOverlay}>
            {isRecording ? (
              <RecordingIndicator
                isRecording={isRecording}
                timeLeft={timeLeft}
                formatTime={formatTime}
              />
            ) : (
              <NonRecordingUI
                isInterviewStarted={isInterviewStarted}
                isPreparing={isPreparing}
                prepTimeLeft={prepTimeLeft}
                formatTime={formatTime}
                mediaPermissions={{
                  camera: mediaPermissions.camera,
                  microphone: mediaPermissions.microphone,
                }}
                onCheckPermissions={checkMediaPermissions}
              />
            )}
          </Box>
        </Box>
      </Box>

      {/* 使用拆分後的彈跳視窗組件 */}
      <EndInterviewDialog
        open={showEndDialog}
        isComplete={isInterviewComplete}
        onClose={() => setShowEndDialog(false)}
        onConfirm={handleConfirmExit}
      />

      {/* 使用拆分後的通知和遮罩組件 */}
      <PermissionCheckingBackdrop open={mediaPermissions.checking} />

      <NotificationSnackbar
        open={notification.open}
        message={notification.message}
        severity={notification.severity}
        onClose={handleCloseNotification}
      />
    </section>
  );
}
