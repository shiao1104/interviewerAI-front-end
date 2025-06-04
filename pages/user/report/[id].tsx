import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  Box,
  Card,
  Typography,
  Grid,
  Button,
  useTheme,
  LinearProgress,
  Tab,
  Tabs,
  Paper,
  Chip,
  Divider,
} from "@mui/material";
import {
  KeyboardBackspace,
  Business,
  CalendarMonth,
  LocationOn,
  Work,
  CheckCircle,
  Cancel,
  Schedule,
  VideoCall,
  LocationCity,
  Person,
} from "@mui/icons-material";
import CircleProgress from "@/components/common/manage/CircleProgress";
import Layout from "@/components/Layout/Layout";

export default function Report() {
  const router = useRouter();
  const { id } = router.query;
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);

  // Custom theme colors to match the style in the image
  const customColors = {
    primary: "#3069d3",
    secondary: "#f5f9ff",
    blueLight: "#e8f1ff",
    blueGray: "#f7f9fc",
    text: "#445374",
    textSecondary: "#90a3bf",
    borderLight: "#eaecf0",
    success: "#22c55e",
    warning: "#f59e0b",
    error: "#ef4444",
  };

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

  // Enhanced simulated data with interview status and next interview info
  const [data] = useState({
    // 公司資訊
    companyName: "科技未來有限公司",
    companyLogo: "#",
    position: "資深前端工程師",
    jobType: "全職",
    department: "技術開發部",
    location: "台北市信義區",
    salary: "年薪 NT$ 1,200,000 - 1,500,000",

    // 面試資訊
    interviewDate: "2025-05-20",
    interviewTime: "14:30 - 15:30",
    confirmStatus: "已面試", // 已面試, 未面試, 已通過, 未通過
    interviewerName: "林經理、王主任",
    interviewRound: "第二輪",

    // 面試結果狀態
    interviewResult: "通過", // 通過, 未通過, 待定

    // 下次面試資訊
    nextInterview: {
      hasNext: true,
      date: "2025-06-05",
      time: "10:00 - 11:30",
      round: "第三輪",
      type: "實體面試", // 線上面試, 實體面試
      location: "Google Meet 線上會議室",
      interviewer: "技術總監 張先生、人資經理 陳小姐",
      meetingLink: "https://meet.google.com/abc-defg-hij",
      notes: "請準備過往專案經驗分享，預計面試時間90分鐘"
    },

    // 媒體資源
    audioUrl: "#",
    videoUrl: "#",
    transcriptUrl: "#",
    emotionAnalysisUrl: "#",

    // AI 分析結果
    scores: {
      language: 83,
      attitude: 75,
      technical: 80,
      teamwork: 78,
      overall: 85,
    },
    comments: {
      language: "應徵者展現了良好的溝通能力，用詞精準，能清晰表達技術概念。",
      attitude: "面試過程中表現自信，態度積極主動，表情自然，對問題回應迅速。",
      technical:
        "根據技術問題的回答分析，應徵者具備所需的前端開發技能，特別是在React方面表現出色。",
      teamwork: "團隊合作能力強，展現良好的溝通與協作精神，過去的團隊經驗豐富。",
      overall:
        "整體而言，高度推薦此應徵者。專業素養良好，技術能力符合職位要求，建議進入下一輪面試。",
    },
  });

  useEffect(() => {
    if (id) {
      console.log(`Loading data for interviewee ${id}`);
    }
  }, [id]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleTabChange = (event: any, newValue: any) => {
    setTabValue(newValue);
  };

  // 取得面試狀態顯示的顏色和圖標
  const getInterviewStatusDisplay = (status: string, result?: string) => {
    if (status === "已面試") {
      if (result === "通過") {
        return {
          color: customColors.success,
          icon: <CheckCircle sx={{ fontSize: 16 }} />,
          text: "面試通過"
        };
      } else if (result === "未通過") {
        return {
          color: customColors.error,
          icon: <Cancel sx={{ fontSize: 16 }} />,
          text: "面試未通過"
        };
      } else {
        return {
          color: customColors.warning,
          icon: <Schedule sx={{ fontSize: 16 }} />,
          text: "結果待定"
        };
      }
    } else {
      return {
        color: customColors.textSecondary,
        icon: <Schedule sx={{ fontSize: 16 }} />,
        text: "尚未面試"
      };
    }
  };

  const statusDisplay = getInterviewStatusDisplay(data.confirmStatus, data.interviewResult);

  return (
    <Layout>
      <Box
        sx={{
          maxWidth: "1200px",
          margin: "0 auto",
          p: 3,
          color: customColors.text,
        }}
      >
        {/* Header with back button */}
        <Button
          startIcon={<KeyboardBackspace />}
          onClick={() => router.push("/user")}
          sx={{
            color: customColors.text,
            textTransform: "none",
            fontWeight: "normal",
            mb: '1rem'
          }}
        >
          返回主畫面
        </Button>

        {/* Main Content Grid */}
        <Box sx={{ display: "grid", gap: "1.5rem" }}>
          {/* Job Information Card */}
          <Paper
            elevation={0}
            sx={{
              borderRadius: 2,
              border: `1px solid ${customColors.borderLight}`,
              overflow: "hidden",
            }}
          >
            <Box sx={{ p: 2, bgcolor: customColors.blueGray }}>
              <Typography variant="h6" fontWeight="500" color={customColors.text}>
                職缺資訊
              </Typography>
            </Box>
            <Box sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: "flex", mb: 2 }}>
                    <Business sx={{ color: customColors.primary, mr: 1 }} />
                    <Typography variant="body1" fontWeight="medium" color={customColors.text}>
                      {data.companyName}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color={customColors.textSecondary} sx={{ ml: 4, mb: 1 }}>
                    <Work sx={{ fontSize: 16, mr: 0.5, verticalAlign: "text-bottom" }} />
                    職位：{data.position}
                  </Typography>
                  <Typography variant="body2" color={customColors.textSecondary} sx={{ ml: 4, mb: 1 }}>
                    類型：{data.jobType}
                  </Typography>
                  <Typography variant="body2" color={customColors.textSecondary} sx={{ ml: 4, mb: 1 }}>
                    部門：{data.department}
                  </Typography>
                  <Typography variant="body2" color={customColors.textSecondary} sx={{ ml: 4 }}>
                    <LocationOn sx={{ fontSize: 16, mr: 0.5, verticalAlign: "text-bottom" }} />
                    地點：{data.location}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: "flex", mb: 2 }}>
                    <CalendarMonth sx={{ color: customColors.primary, mr: 1 }} />
                    <Typography variant="body1" fontWeight="medium" color={customColors.text}>
                      面試資訊
                    </Typography>
                  </Box>
                  <Typography variant="body2" color={customColors.textSecondary} sx={{ ml: 4, mb: 1 }}>
                    日期：{data.interviewDate}
                  </Typography>
                  <Typography variant="body2" color={customColors.textSecondary} sx={{ ml: 4, mb: 1 }}>
                    時間：{data.interviewTime}
                  </Typography>
                  <Typography variant="body2" color={customColors.textSecondary} sx={{ ml: 4, mb: 1 }}>
                    輪次：{data.interviewRound}
                  </Typography>
                  <Box sx={{ ml: 4, mt: 1 }}>
                    <Chip
                      icon={statusDisplay.icon}
                      label={statusDisplay.text}
                      size="small"
                      sx={{
                        color: statusDisplay.color,
                        bgcolor: `${statusDisplay.color}15`,
                        border: `1px solid ${statusDisplay.color}30`,
                        fontWeight: 500
                      }}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Paper>

          {/* Next Interview Information Card */}
          {data.nextInterview.hasNext && data.interviewResult === "通過" && (
            <Paper
              elevation={0}
              sx={{
                borderRadius: 2,
                border: `1px solid ${customColors.borderLight}`,
                overflow: "hidden",
              }}
            >
              <Box sx={{ p: 2, bgcolor: customColors.secondary }}>
                <Typography variant="h6" fontWeight="500" color={customColors.text}>
                  下次面試安排
                </Typography>
              </Box>
              <Box sx={{ p: 3 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: "flex", mb: 2 }}>
                      <Schedule sx={{ color: customColors.primary, mr: 1 }} />
                      <Typography variant="body1" fontWeight="medium" color={customColors.text}>
                        面試時間
                      </Typography>
                    </Box>
                    <Typography variant="body2" color={customColors.textSecondary} sx={{ ml: 4, mb: 1 }}>
                      日期：{data.nextInterview.date}
                    </Typography>
                    <Typography variant="body2" color={customColors.textSecondary} sx={{ ml: 4, mb: 1 }}>
                      時間：{data.nextInterview.time}
                    </Typography>
                    <Typography variant="body2" color={customColors.textSecondary} sx={{ ml: 4 }}>
                      輪次：{data.nextInterview.round}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: "flex", mb: 2 }}>
                      {data.nextInterview.type === "線上面試" ? (
                        <VideoCall sx={{ color: customColors.primary, mr: 1 }} />
                      ) : (
                        <LocationCity sx={{ color: customColors.primary, mr: 1 }} />
                      )}
                      <Typography variant="body1" fontWeight="medium" color={customColors.text}>
                        面試方式
                      </Typography>
                    </Box>
                    <Box sx={{ ml: 4, mb: 1 }}>
                      <Chip
                        label={data.nextInterview.type}
                        size="small"
                        sx={{
                          color: customColors.primary,
                          bgcolor: customColors.blueLight,
                          fontWeight: 500
                        }}
                      />
                    </Box>

                    <Typography variant="body2" color={customColors.textSecondary} sx={{ ml: 4, mb: 1 }}>
                      地點：{data.nextInterview.location}
                    </Typography>
                    <Typography variant="body2" color={customColors.textSecondary} sx={{ ml: 4 }}>
                      <Person sx={{ fontSize: 16, mr: 0.5, verticalAlign: "text-bottom" }} />
                      面試官：{data.nextInterview.interviewer}
                    </Typography>
                  </Grid>
                </Grid>

                {data.nextInterview.notes && (
                  <>
                    <Divider sx={{ my: 2, borderColor: customColors.borderLight }} />
                    <Box>
                      <Typography variant="body2" fontWeight="medium" color={customColors.text} sx={{ mb: 1 }}>
                        面試備註：
                      </Typography>
                      <Typography variant="body2" color={customColors.textSecondary} sx={{ lineHeight: 1.6 }}>
                        {data.nextInterview.notes}
                      </Typography>
                    </Box>
                  </>
                )}
              </Box>
            </Paper>
          )}

          {data.confirmStatus === "已面試" ? (
            <>
              {/* AI Interview Analysis Report */}
              <Paper
                elevation={0}
                sx={{
                  borderRadius: 2,
                  border: `1px solid ${customColors.borderLight}`,
                  overflow: "hidden",
                }}
              >
                <Box sx={{ p: 2, bgcolor: customColors.blueGray }}>
                  <Typography variant="h6" fontWeight="500" color={customColors.text}>
                    AI 面試分析報告
                  </Typography>
                </Box>

                <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  sx={{
                    px: 2,
                    borderBottom: `1px solid ${customColors.borderLight}`,
                    "& .MuiTab-root": {
                      textTransform: "none",
                      minWidth: "auto",
                      px: 2,
                      color: customColors.textSecondary,
                      fontWeight: 500,
                    },
                    "& .Mui-selected": {
                      color: customColors.primary,
                    },
                    "& .MuiTabs-indicator": {
                      backgroundColor: customColors.primary,
                    },
                  }}
                >
                  <Tab label="總評" />
                  <Tab label="詳細分析" />
                </Tabs>

                <Box sx={{ p: 3 }}>
                  {tabValue === 0 && (
                    <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" } }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          mr: 3,
                          mb: { xs: 3, md: 0 },
                        }}
                      >
                        <CircleProgress
                          score={data.scores.overall}
                          label="總體評分"
                          color={customColors.primary}
                          size={160}
                        />
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Typography
                          variant="body1"
                          sx={{ color: customColors.text, lineHeight: 1.6 }}
                        >
                          {data.comments.overall}
                        </Typography>
                      </Box>
                    </Box>
                  )}

                  {tabValue === 1 && (
                    <Grid container spacing={3} sx={{ mt: 0 }}>
                      {scoreItems.map((item) => (
                        <Grid item xs={12} md={6} key={item.key}>
                          <Card
                            sx={{
                              p: 2,
                              borderRadius: 2,
                              border: `1px solid ${customColors.borderLight}`,
                              boxShadow: "none",
                            }}
                          >
                            <Typography
                              variant="subtitle1"
                              gutterBottom
                              sx={{
                                fontWeight: 500,
                                color: customColors.text
                              }}
                            >
                              {item.title}
                            </Typography>
                            <Box sx={{ mb: 1 }}>
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Typography
                                  variant="body2"
                                  color={customColors.textSecondary}
                                >
                                  {item.label}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  fontWeight="medium"
                                  color={customColors.text}
                                >
                                  {
                                    data.scores[
                                    item.key as keyof typeof data.scores
                                    ]
                                  }
                                  /100
                                </Typography>
                              </Box>
                              <LinearProgress
                                variant="determinate"
                                value={
                                  data.scores[
                                  item.key as keyof typeof data.scores
                                  ]
                                }
                                sx={{
                                  mt: 0.5,
                                  height: 8,
                                  borderRadius: 4,
                                  bgcolor: customColors.blueLight,
                                  "& .MuiLinearProgress-bar": {
                                    bgcolor: customColors.primary,
                                    borderRadius: 4,
                                  },
                                }}
                              />
                            </Box>
                            <Typography
                              variant="body2"
                              color={customColors.textSecondary}
                              sx={{ mt: 2, lineHeight: 1.6 }}
                            >
                              {
                                data.comments[
                                item.key as keyof typeof data.comments
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
            </>
          ) : (
            <Paper
              sx={{
                borderRadius: 2,
                border: `1px solid ${customColors.borderLight}`,
                padding: "2rem",
                textAlign: "center",
                color: customColors.textSecondary,
              }}
            >
              尚未接受面試
            </Paper>
          )}
        </Box>
      </Box>
    </Layout>
  );
}