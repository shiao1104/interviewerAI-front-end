import React from "react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Chip,
  Stack,
  Divider,
  useTheme,
  LinearProgress,
  Tab,
  Tabs,
  Paper,
  Radio,
  FormControlLabel,
  FormControl,
  RadioGroup,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  alpha,
  Link,
} from "@mui/material";
import {
  Description,
  AccessTime,
  InfoOutline,
  DateRange,
  ExpandMore,
  KeyboardBackspace,
  Phone,
  Email,
  Work,
  Edit,
} from "@mui/icons-material";
import CircleProgress from "@/components/common/manage/CircleProgress";
import Layout from "@/components/Layout/ManageLayout";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";
import { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import InterviewAPI from "@/lib/api/InterviewAPI";
import Swal from "sweetalert2";
import { useLoading } from "@/lib/hook/loading";
import { toast } from "react-toastify";
import { InfoTypes } from "@/lib/types/questionsTypes";
import MediaAPI from "@/lib/api/MediaAPI";

export default function IntervieweeDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { showLoading, hideLoading } = useLoading();
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [passed, setPassed] = useState('');
  const [interviewTime, setInterviewTime] = useState<Dayjs | null>(null);
  const [answerList, setAnswerList] = useState<any[]>([]);
  const [rejectionReason, setRejectionReason] = useState('');
  const aiReportRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isInterviewing, setIsInterviewing] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [quesId, setQuesId] = useState(0);

  const [intervieweeData, setIntervieweeData] = useState<InfoTypes>();

  const scoreItems = [
    {
      key: "language",
      title: "語言表達力",
      label: "表達能力",
      color: theme.palette.success.main,
    },
    {
      key: "attitude",
      title: "積極度分析",
      label: "積極度",
      color: theme.palette.info.main,
    },
    {
      key: "technical",
      title: "技術能力預測",
      label: "技術能力",
      color: theme.palette.warning.main,
    },
    {
      key: "teamwork",
      title: "團隊合作",
      label: "合作能力",
      color: theme.palette.primary.main,
    },
  ];

  const getCommentByScore = (score: number, type: string) => {
    if (score <= 25) {
      switch (type) {
        case 'language':
          return '面試表達不夠清晰，需要加強溝通能力，較難準確傳達想法。';
        case 'attitude':
          return '對工作熱忱和學習意願表現不足，較被動且缺乏主動性。';
        case 'technical':
          return '技術基礎較弱，對相關技術了解有限，需要大量培訓。';
        case 'teamwork':
          return '團隊合作意識薄弱，溝通協調能力需要提升。';
        default:
          return '';
      }
    } else if (score <= 50) {
      switch (type) {
        case 'language':
          return '表達尚可但不夠流暢，邏輯性時有不足，可再加強。';
        case 'attitude':
          return '展現基本工作熱忱，但主動性和積極性有待提升。';
        case 'technical':
          return '具備基本技術知識，但深度和廣度都需要加強。';
        case 'teamwork':
          return '基本具備團隊合作意識，但溝通效果仍有改進空間。';
        default:
          return '';
      }
    } else if (score <= 75) {
      switch (type) {
        case 'language':
          return '表達大致清晰流暢，能較好地傳達自己的想法。';
        case 'attitude':
          return '展現較好的學習態度和工作熱忱，具有一定主動性。';
        case 'technical':
          return '技術基礎紮實，對相關領域有不錯的理解。';
        case 'teamwork':
          return '展現良好的團隊合作精神，溝通協調能力不錯。';
        default:
          return '';
      }
    } else {
      switch (type) {
        case 'language':
          return '表達非常清晰流暢，邏輯性強，能準確有效地傳達想法。';
        case 'attitude':
          return '展現高度積極性和主動性，對工作充滿熱忱，樂於接受挑戰。';
        case 'technical':
          return '技術能力優秀，知識面廣泛，具備獨立解決問題的能力。';
        case 'teamwork':
          return '極具團隊合作精神，溝通協調能力強，能有效促進團隊協作。';
        default:
          return '';
      }
    }
  };

  const fetchData = async () => {
    showLoading();

    try {
      const response = await InterviewAPI.getRepert(Number(id));
      setAnswerList(response.data ? response.data.answers : []);
      if (!response.data) return;
      const data = response.data.interview_info as InfoTypes;

      let interviewDate = '';
      let interviewTime = '';
      if (data.interview_datetime) {
        const datetime = new Date(data.interview_datetime);
        interviewDate = datetime.toISOString().split('T')[0];
        interviewTime = datetime.toTimeString().slice(0, 5);
      }

      setIntervieweeData({
        name: data.candidate_detail?.username || '',
        email: data.candidate_detail?.email || '',
        phone: data.candidate_detail?.phone_number || '',
        position: data.opening_detail?.opening_name || '',
        interviewDate,
        interviewTime,
        interview_result: data.interview_result,
        interview_status: data.interview_status || '',
        resumeUrl: '#',
        scores: {
          overall: data.total_score || 0,
          language: data.score_expression || 0,
          attitude: data.score_attitude || 0,
          technical: data.score_technical || 0,
          teamwork: data.score_collaboration || 0,
        },
        comments: {
          overall: data.result_abstract || '',
          language: getCommentByScore(data.score_expression || 0, 'language'),
          attitude: getCommentByScore(data.score_attitude || 0, 'attitude'),
          technical: getCommentByScore(data.score_technical || 0, 'technical'),
          teamwork: getCommentByScore(data.score_collaboration || 0, 'teamwork'),
        }
      } as InfoTypes);

      setIsInterviewing((data.interview_result === "尚未面試" || data.interview_result === null) ? false : true);

    } catch (error) {
      toast.error("無法獲取回答，請稍後再試。");
    } finally {
      hideLoading();
    }
  };

  const fetchMedia = async () => {
    showLoading();
    try {
      const response = await MediaAPI.getData();
    } catch (error) {
      toast.error("無法獲取媒體檔案，請稍後再試。");
    } finally {
      hideLoading();
    }
  };

  useEffect(() => {
    if (router.isReady && id) {
      fetchData();
      fetchMedia();
    }
  }, [id]);

  const handleTabChange = (event: any, newValue: any) => {
    setTabValue(newValue);
  };

  const [editScore, setEditScore] = useState(intervieweeData?.scores.overall);
  const [editComment, setEditComment] = useState(intervieweeData?.comments.overall);

  const handleSave = async () => {
    showLoading();

    try {
      await InterviewAPI.updateScore(Number(id), quesId, { human_score: Number(editScore), human_comments: String(editComment) });
      await fetchData();

      Swal.fire({
        icon: 'success',
        title: '更新成功',
        showConfirmButton: false,
        timer: 1500
      });
      setIsEdit(false);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: '更新失敗',
        text: '請稍後再試'
      });
    } finally {
      hideLoading();
    }
  };

  const handleExportAIReport = async () => {
    showLoading();
    if (!aiReportRef.current) return;
    setIsExpanded(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 100));

      const canvas = await html2canvas(aiReportRef.current, {
        scale: 2,
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`面試分析報告_${intervieweeData?.name}.pdf`);
      Swal.fire({
        icon: 'success',
        title: 'PDF 導出成功',
      })
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'PDF 導出失敗',
      })
    } finally {
      hideLoading();
    }
  };

  const handleSubmitResult = async () => {
    if (!passed) {
      toast.error('請選擇面試結果');
      return;
    }

    if (passed === '通過' && (!interviewTime)) {
      toast.error('請選擇下一階段面試時間');
      return;
    }

    try {
      showLoading();

      if (passed === '未通過') {
        await InterviewAPI.result(Number(id), {
          interview_result: passed,
        });
      } else {
        await InterviewAPI.result(Number(id), {
          interview_result: passed,
          interview_datetime: interviewTime ? interviewTime.toISOString() : '',
        });
      }

      Swal.fire({
        icon: 'success',
        title: '提交成功',
        text: `面試結果已${passed === '通過' ? '通過' : '未通過'}`,
        showConfirmButton: false,
      });

    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: '提交失敗',
        text: '請稍後再試',
      });
    } finally {
      hideLoading();
    }
  };

  const handleCancel = () => {
    setPassed('');
    setInterviewTime(null);
    setRejectionReason('');
  };


  return (
    <Layout>
      <Box sx={{ maxWidth: "1200px", margin: "0 auto", p: 3 }}>
        <Button
          startIcon={<KeyboardBackspace />}
          onClick={() => router.push("/manage/interviewee")}
          sx={{ mb: 2 }}
        >
          返回列表
        </Button>

        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Typography
            variant="h4"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <InfoOutline color="primary" sx={{ fontSize: "35px" }} />
            應徵者資訊
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          {isInterviewing && (
            <Chip
              label={`綜合評分: ${intervieweeData?.scores.overall}`}
              color="primary"
              size="medium"
              sx={{
                fontWeight: "bold",
                py: 2,
                px: 1,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                "& .MuiChip-label": { px: 2 },
              }}
            />
          )}
        </Box>

        <Grid container sx={{ display: "grid", gap: "1rem" }}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
              height: "100%",
            }}
          >
            <CardContent>
              <Grid
                container
                sx={{
                  display: "grid",
                  gridTemplateColumns: "2fr auto 1fr",
                  gap: "1rem",
                }}
              >
                <Grid sx={{ display: "flex", alignItems: "center" }}>
                  <Box>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="h6" fontWeight="bold">
                        {intervieweeData?.name || '載入中...'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {intervieweeData?.position}
                      </Typography>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Stack spacing={2} sx={{ mb: 3 }}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Email
                          fontSize="small"
                          sx={{ color: "text.secondary", mr: 1 }}
                        />
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ width: "80px" }}
                        >
                          Email:
                        </Typography>
                        <Typography variant="body2">{intervieweeData?.email}</Typography>
                      </Box>

                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Phone
                          fontSize="small"
                          sx={{ color: "text.secondary", mr: 1 }}
                        />
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ width: "80px" }}
                        >
                          電話:
                        </Typography>
                        <Typography variant="body2">{intervieweeData?.phone}</Typography>
                      </Box>

                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Work
                          fontSize="small"
                          sx={{ color: "text.secondary", mr: 1 }}
                        />
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ width: "80px" }}
                        >
                          應徵職位:
                        </Typography>
                        <Typography variant="body2">
                          {intervieweeData?.position}
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                </Grid>

                <Divider orientation="vertical" flexItem />

                <Grid>
                  <Typography variant="h6" fontWeight="medium" sx={{ mb: 2 }}>
                    面試排程
                  </Typography>

                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <DateRange
                      fontSize="small"
                      sx={{ color: "text.secondary", mr: 1 }}
                    />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ width: "80px" }}
                    >
                      日期:
                    </Typography>
                    <Typography variant="body2">
                      {intervieweeData?.interviewDate || '未設定'}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <AccessTime
                      fontSize="small"
                      sx={{ color: "text.secondary", mr: 1 }}
                    />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ width: "80px" }}
                    >
                      時間:
                    </Typography>
                    <Typography variant="body2">
                      {intervieweeData?.interviewTime || '未設定'}
                    </Typography>
                  </Box>

                  <Chip
                    label={intervieweeData?.interview_result || '尚未面試'}
                    color={intervieweeData?.interview_result === null ?
                      'default' : intervieweeData?.interview_result === '待處理' ?
                        "warning" : (intervieweeData?.interview_result === "第一階段未通過" || intervieweeData?.interview_result === "第二階段未通過") ?
                          'error' : 'success'}
                    size="small"
                    variant="outlined"
                    sx={{ borderRadius: 1 }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {isInterviewing ? (
            <>
              <div ref={aiReportRef}>
                <Grid>
                  <Paper
                    elevation={0}
                    sx={{
                      borderRadius: 2,
                      border: `1px solid ${theme.palette.divider}`,
                      overflow: "hidden",
                    }}
                  >
                    <Box sx={{
                      p: 2,
                      bgcolor: theme.palette.background.paper,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <Typography variant="h6" fontWeight="medium">
                        AI 面試分析報告
                      </Typography>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={handleExportAIReport}
                        startIcon={<Description />}
                        sx={{ textTransform: 'none' }}
                      >
                        導出 PDF
                      </Button>
                    </Box>

                    <Tabs
                      value={tabValue}
                      onChange={handleTabChange}
                      sx={{
                        px: 2,
                        borderBottom: `1px solid ${theme.palette.divider}`,
                        "& .MuiTab-root": {
                          textTransform: "none",
                          minWidth: "auto",
                          px: 2,
                        },
                      }}
                    >
                      <Tab label="總評" />
                      <Tab label="詳細分析" />
                    </Tabs>

                    <Box sx={{ p: 3 }}>
                      {tabValue === 0 && (
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              mr: 4,
                            }}
                          >
                            <CircleProgress
                              score={isEdit ? Number(editScore ?? 0) : (intervieweeData?.scores.overall ?? 0)}
                              label="總體評分"
                              color={theme.palette.primary.main}
                              size={160}
                            />
                          </Box>

                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: "medium" }}>
                              總體評價
                            </Typography>

                            <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                              {intervieweeData?.comments.overall}
                            </Typography>
                          </Box>
                        </Box>
                      )}

                      {tabValue === 1 && (
                        <Grid
                          container
                          sx={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: "2rem",
                          }}
                        >
                          {scoreItems.map((item) => (
                            <Grid key={item.key}>
                              <Card
                                sx={{
                                  p: 2,
                                  borderRadius: 2,
                                  border: `1px solid ${theme.palette.divider}`,
                                }}
                              >
                                <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                                  {item.title}
                                </Typography>
                                <Box sx={{ mb: 2 }}>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      mb: 0.5,
                                    }}
                                  >
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                    >
                                      {item.label}
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      fontWeight="medium"
                                    >
                                      {
                                        intervieweeData?.scores[
                                        item.key as keyof typeof intervieweeData.scores
                                        ]
                                      }
                                      /100
                                    </Typography>
                                  </Box>
                                  <LinearProgress
                                    variant="determinate"
                                    value={
                                      intervieweeData?.scores[
                                      item.key as keyof typeof intervieweeData.scores
                                      ]
                                    }
                                    sx={{
                                      height: 8,
                                      borderRadius: 4,
                                      bgcolor: theme.palette.grey[100],
                                      "& .MuiLinearProgress-bar": {
                                        bgcolor: item.color,
                                        borderRadius: 4,
                                      },
                                    }}
                                  />
                                </Box>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{ lineHeight: 1.5 }}
                                >
                                  {
                                    intervieweeData?.comments[
                                    item.key as keyof typeof intervieweeData.comments
                                    ]
                                  }
                                </Typography>
                              </Card>
                            </Grid>
                          ))}
                        </Grid>
                      )}
                    </Box>
                  </Paper>
                </Grid>

                <Grid>
                  <Paper
                    elevation={1}
                    sx={{
                      borderRadius: 3,
                      overflow: "hidden",
                      mt: 3,
                      p: 2,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                      border: `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    <Typography variant="h6" fontWeight="medium" sx={{ mb: 3 }}>
                      問題分析
                    </Typography>

                    <Box>
                      {answerList.slice(0, isExpanded ? answerList.length : 1).map((item, index) => (
                        <Card
                          key={index}
                          elevation={0}
                          sx={{
                            mb: index === (isExpanded ? answerList.length - 1 : 0) ? 0 : 3,
                            p: 3,
                            borderRadius: 3,
                            border: `1px solid ${theme.palette.divider}`,
                            bgcolor: theme.palette.background.default,
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': {
                              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                              transform: 'translateY(-1px)',
                            }
                          }}
                        >
                          {/* 問題標題 */}
                          <Box sx={{ mb: 2.5 }}>
                            <Typography
                              variant="h6"
                              fontWeight="600"
                              sx={{
                                mb: 1,
                                color: theme.palette.primary.main,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                              }}
                            >
                              <Box
                                sx={{
                                  width: 24,
                                  height: 24,
                                  borderRadius: '50%',
                                  bgcolor: theme.palette.primary.main,
                                  color: 'white',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '0.875rem',
                                  fontWeight: 'bold'
                                }}
                              >
                                {index + 1}
                              </Box>
                              {item.question_detail.question}
                            </Typography>
                          </Box>

                          <Box sx={{ mb: 3 }}>
                            <Typography
                              variant="subtitle2"
                              fontWeight="600"
                              sx={{
                                mb: 1.5,
                                color: theme.palette.text.primary,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                              }}
                            >
                              面試者回答
                              {item.video_file_path ? <Link target="_blank" href={`http://localhost:8000/media/uploads/${item.video_file_path}`}>影片回顧</Link> : ''}
                            </Typography>
                            <Paper
                              elevation={0}
                              sx={{
                                p: 2.5,
                                bgcolor: theme.palette.background.paper,
                                borderRadius: 2,
                                border: `1px solid ${theme.palette.divider}`,
                                borderLeft: `4px solid ${theme.palette.info.main}`,
                              }}
                            >
                              <Typography
                                variant="body1"
                                sx={{
                                  color: theme.palette.text.primary
                                }}
                              >
                                {item.answer_text ? item.answer_text : '(無回答)'}
                              </Typography>
                            </Paper>
                          </Box>

                          {item.answer_text && (
                            <>

                              {/* AI評論 */}
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                                {/* AI 評論卡片 */}
                                <Box>
                                  <Typography
                                    variant="subtitle2"
                                    fontWeight="600"
                                    sx={{ mb: 1.5, color: 'text.primary' }}
                                  >
                                    AI 評分與建議
                                  </Typography>
                                  <Paper
                                    elevation={0}
                                    sx={{
                                      p: 2.5,
                                      bgcolor: alpha(theme.palette.success.main, 0.04),
                                      borderRadius: 2,
                                      border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                                      borderLeft: `4px solid ${theme.palette.success.main}`,
                                      display: 'flex',
                                      alignItems: 'center',
                                    }}
                                  >
                                    <Box
                                      sx={{
                                        minWidth: 60,
                                        height: 60,
                                        borderRadius: '50%',
                                        bgcolor: '#4caf50',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1.5rem',
                                        fontWeight: 700,
                                        color: 'white',
                                        mr: 3
                                      }}
                                    >
                                      {item.ai_score || '-'}
                                    </Box>
                                    <Typography
                                      variant="body2"
                                      sx={{
                                        lineHeight: 1.7,
                                        color: 'text.primary',
                                        whiteSpace: 'pre-wrap'
                                      }}
                                    >
                                      {item.ai_comments || '無評論'}
                                    </Typography>
                                  </Paper>
                                </Box>
                              </Box>

                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 2.5 }}>
                                <Box>
                                  <Typography
                                    variant="subtitle2"
                                    fontWeight="600"
                                    sx={{ mb: 1.5, color: 'text.primary', display: 'flex', alignItems: 'center' }}
                                  >
                                    人工評分與建議
                                    <Edit
                                      fontSize="small"
                                      sx={{
                                        ml: 2,
                                        cursor: 'pointer',
                                        color: 'text.secondary',
                                        transition: 'all 0.2s',
                                        ":hover": {
                                          color: theme.palette.primary.main,
                                          transform: 'scale(1.1)'
                                        }
                                      }}
                                      onClick={() => {
                                        setQuesId(item.question);
                                        setEditScore(item.human_score);
                                        setEditComment(item.human_comments);
                                        setIsEdit(true);
                                      }}
                                    />
                                  </Typography>
                                  <Paper
                                    elevation={0}
                                    sx={{
                                      p: 2.5,
                                      bgcolor: alpha(theme.palette.warning.main, 0.04),
                                      borderRadius: 2,
                                      border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
                                      borderLeft: `4px solid ${theme.palette.warning.main}`,
                                      display: 'flex',
                                      alignItems: 'center',
                                    }}
                                  >
                                    <Box
                                      sx={{
                                        minWidth: 60,
                                        height: 60,
                                        borderRadius: '50%',
                                        bgcolor: theme.palette.warning.main,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1.5rem',
                                        fontWeight: 700,
                                        color: 'white',
                                        mr: 3
                                      }}
                                    >
                                      {item.human_score || '-'}
                                    </Box>
                                    <Typography
                                      variant="body2"
                                      sx={{
                                        lineHeight: 1.7,
                                        color: 'text.primary',
                                        whiteSpace: 'pre-wrap'
                                      }}
                                    >
                                      {item.human_comments || '尚未評分'}
                                    </Typography>
                                  </Paper>
                                </Box>
                              </Box>
                            </>
                          )}
                        </Card>
                      ))}
                      {isEdit && (
                        <Dialog open={isEdit} onClose={() => setIsEdit(false)}>
                          <DialogTitle>編輯人工評分</DialogTitle>
                          <DialogContent>
                            <TextField
                              label="分數"
                              type="number"
                              value={editScore ?? ''}
                              onChange={(e) => setEditScore(Number(e.target.value))}
                              fullWidth
                              sx={{ mt: 2 }}
                            />
                            <TextField
                              label="評論"
                              multiline
                              rows={4}
                              value={editComment}
                              onChange={(e) => setEditComment(e.target.value)}
                              fullWidth
                              sx={{ mt: 2 }}
                            />
                          </DialogContent>
                          <DialogActions>
                            <Button onClick={() => setIsEdit(false)}>取消</Button>
                            <Button variant="contained" onClick={handleSave}>儲存</Button>
                          </DialogActions>
                        </Dialog>
                      )}


                      {/* 展開按鈕 */}
                      {answerList.length > 1 && (
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: "center",
                            mt: 3,
                            pt: 3,
                            borderTop: `1px solid ${theme.palette.divider}`
                          }}
                        >
                          <Button
                            variant="outlined"
                            endIcon={
                              <ExpandMore sx={{
                                transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                                transition: 'transform 0.2s'
                              }} />
                            }
                            onClick={() => setIsExpanded(!isExpanded)}
                            sx={{
                              borderRadius: 25,
                              px: 3,
                              py: 1,
                              textTransform: 'none',
                              fontWeight: 500,
                              transition: 'all 0.2s ease-in-out',
                              '&:hover': {
                                transform: 'translateY(-1px)',
                                boxShadow: '0 4px 8px rgba(0,0,0,0.12)'
                              }
                            }}
                          >
                            {isExpanded ? '收合問題' : '展開所有問題'}
                          </Button>
                        </Box>
                      )}
                    </Box>
                  </Paper>
                </Grid>
              </div>

              {/* 面試結果決定 */}
              {intervieweeData?.interview_status == "已完成" && intervieweeData?.interview_result === "待處理" && (

                <Grid>
                  <Paper
                    elevation={0}
                    sx={{
                      borderRadius: 3,
                      border: '1px solid #e1e8ed',
                      overflow: 'hidden',
                      bgcolor: 'white',
                      p: 3
                    }}
                  >
                    {/* Header */}
                    <Box sx={{ bgcolor: 'white' }}>
                      <Typography
                        variant="h6"
                        fontWeight={600}
                        sx={{
                          color: '#1a1f36',
                          fontSize: '18px',
                          mb: 2
                        }}
                      >
                        是否通過此次初步面試？
                      </Typography>
                    </Box>

                    {/* Content */}
                    <Box>
                      {/* Radio Selection */}
                      <FormControl component="fieldset" sx={{ mb: 3 }}>
                        <RadioGroup
                          value={passed}
                          onChange={(e) => setPassed(e.target.value)}
                          row
                          sx={{ gap: 3 }}
                        >
                          <FormControlLabel
                            value="通過"
                            control={
                              <Radio
                                sx={{
                                  color: '#1976d2',
                                  '&.Mui-checked': {
                                    color: '#1976d2',
                                  }
                                }}
                              />
                            }
                            label={
                              <Typography sx={{ fontWeight: 500, color: '#1a1f36' }}>
                                通過
                              </Typography>
                            }
                          />
                          <FormControlLabel
                            value="未通過"
                            control={
                              <Radio
                                sx={{
                                  color: '#1976d2',
                                  '&.Mui-checked': {
                                    color: '#1976d2',
                                  }
                                }}
                              />
                            }
                            label={
                              <Typography sx={{ fontWeight: 500, color: '#1a1f36' }}>
                                未通過
                              </Typography>
                            }
                          />
                        </RadioGroup>
                      </FormControl>

                      {/* Conditional Fields for "通過" */}
                      {passed === "通過" && (
                        <Box sx={{
                          bgcolor: '#f8fbff',
                          border: '1px solid #e3f2fd',
                          borderRadius: 2,
                          p: 3,
                          mb: 3
                        }}>
                          <Typography variant="subtitle2" sx={{ mb: 2, color: '#1976d2' }}>
                            請設定下次面試資訊
                          </Typography>
                          <Grid container spacing={3}>
                            <Grid>
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateTimePicker
                                  label="請選擇下次面試時間"
                                  value={interviewTime}
                                  onChange={(newValue) => setInterviewTime(newValue)}
                                  slotProps={{
                                    textField: {
                                      fullWidth: true,
                                      sx: {
                                        '& .MuiOutlinedInput-root': {
                                          borderRadius: 2,
                                          bgcolor: 'white'
                                        }
                                      }
                                    }
                                  }}
                                />
                              </LocalizationProvider>
                            </Grid>

                          </Grid>
                        </Box>
                      )}

                      {/* Rejection Reason for "No" */}
                      {passed === "未通過" && (
                        <Box sx={{
                          bgcolor: '#fef7f7',
                          border: '1px solid #fed7d7',
                          borderRadius: 2,
                          p: 3,
                          mb: 3
                        }}>
                          <TextField
                            fullWidth
                            multiline
                            rows={4}
                            label="未通過原因 (選填)"
                            placeholder="請簡述未通過面試的主要原因..."
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                bgcolor: 'white'
                              }
                            }}
                          />
                        </Box>
                      )}

                      <Box sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: 2,
                        pt: 2
                      }}>
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={handleCancel}
                          sx={{ height: 40 }}
                        >
                          取消
                        </Button>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleSubmitResult}
                          sx={{ height: 40 }}
                        >
                          確認送出
                        </Button>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              )}
            </>
          ) : (
            <Grid>
              <Paper
                elevation={0}
                sx={{
                  borderRadius: 2,
                  border: `1px solid ${theme.palette.divider}`,
                  p: 4,
                  textAlign: 'center'
                }}
              >
                <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                  面試尚未完成
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  AI 分析報告和結果決定將在面試完成後顯示
                </Typography>
              </Paper>
            </Grid>
          )}
        </Grid>
      </Box>
    </Layout>
  );
}