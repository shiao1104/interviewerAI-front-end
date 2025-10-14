// Interview.tsx - 整合實時音頻可視化和自動錄影的面試頁面
import { useState, useEffect, useRef } from "react";
import styles from "@/styles/pages/user/Interview.module.scss";
import {
  Typography,
  Button,
  Paper,
  Box,
  Chip,
  Grid,
  Stack,
} from "@mui/material";
import {
  ExitToAppOutlined,
  TimerOutlined,
} from "@mui/icons-material";
import { mockInterviewQuestions } from "@/lib/data/testData";

// 導入拆分後的組件
import {
  StartInterviewDialog,
  PermissionCheckingBackdrop,
} from "@/components/common/user";

// 導入音頻可視化相關組件
import { RecordingIndicator } from "@/components/common/user/RecordingIndicator";
import { NonRecordingUI } from "@/components/common/user/NonRecordingUI";
import VideoRecorder, {
  VideoRecorderRef,
} from "@/components/common/user/VideoRecorder";
import QuestionTempAPI from "@/lib/api/QuestionTempAPI";
import AnalyzeAPI from "@/lib/api/AnalyzeAPI";
import CountdownTimer from "@/lib/hook/countdownTimer";
import Swal from "sweetalert2";
import { useRouter } from "next/router";

interface Question {
  question_id: number;
  time_allowed: number;
  question_type: string;
  question_content: string;
}

