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
  IconButton,
  Radio,
  FormControlLabel,
  FormControl,
  FormLabel,
  RadioGroup,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Alert,
  Snackbar,
} from "@mui/material";
import {
  Analytics,
  DocumentScanner,
  VideoCall,
  VolumeUp,
  Description,
  AccessTime,
  Person,
  InfoOutline,
  DateRange,
  ExpandMore,
  KeyboardBackspace,
  Check,
  Cancel,
  Phone,
  Email,
  Work,
} from "@mui/icons-material";
import CircleProgress from "@/components/common/manage/CircleProgress";
import Layout from "@/components/Layout/ManageLayout";
import Image from "next/image";
import pic from "@/public/image/pic.jpg";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import InterviewAPI from "@/lib/api/InterviewAPI";
import { IntervieweeTypes } from "@/lib/types/intervieweeTypes";
import { useForm } from "react-hook-form";

export default function IntervieweeDetail() {
  const router = useRouter();
  const { id } = router.query;
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [passed, setPassed] = useState('');
  const [interviewTime, setInterviewTime] = useState<Dayjs | null>(null);
  const [answerList, setAnswerList] = useState<any[]>([]);
  const [rejectionReason, setRejectionReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const aiReportRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const [intervieweeData, setIntervieweeData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    interviewDate: '',
    interviewTime: '',
    interview_result: '',
    resumeUrl: '#',
    scores: {
      overall: 0,
      language: 0,
      attitude: 0,
      technical: 0,
      teamwork: 0,
    },
    comments: {
      overall: '',
      language: '',
      attitude: '',
      technical: '',
      teamwork: '',
    }
  });

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

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await InterviewAPI.getRecord(Number(id));

      if (!response.data) return;
      const data = response.data as IntervieweeTypes;

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
          language: '候選人在回答問題時表達清晰，邏輯性強，能夠準確傳達自己的想法。',
          attitude: '展現出積極的學習態度和對工作的熱忱，願意接受挑戰。',
          technical: '具備紮實的技術基礎，對新技術有一定的了解和學習能力。',
          teamwork: '具有良好的溝通協調能力，能與團隊成員有效配合。',
        }
      });
    } catch (error) {
      console.error('獲取數據失敗:', error);
      setSnackbar({ open: true, message: '獲取數據失敗', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const fetchAnswers = async () => {
    try {
      setLoading(true);
      const response = await InterviewAPI.getAnswers(Number(id));
      setAnswerList(response.data || []);
    } catch (error) {
      console.error('獲取答案失敗:', error);
      setSnackbar({ open: true, message: '獲取答案失敗', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (router.isReady && id) {
      fetchData();
      fetchAnswers();
    }
  }, [id]);

  const handleTabChange = (event: any, newValue: any) => {
    setTabValue(newValue);
  };

  const handleExportAIReport = async () => {
    if (!aiReportRef.current) return;

    try {
      const canvas = await html2canvas(aiReportRef.current, {
        scale: 2,
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`AI面試分析報告_${intervieweeData.name}.pdf`);

      setSnackbar({ open: true, message: 'PDF 導出成功', severity: 'success' });
    } catch (error) {
      console.error('導出PDF失敗:', error);
      setSnackbar({ open: true, message: 'PDF 導出失敗', severity: 'error' });
    }
  };

  const handleSubmitResult = async () => {
    if (!passed) {
      setSnackbar({ open: true, message: '請選擇面試結果', severity: 'error' });
      return;
    }

    if (passed === '通過' && (!interviewTime)) {
      setSnackbar({ open: true, message: '通過面試需要設定下次面試時間和方式', severity: 'error' });
      return;
    }

    try {
      setLoading(true);

      await InterviewAPI.result(Number(id), {
        interview_result: passed,
        interview_datetime: interviewTime ? interviewTime.toISOString() : '',
        reason: rejectionReason,
      });

      setSnackbar({
        open: true,
        message: `面試結果已${passed === '通過' ? '通過' : '未通過'}`,
        severity: 'success'
      });

    } catch (error) {
      setSnackbar({ open: true, message: '提交失敗', severity: 'error' });
    } finally {
      setLoading(false);
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
        {/* Header with back button */}
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
          <Chip
            label={`綜合評分: ${intervieweeData.scores.overall}`}
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
        </Box>

        <Grid container sx={{ display: "grid", gap: "1rem" }}>
          {/* 應徵者資訊 */}
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
                {/* 資訊區 - 左邊 */}
                <Grid sx={{ display: "flex", alignItems: "center" }}>
                  <Box>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="h6" fontWeight="bold">
                        {intervieweeData.name || '載入中...'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {intervieweeData.position}
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
                        <Typography variant="body2">{intervieweeData.email}</Typography>
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
                        <Typography variant="body2">{intervieweeData.phone}</Typography>
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
                          {intervieweeData.position}
                        </Typography>
                      </Box>
                    </Stack>

                    {/* <Button
                      variant="outlined"
                      fullWidth
                      href={intervieweeData.resumeUrl}
                      target="_blank"
                      startIcon={<Description />}
                      sx={{
                        borderRadius: 2,
                        textTransform: "none",
                      }}
                    >
                      查看履歷
                    </Button> */}
                  </Box>
                </Grid>

                {/* 分隔線 */}
                <Divider orientation="vertical" flexItem />

                {/* 面試排程區 - 右邊 */}
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
                      {intervieweeData.interviewDate || '未設定'}
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
                      {intervieweeData.interviewTime || '未設定'}
                    </Typography>
                  </Box>

                  <Chip
                    label={intervieweeData.interview_result}
                    color={intervieweeData.interview_result === '已面試' ? 'success' : 'default'}
                    size="small"
                    variant="outlined"
                    sx={{ borderRadius: 1 }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {(intervieweeData.interview_result !== "尚未面試") ? (
            <>
              {/* AI 面試分析報告 */}
              <div ref={aiReportRef}>
                <Grid>
                  {/* AI Analysis Tabs */}
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
                              score={intervieweeData.scores.overall}
                              label="總體評分"
                              color={theme.palette.primary.main}
                              size={160}
                            />
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Typography
                              variant="h6"
                              sx={{ mb: 2, fontWeight: 'medium' }}
                            >
                              總體評價
                            </Typography>
                            <Typography
                              variant="body1"
                              sx={{ lineHeight: 1.6 }}
                            >
                              {intervieweeData.comments.overall || '該應徵者在面試中表現良好，展現出積極的態度和良好的溝通能力。技術能力符合職位要求，具備團隊合作精神。建議進入下一輪面試。'}
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
                                        intervieweeData.scores[
                                        item.key as keyof typeof intervieweeData.scores
                                        ]
                                      }
                                      /100
                                    </Typography>
                                  </Box>
                                  <LinearProgress
                                    variant="determinate"
                                    value={
                                      intervieweeData.scores[
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
                                    intervieweeData.comments[
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

                          {/* 面試者回答 */}
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
                                  lineHeight: 1,
                                  color: theme.palette.text.primary
                                }}
                              >
                                {item.answer_text}
                              </Typography>
                            </Paper>
                          </Box>

                          {/* AI評論 */}
                          <Box>
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
                              AI 評論與建議
                            </Typography>
                            <Paper
                              elevation={0}
                              sx={{
                                p: 2.5,
                                bgcolor: theme.palette.success.light + '08',
                                borderRadius: 2,
                                border: `1px solid ${theme.palette.success.light}`,
                                borderLeft: `4px solid ${theme.palette.success.main}`,
                              }}
                            >
                              <Typography
                                variant="body1"
                                sx={{
                                  lineHeight: 1,
                                  color: theme.palette.text.primary
                                }}
                              >
                                {item.ai_comments}
                              </Typography>
                            </Paper>
                          </Box>
                        </Card>
                      ))}

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

                    {/* Action Buttons */}
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
                        disabled={loading}
                        sx={{ height: 40 }}
                      >
                        取消
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmitResult}
                        disabled={loading || !passed}
                        sx={{ height: 40 }}
                      >
                        {loading ? '處理中...' : '確認送出'}
                      </Button>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
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

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ open: false, message: '', severity: 'success' })}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert
            onClose={() => setSnackbar({ open: false, message: '', severity: 'success' })}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Layout>
  );
}