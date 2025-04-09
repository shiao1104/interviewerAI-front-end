import React, { useState } from "react";
import styles from "@/styles/pages/user/Home.module.scss";
import { useRouter } from "next/router";
import {
  Card,
  Typography,
  Button,
  IconButton,
  Avatar,
  Badge,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Grid,
} from "@mui/material";
import {
  Settings,
  NotificationsActive,
  EventNote,
  AssignmentTurnedIn,
  Videocam,
  Description,
  Lightbulb,
  Help,
  Security,
  CalendarToday,
  Timer,
  BusinessCenter,
  LocationOn,
  Person,
  CheckCircle,
  Visibility,
} from "@mui/icons-material";

export default function InterviewerDashboard() {
  const router = useRouter();
  const [notifications] = useState(3);

  // 模擬數據
  const upcomingInterviews = [
    {
      id: 1,
      company: "科技未來有限公司",
      position: "資深前端工程師",
      date: "2025/04/10",
      time: "14:30-15:30",
      location: "線上視訊面試",
      status: "準備中",
      logo: "/company-logo-1.png",
    },
    {
      id: 2,
      company: "數位創新科技",
      position: "UI/UX 設計師",
      date: "2025/04/15",
      time: "10:00-11:00",
      location: "台北市信義區松高路1號5樓",
      status: "已確認",
      logo: "/company-logo-2.png",
    },
  ];

  const completedInterviews = [
    {
      id: 3,
      company: "網路應用服務",
      position: "全端工程師",
      date: "2025/03/28",
      feedback: true,
    },
    {
      id: 4,
      company: "雲端系統開發",
      position: "系統架構師",
      date: "2025/03/20",
      feedback: true,
    },
  ];

  const notificationItems = [
    {
      id: 1,
      title: "面試確認通知",
      description: "您與「科技未來有限公司」的面試已確認",
      time: "1小時前",
      read: false,
    },
    {
      id: 2,
      title: "面試回饋已送達",
      description: "「網路應用服務」已提供您面試回饋",
      time: "1天前",
      read: false,
    },
    {
      id: 3,
      title: "系統更新通知",
      description: "系統已更新模擬面試功能，包含更多行業問題",
      time: "2天前",
      read: false,
    },
  ];

  return (
    <div className={styles.dashboardContainer}>
      {/* 頂部：歡迎標語 + 快捷設定 */}
      <div className={styles.header}>
        <div className={styles.welcomeSection}>
          <Typography variant="h4" className={styles.welcomeText}>
            您好，王小明
          </Typography>
          <Typography variant="subtitle1" className={styles.welcomeSubtext}>
            今天是準備面試的好日子！您有 2 個即將到來的面試。
          </Typography>
        </div>
        <div className={styles.headerActions}>
          <IconButton className={styles.actionButton}>
            <Settings />
          </IconButton>
          <IconButton className={styles.actionButton}>
            <Badge badgeContent={notifications} color="error">
              <NotificationsActive />
            </Badge>
          </IconButton>
          <Avatar className={styles.userAvatar}>王</Avatar>
        </div>
      </div>

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
                  <div
                    className={`${styles.statusBadge} ${
                      styles[interview.status]
                    }`}
                  >
                    {interview.status}
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
                  <div className={styles.detailItem}>
                    <LocationOn className={styles.detailIcon} />
                    <Typography variant="body2">
                      {interview.location}
                    </Typography>
                  </div>
                </div>
                <div className={styles.cardActions}>
                  <Button
                    variant="contained"
                    className={styles.primaryButton}
                    onClick={() => router.push("/user/record")}
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

      {/* 底部：幫助中心、設定、隱私條款 */}
      <footer className={styles.footer}>
        <div className={styles.footerLinks}>
          <Button startIcon={<Help />}>幫助中心</Button>
          <Button startIcon={<Settings />}>設定</Button>
          <Button startIcon={<Security />}>隱私條款</Button>
        </div>
        <Typography variant="caption" className={styles.copyright}>
          © 2025 面試達人. 版權所有
        </Typography>
      </footer>
    </div>
  );
}
