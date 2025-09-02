import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import styles from "@/styles/pages/user/Home.module.scss";
import {
  Typography,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Grid,
} from "@mui/material";
import {
  EventNote,
  AssignmentTurnedIn,
  Videocam,
  Description,
  Lightbulb,
  CalendarToday,
  Timer,
  BusinessCenter,
  Person,
  CheckCircle,
  Visibility,
} from "@mui/icons-material";
import Layout from "@/components/Layout/Layout";
import { completedInterviews, upcomingInterviews } from "@/lib/data/testData";
import ConfirmPopup from "@/components/common/user/ConfirmPupup";
import CompanyIntroPopup from "@/components/common/user/CompanyIntroPopup";
import OpeningAPI from "@/lib/api/OpeningAPI";

export interface CompanyInfo {
  company_name: string;
  telephone: string;
  company_website: string;
  company_description: string;
}

export interface InterviewApiData {
  opening_id: number;
  opening_info: string;
  update_time: string;
  opening_name: string;
  skills_required: string;
  company: CompanyInfo;
  address: number;
  interview_datetime: string;
  company_address: string;
}

export default function InterviewerDashboard() {
  const router = useRouter();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedInterview, setSelectedInterview] =
    useState<InterviewApiData | null>(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const [showAllCompleted, setShowAllCompleted] = useState(false);
  const [companyIntro, setCompanyIntro] = useState<InterviewApiData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInterviews = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await OpeningAPI.getMyApplied(1);
      
      if (response.result && response.data) {
        setCompanyIntro(response.data);
        console.log("成功獲取面試數據:", response.data);
      } else {
        throw new Error(response.message || "獲取數據失敗");
      }
    } catch (error) {
      console.error("獲取面試數據錯誤:", error);
      setError(error instanceof Error ? error.message : "未知錯誤");
      setCompanyIntro([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setAnimateIn(true);
    fetchInterviews();
  }, []);

  const handleOpenDialog = (interview: InterviewApiData) => {
    setSelectedInterview(interview);
    setOpenDialog(true);
  };

  const handleOpendetail = (interview: InterviewApiData) => {
    setSelectedInterview(interview);
    setOpenDetail(true);
  };

  const handleCloseConfirmDialog = () => {
    setOpenDialog(false);
  };

  const handleCloseDetailDialog = () => {
    setOpenDetail(false);
  };

  const handleStartInterview = () => {
    router.push("/user/interview");
  };

  return (
    <Layout>
      <div
        className={`${styles.mainContent} ${animateIn ? styles.animateIn : ""}`}
      >
        {/* 面試排程概覽 */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitleWrapper}>
              <div className={styles.iconBackground}>
                <EventNote className={styles.sectionIcon} />
              </div>
              <Typography variant="h5" className={styles.sectionTitle}>
                面試排程概覽
              </Typography>
            </div>
          </div>

          {/* 顯示錯誤信息 */}
          {error && (
            <div className={styles.errorMessage}>
              <Typography color="error">
                獲取面試數據失敗: {error}
              </Typography>
              <Button 
                onClick={fetchInterviews}
                variant="outlined" 
                size="small"
                style={{ marginTop: '8px' }}
              >
                重試
              </Button>
            </div>
          )}

          {/* 顯示載入狀態 */}
          {loading && (
            <div className={styles.loadingMessage}>
              <Typography>正在載入面試數據...</Typography>
            </div>
          )}

          <div className={styles.interviewCards}>
            {/* 渲染來自 API 的真實面試數據 */}
            {companyIntro.length > 0 && companyIntro.map((apiInterview, index) => {
              return (
                <div
                  key={apiInterview.opening_id}
                  className={styles.interviewCard}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={styles.cardGlow}></div>
                  <div className={styles.cardHeader}>
                    <Avatar className={styles.companyLogo}>
                      {apiInterview.company.company_name.charAt(0)}
                    </Avatar>
                    <div className={styles.interviewInfo}>
                      <Typography variant="h6">{apiInterview.opening_name}</Typography>
                      <Typography variant="subtitle2">
                        {apiInterview.company.company_name}
                      </Typography>
                    </div>
                  </div>
                  <div className={styles.cardDetails}>
                    <div className={styles.detailItem}>
                      <CalendarToday className={styles.detailIcon} />
                      <Typography variant="body2">{apiInterview.interview_datetime.toString().split('T')[0]}</Typography>
                    </div>
                    <div className={styles.detailItem}>
                      <Timer className={styles.detailIcon} />
                      <Typography variant="body2">{apiInterview.interview_datetime.toString().split('T')[1]}</Typography>
                    </div>
                  </div>
                  <div className={styles.cardActions}>
                    <Button
                      variant="contained"
                      className={styles.primaryButton}
                      onClick={() => handleOpenDialog(apiInterview)}
                    >
                      準備面試
                    </Button>

                    <Button
                      variant="outlined"
                      className={styles.secondaryButton}
                      onClick={() => handleOpendetail(apiInterview)}
                    >
                      查看詳情
                    </Button>
                  </div>
                </div>
              );
            })}

            {/* 如果沒有 API 數據，則顯示測試數據 */}
            {!loading && companyIntro.length === 0 && !error && upcomingInterviews.map((interview, index) => (
              <div
                key={interview.id}
                className={styles.interviewCard}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={styles.cardGlow}></div>
                <div className={styles.cardHeader}>
                  <Avatar src={interview.logo} className={styles.companyLogo}>
                    {interview.company.charAt(0)}
                  </Avatar>
                  <div className={styles.interviewInfo}>
                    <Typography variant="h6">{interview.position}</Typography>
                    <Typography variant="subtitle2">
                      {interview.company}
                    </Typography>
                  </div>
                </div>
                <div className={styles.cardDetails}>
                  <div className={styles.detailItem}>
                    <CalendarToday className={styles.detailIcon} />
                    <Typography variant="body2">{interview.date}</Typography>
                  </div>
                  <div className={styles.detailItem}>
                    <Timer className={styles.detailIcon} />
                    <Typography variant="body2">{interview.time}</Typography>
                  </div>
                </div>
                <div className={styles.cardActions}>
                  <Button
                    variant="contained"
                    className={styles.primaryButton}
                    onClick={() => handleOpenDialog(interview)}
                  >
                    準備面試
                  </Button>

                  <Button
                    variant="outlined"
                    className={styles.secondaryButton}
                    onClick={() => handleOpendetail(interview)}
                  >
                    查看詳情
                  </Button>
                </div>
              </div>
            ))}

            <div className={styles.completedInterviewsCard}>
              <div className={styles.cardGlow}></div>
              <div className={styles.completedHeader}>
                <div className={styles.completedTitleWrapper}>
                  <AssignmentTurnedIn className={styles.completedIcon} />
                  <Typography variant="h6">已完成面試報告</Typography>
                </div>
                <Button
                  variant="text"
                  className={styles.viewAllTextButton}
                  onClick={() => setShowAllCompleted(!showAllCompleted)}
                >
                  {showAllCompleted ? "收起" : "查看全部"}
                </Button>
              </div>
              <List className={styles.completedList}>
                {(showAllCompleted
                  ? completedInterviews
                  : completedInterviews.slice(0, 2)
                ).map((item) => (
                  <ListItem key={item.id} className={styles.completedItem}>
                    <ListItemIcon>
                      <BusinessCenter className={styles.listIcon} />
                    </ListItemIcon>
                    <ListItemText
                      primary={`${item.position} @ ${item.company}`}
                      secondary={`面試日期：${item.date}`}
                    />
                    <Button
                      startIcon={
                        item.feedback ? <Visibility /> : <CheckCircle />
                      }
                      variant="text"
                      className={styles.feedbackButton}
                      onClick={() => router.push('/user/report/1')}
                    >
                      {item.feedback ? "查看回饋" : "等待回饋"}
                    </Button>
                  </ListItem>
                ))}
              </List>
            </div>
          </div>
        </section>

        {/* <Grid container spacing={3} className={styles.dashboardGrid}>
          <Grid className={styles.gridItem}>
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <div className={styles.sectionTitleWrapper}>
                  <div className={styles.iconBackground}>
                    <Person className={styles.sectionIcon} />
                  </div>
                  <Typography variant="h5" className={styles.sectionTitle}>
                    面試準備工具
                  </Typography>
                </div>
              </div>
              <div className={styles.toolsGrid}>
                <div className={styles.toolCard}>
                  <div className={styles.toolIconContainer}>
                    <Videocam className={styles.toolIcon} />
                  </div>
                  <Typography variant="h6">模擬面試練習</Typography>
                  <Typography variant="body2">
                    透過AI模擬真實面試，獲得實時反饋
                  </Typography>
                  <Button variant="outlined" className={styles.toolButton} component="a" href="/student-try/interview-home.html">
                    開始練習
                  </Button>
                </div>
                <div className={styles.toolCard}>
                  <div className={styles.toolIconContainer}>
                    <Description className={styles.toolIcon} />
                  </div>
                  <Typography variant="h6">履歷上傳與管理</Typography>
                  <Typography variant="body2">
                    管理您的多個履歷版本，根據職位量身定制
                  </Typography>
                  <Button variant="outlined" className={styles.toolButton}>
                    管理履歷
                  </Button>
                </div>
                <div className={styles.toolCard}>
                  <div className={styles.toolIconContainer}>
                    <Lightbulb className={styles.toolIcon} />
                  </div>
                  <Typography variant="h6">面試建議閱讀</Typography>
                  <Typography variant="body2">
                    閱讀行業專家提供的面試技巧與建議
                  </Typography>
                  <Button variant="outlined" className={styles.toolButton}>
                    查看建議
                  </Button>
                </div>
              </div>
            </section>
          </Grid>
        </Grid> */}
      </div>

      {/* 使用單獨的關閉函數 */}
      <ConfirmPopup
        open={openDialog}
        onClose={handleCloseConfirmDialog}
        onConfirm={handleStartInterview}
        interview={selectedInterview}
      />

      {/* 使用單獨的關閉函數 */}
      <CompanyIntroPopup
        open={openDetail}
        onClose={handleCloseDetailDialog}
        companyIntro={selectedInterview}
      />
    </Layout>
  );
}