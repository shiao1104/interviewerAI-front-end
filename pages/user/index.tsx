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

export interface interviewData {
  position: string;
  company: string;
  date: string;
  time: string;
}

export default function InterviewerDashboard() {
  const router = useRouter();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedInterview, setSelectedInterview] =
    useState<interviewData | null>(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const [showAllCompleted, setShowAllCompleted] = useState(false);

  useEffect(() => {
    // 頁面載入後的動畫效果
    setAnimateIn(true);
  }, []);

  const handleOpenDialog = (interview: interviewData) => {
    setSelectedInterview(interview);
    setOpenDialog(true);
  };

  const handleOpendetail = (interview: interviewData) => {
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

          <div className={styles.interviewCards}>
            {upcomingInterviews.map((interview, index) => (
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

        <Grid container spacing={3} className={styles.dashboardGrid}>
          {/* 面試準備工具 */}
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
                  <Button variant="outlined" className={styles.toolButton}component="a" href="/student-try/interview-home.html">
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
        </Grid>
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
        interview={selectedInterview}
      />
    </Layout>
  );
}
