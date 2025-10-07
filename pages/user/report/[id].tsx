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
} from "@mui/material";
import {
  KeyboardBackspace,
  Business,
  CalendarMonth,
  Work,
  CheckCircle,
  Cancel,
  Schedule,
} from "@mui/icons-material";
import CircleProgress from "@/components/common/manage/CircleProgress";
import Layout from "@/components/Layout/Layout";
import InterviewAPI from "@/lib/api/InterviewAPI";

type InterviewData = {
  interview_id: number;
  interview_status: string;
  interview_result: string;
  interview_datetime: string | number | Date;
  interview_type?: string;
  opening_detail?: {
    company_name?: string;
    opening_name?: string;
  };
  total_score?: number;
  result_abstract?: string;
  score_expression?: number;
  score_attitude?: number;
  score_technical?: number;
  score_collaboration?: number;
  remark?: string;
};

export default function Report() {
  const router = useRouter();
  const { id } = router.query;
  const [interviewData, setInterviewData] = useState<InterviewData | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);

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

  const theme = useTheme();

  const scoreItems = [
    {
      key: "score_expression",
      title: "語言表達力",
      label: "表達能力",
      color: theme.palette.success.main,
    },
    {
      key: "score_attitude",
      title: "積極度分析",
      label: "積極度",
      color: theme.palette.info.main,
    },
    {
      key: "score_technical",
      title: "技術能力預測",
      label: "技術能力",
      color: theme.palette.warning.main,
    },
    {
      key: "score_collaboration",
      title: "團隊合作",
      label: "合作能力",
      color: theme.palette.primary.main,
    },
  ];

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await InterviewAPI.getRecord(Number(id));
      setInterviewData(response.data ?? null);
    } catch (error) {
      console.error("Error fetching interview data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (router.isReady && id) {
      fetchData();
    }
  }, [id, router.isReady]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleTabChange = (event: any, newValue: any) => {
    setTabValue(newValue);
  };

  // 格式化日期時間顯示
  const formatDateTime = (datetime: string | number | Date) => {
    if (!datetime) return { date: "", time: "" };
    const date = new Date(datetime);
    return {
      date: date.toLocaleDateString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }),
      time: date.toLocaleTimeString('zh-TW', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      })
    };
  };

  // 取得面試狀態顯示的顏色和圖標
  const getInterviewStatusDisplay = (status: string, result: string | string[]) => {
    if (status === "已完成") {
      if (result?.includes("通過")) {
        return {
          color: customColors.success,
          icon: <CheckCircle sx={{ fontSize: 16 }} />,
          text: result
        };
      } else if (result?.includes("未通過")) {
        return {
          color: customColors.error,
          icon: <Cancel sx={{ fontSize: 16 }} />,
          text: result
        };
      } else {
        return {
          color: customColors.warning,
          icon: <Schedule sx={{ fontSize: 16 }} />,
          text: result || "結果待定"
        };
      }
    } else {
      return {
        color: customColors.textSecondary,
        icon: <Schedule sx={{ fontSize: 16 }} />,
        text: status || "尚未面試"
      };
    }
  };

  // 生成評分說明文字
  type ScoreType = 'score_expression' | 'score_attitude' | 'score_technical' | 'score_collaboration';
  const generateScoreComment = (score: number, type: ScoreType) => {
    const comments: Record<ScoreType, { high: string; medium: string; low: string }> = {
      score_expression: {
        high: "應徵者展現了優秀的溝通能力，用詞精準，能清晰表達技術概念和想法。",
        medium: "應徵者具備良好的表達能力，能夠適當地回答問題，表達較為清楚。",
        low: "應徵者在表達方面有進步空間，建議加強口語溝通能力。"
      },
      score_attitude: {
        high: "面試過程中表現非常積極主動，態度自信，對問題回應迅速且充滿熱忱。",
        medium: "面試過程中表現穩定，態度良好，展現出適當的積極性。",
        low: "面試過程中態度較為被動，建議提升面試時的積極表現。"
      },
      score_technical: {
        high: "根據技術問題的回答分析，應徵者具備優秀的技術能力，專業知識豐富。",
        medium: "應徵者具備所需的基本技術技能，能夠回答大部分技術相關問題。",
        low: "技術能力需要加強，建議持續學習相關專業技能。"
      },
      score_collaboration: {
        high: "團隊合作能力優秀，展現良好的溝通與協作精神，過去的團隊經驗豐富。",
        medium: "具備基本的團隊合作能力，能夠與他人良好協作。",
        low: "團隊合作能力有待提升，建議增加團隊協作經驗。"
      }
    };

    const level = score >= 80 ? 'high' : score >= 60 ? 'medium' : 'low';
    return comments[type][level] || "評分分析中...";
  };

  if (loading) {
    return (
      <Layout>
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <Typography>載入中...</Typography>
        </Box>
      </Layout>
    );
  }

  if (!interviewData) {
    return (
      <Layout>
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <Typography color="error">無法載入面試資料</Typography>
        </Box>
      </Layout>
    );
  }

  const statusDisplay = getInterviewStatusDisplay(
    interviewData.interview_status,
    interviewData.interview_result
  );

  const dateTime = formatDateTime(interviewData.interview_datetime);

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
                <Grid>
                  <Box sx={{ display: "flex", mb: 2 }}>
                    <Business sx={{ color: customColors.primary, mr: 1 }} />
                    <Typography variant="body1" fontWeight="medium" color={customColors.text}>
                      {interviewData.opening_detail?.company_name || "公司名稱"}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color={customColors.textSecondary} sx={{ ml: 4, mb: 1 }}>
                    <Work sx={{ fontSize: 16, mr: 0.5, verticalAlign: "text-bottom" }} />
                    職位：{interviewData.opening_detail?.opening_name || "職位名稱"}
                  </Typography>
                </Grid>
                <Grid>
                  <Box sx={{ display: "flex", mb: 2 }}>
                    <CalendarMonth sx={{ color: customColors.primary, mr: 1 }} />
                    <Typography variant="body1" fontWeight="medium" color={customColors.text}>
                      面試資訊
                    </Typography>
                  </Box>
                  <Typography variant="body2" color={customColors.textSecondary} sx={{ ml: 4, mb: 1 }}>
                    日期：{dateTime.date}
                  </Typography>
                  <Typography variant="body2" color={customColors.textSecondary} sx={{ ml: 4, mb: 1 }}>
                    時間：{dateTime.time}
                  </Typography>
                  <Typography variant="body2" color={customColors.textSecondary} sx={{ ml: 4, mb: 1 }}>
                    面試編號：#{interviewData.interview_id}
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
                      score={interviewData.total_score || 0}
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
                      {interviewData.result_abstract ||
                        `根據AI分析結果，總體評分為${interviewData.total_score}分。${interviewData.total_score && interviewData.total_score >= 80 ? '表現優秀，高度推薦進入下一輪面試。' :
                          interviewData.total_score && interviewData.total_score >= 60 ? '表現良好，符合基本職位要求。' :
                            '表現需要改善，建議加強相關能力後再次嘗試。'
                        }`}
                    </Typography>
                  </Box>
                </Box>
              )}

              {tabValue === 1 && (
                <Grid container sx={{
                  mt: 0,
                  display: "grid",
                  templateColumns: "1fr",
                  gap: 2
                }}>
                  {scoreItems.map((item) => {
                    const key = item.key as keyof Pick<InterviewData, 'score_expression' | 'score_attitude' | 'score_technical' | 'score_collaboration'>;
                    const score = interviewData[key] || 0;

                    return (
                      <Grid key={item.key}>
                        <Card
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            border: `1px solid ${customColors.borderLight}`,
                            boxShadow: "none",
                            gap: 2,
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
                                {score}/100
                              </Typography>
                            </Box>
                            <LinearProgress
                              variant="determinate"
                              value={score}
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
                            {generateScoreComment(score, item.key as ScoreType)}
                          </Typography>
                        </Card>
                      </Grid>
                    );
                  })}
                </Grid>
              )}
            </Box>
          </Paper>

          {/* Additional Information */}
          {interviewData.remark && (
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
                  備註
                </Typography>
              </Box>
              <Box sx={{ p: 3 }}>
                <Typography
                  variant="body1"
                  sx={{ color: customColors.text, lineHeight: 1.6 }}
                >
                  {interviewData.remark}
                </Typography>
              </Box>
            </Paper>
          )}
        </Box>
      </Box>
    </Layout>
  );
}