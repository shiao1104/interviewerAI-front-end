import styles from "@/styles/pages/user/Home.module.scss";
import { useRouter } from "next/router";
import {
  Card,
  Typography,
  Button,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Grid,
} from "@mui/material";
import {
  NotificationsActive,
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
import React, { useState } from "react";
import {
  completedInterviews,
  notificationItems,
  upcomingInterviews,
} from "@/lib/data/testData";
import ConfirmPopup from "@/components/common/user/ConfirmPupup";

export interface interviewData {
  position: string;
  company: string;
  date: string;
  time: string;
}

export default function InterviewerDashboard() {
  const router = useRouter();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState<interviewData | null>(null);

  const handleOpenDialog = (interview: interviewData) => {
    setSelectedInterview(interview);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedInterview(null);
  };

  const handleStartInterview = () => {
    router.push("/user/interview");
  };

  return (
    <Layout>
      <div className={styles.mainContent}>
        {/* 面試排程概覽 */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <Typography variant="h5" className={styles.sectionTitle}>
              <EventNote className={styles.sectionIcon} />
              面試排程概覽
            </Typography>
            <Button
              variant="outlined"
              size="small"
              className={styles.viewAllButton}
            >
              查看全部
            </Button>
          </div>

          <div className={styles.interviewCards}>
            {upcomingInterviews.map((interview) => (
              <Card key={interview.id} className={styles.interviewCard}>
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

                  <Button variant="outlined" className={styles.secondaryButton}>
                    查看詳情
                  </Button>
                </div>
              </Card>
            ))}

            <Card className={styles.completedInterviewsCard}>
              <div className={styles.completedHeader}>
                <Typography variant="h6">
                  <AssignmentTurnedIn className={styles.completedIcon} />
                  已完成面試報告
                </Typography>
                <Button variant="text" className={styles.viewAllButton}>
                  查看全部
                </Button>
              </div>
              <List className={styles.completedList}>
                {completedInterviews.map((item) => (
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
                    >
                      {item.feedback ? "查看回饋" : "等待回饋"}
                    </Button>
                  </ListItem>
                ))}
              </List>
            </Card>
          </div>
        </section>

        <Grid container spacing={3} className={styles.dashboardGrid}>
          {/* 面試準備工具 */}
          <Grid>
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <Typography variant="h5" className={styles.sectionTitle}>
                  <Person className={styles.sectionIcon} />
                  面試準備工具
                </Typography>
              </div>
              <div className={styles.toolsGrid}>
                <Card className={styles.toolCard}>
                  <Videocam className={styles.toolIcon} />
                  <Typography variant="h6">模擬面試練習</Typography>
                  <Typography variant="body2">
                    透過AI模擬真實面試，獲得實時反饋
                  </Typography>
                  <Button variant="outlined" className={styles.toolButton}>
                    開始練習
                  </Button>
                </Card>
                <Card className={styles.toolCard}>
                  <Description className={styles.toolIcon} />
                  <Typography variant="h6">履歷上傳與管理</Typography>
                  <Typography variant="body2">
                    管理您的多個履歷版本，根據職位量身定制
                  </Typography>
                  <Button variant="outlined" className={styles.toolButton}>
                    管理履歷
                  </Button>
                </Card>
                <Card className={styles.toolCard}>
                  <Lightbulb className={styles.toolIcon} />
                  <Typography variant="h6">面試建議閱讀</Typography>
                  <Typography variant="body2">
                    閱讀行業專家提供的面試技巧與建議
                  </Typography>
                  <Button variant="outlined" className={styles.toolButton}>
                    查看建議
                  </Button>
                </Card>
              </div>
            </section>
          </Grid>

          {/* 通知與提醒 */}
          <Grid>
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <Typography variant="h5" className={styles.sectionTitle}>
                  <NotificationsActive className={styles.sectionIcon} />
                  通知與提醒
                </Typography>
                <Button
                  variant="text"
                  size="small"
                  className={styles.viewAllButton}
                >
                  標記全部為已讀
                </Button>
              </div>
              <Card className={styles.notificationsCard}>
                <List className={styles.notificationsList}>
                  {notificationItems.map((item) => (
                    <React.Fragment key={item.id}>
                      <ListItem
                        className={`${styles.notificationItem} ${
                          !item.read ? styles.unread : ""
                        }`}
                      >
                        <div className={styles.notificationContent}>
                          <Typography
                            variant="subtitle1"
                            className={styles.notificationTitle}
                          >
                            {item.title}
                          </Typography>
                          <Typography
                            variant="body2"
                            className={styles.notificationDescription}
                          >
                            {item.description}
                          </Typography>
                          <Typography
                            variant="caption"
                            className={styles.notificationTime}
                          >
                            {item.time}
                          </Typography>
                        </div>
                      </ListItem>
                      <Divider component="li" />
                    </React.Fragment>
                  ))}
                </List>
              </Card>
            </section>
          </Grid>
        </Grid>
      </div>
      <ConfirmPopup
        open={openDialog}
        onClose={handleCloseDialog}
        onConfirm={handleStartInterview}
        interview={selectedInterview}
      />
    </Layout>
  );
}