export default function Interview() {
  const router = useRouter();
  const [question, setQuestion] = useState<Question | null>(null);

  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [showStartDialog, setShowStartDialog] = useState(true);
  const [mediaPermissions, setMediaPermissions] = useState({
    camera: false,
    microphone: false,
    checking: false,
  });

  const [isPreparing, setIsPreparing] = useState(false);
  const [questionNo, setQuestionNo] = useState(1);
  const [canSkip, setCanSkip] = useState<boolean>(false);
  const [companyName, setCompanyName] = useState('');
  const [openingName, setOpeningName] = useState('');
  const [interviewId, setInterviewId] = useState<number>();

  const recorderRef = useRef<VideoRecorderRef>(null);

  const fetchQuestion = async () => {
    try {
      const response = await QuestionTempAPI.getNextQuestion(interviewId ?? 0);
      if (response?.data && response.data as Question) {
        const questionData = response.data as Question;
        setQuestion(questionData);
        console.log(questionData.question_type)
      } else {
        Swal.fire({
          title: "面試結束",
          text: "所有問題已完成，感謝您的參與！",
          icon: "success",
          confirmButtonText: "確定"
        }).then(() => router.push('/user'))
      }
    } catch (error) {
      Swal.fire({
        title: "面試結束",
        text: "所有問題已完成，感謝您的參與！",
        icon: "success",
        confirmButtonText: "確定"
      }).then(() => router.push('/user'))
    }
  };

  useEffect(() => {
    setInterviewId(Number(sessionStorage.getItem('interview_id')))
    if (interviewId) {
      fetchQuestion();
      setCompanyName(sessionStorage.getItem('company_name') || '');
      setOpeningName(sessionStorage.getItem('opening_name') || '');
    }
  }, [interviewId]);

  const finishAnswer = async () => {
    if (recorderRef.current) {
      recorderRef.current.stopRecording();
    }

    await fetchQuestion();

    setIsPreparing(true);
    setQuestionNo((prev) => prev + 1);
  };

  const finishPreparation = () => {
    setIsPreparing(false);

    if (recorderRef.current) {
      recorderRef.current.startRecording();
    }
  }

  const handleRecordingComplete = async (blobs: Blob[]) => {
    if (!question?.question_id || !Array.isArray(blobs) || blobs.length === 0) return;

    const formData = new FormData();
    formData.append('interview_id', interviewId?.toString() ?? '');
    formData.append('question_id', question.question_id.toString());
    const videoBlob = new Blob(blobs, { type: 'video/webm' });
    const audioBlob = new Blob(blobs, { type: 'audio/webm' });

    formData.append('video_file', videoBlob, `question_${question.question_id}_video.webm`);
    formData.append('audio_file', audioBlob, `question_${question.question_id}_audio.webm`);

    try {
      console.log("Uploading recording for question ID:", question.question_id);
      await AnalyzeAPI.uploadMedia(formData);
    } catch (error) {
      console.error('Recording upload failed:', error);
    }
  };

  const checkMediaPermissions = async () => {
    setMediaPermissions((prev) => ({ ...prev, checking: true }));

    try {
      await navigator.mediaDevices
        .getUserMedia({
          video: true,
          audio: true,
        })
        .then((stream) => {
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

      return false;
    }
  };

  const startInterview = async () => {
    const hasPermissions = await checkMediaPermissions();
    setIsPreparing(true);

    if (hasPermissions) {
      setIsInterviewStarted(true);
      setShowStartDialog(false);

      setIsPreparing(true);

      if (recorderRef.current) {
        recorderRef.current.startPreview();
      }
    }
  };

  const exitInterview = () => {
    Swal.fire({
      title: "退出面試",
      text: "退出後即無法加入，確定要退出嗎？",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "是的，退出面試",
      cancelButtonText: "取消"
    }).then((result) => {
      if (result.isConfirmed) {
        router.push('/user');
      }
    });
  }

  return (
    <section className={styles.container}>
      <StartInterviewDialog
        open={showStartDialog}
        mediaPermissions={mediaPermissions}
        totalQuestions={mockInterviewQuestions.length}
        onCheckPermissions={checkMediaPermissions}
        onStartInterview={startInterview}
      />

      <Box className={styles.header}>
        <Typography variant="h4" className={styles.title}>
          面試公司: {companyName}
        </Typography>
        <Typography variant="subtitle1" className={styles.subtitle}>
          面試職位: {openingName}
        </Typography>
      </Box>

      <Box className={styles.mainContent}>
        <Box className={styles.leftPanel}>
          <Paper
            elevation={4}
            sx={{
              p: 3,
              borderRadius: 3,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: 2,
              height: "250px"
            }}
          >
            {/* Header 區塊 */}
            <Grid
              container
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h6" fontWeight="bold">
                {question ? `問題 #${questionNo}` : "載入中..."}
              </Typography>

              <Stack direction="row" spacing={1}>
                <Chip label={question?.question_type_detail.question_type} />
                <Chip
                  icon={<TimerOutlined />}
                  label={isPreparing ? "準備中" : `限時 ${question?.time_allowed} 秒`}
                  color="warning"
                  variant="outlined"
                />
                <CountdownTimer
                  key={`${question?.question_id}-${isPreparing ? "prep" : "answer"}`}
                  timeAllowed={isPreparing ? 60 : question?.time_allowed || 60}
                  onTimeUp={isPreparing ? finishPreparation : finishAnswer}
                  onCanSkip={canSkip => setCanSkip(canSkip)}
                />
              </Stack>
            </Grid>

            <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
              {question?.question}
            </Typography>

            <Stack spacing={1} mt={2}>
              {isPreparing ?
                <Button
                  variant="contained"
                  color="info"
                  startIcon={<TimerOutlined />}
                  onClick={finishPreparation}
                  fullWidth
                  disabled={!canSkip}
                >
                  跳過準備時間
                </Button>
                :
                <Button
                  variant="contained"
                  color="error"
                  onClick={finishAnswer}
                  startIcon={<ExitToAppOutlined />}
                  fullWidth
                >
                  下一題
                </Button>
              }

              <Button
                variant="outlined"
                color="error"
                startIcon={<ExitToAppOutlined />}
                fullWidth
                onClick={exitInterview}
              >
                結束面試
              </Button>
            </Stack>
          </Paper>
        </Box>


        <Box className={styles.videoRecorderContainer}>
          <VideoRecorder
            ref={recorderRef}
            onRecordingComplete={handleRecordingComplete}
            width="100%"
            height="auto"
            autoStartPreview={false}
            mirrored={true}
            aspectRatio="16:9"
          />

          <Box className={styles.recordingStatusOverlay}>
            {!isPreparing ? (
              <RecordingIndicator />
            ) : (
              <NonRecordingUI
                isInterviewStarted={isInterviewStarted}
                isPreparing={isPreparing}
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

      <PermissionCheckingBackdrop open={mediaPermissions.checking} />
    </section>
  );
}
