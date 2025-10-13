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
} from "@mui/material";
import {
  EventNote,
  AssignmentTurnedIn,
  CalendarToday,
  Timer,
  BusinessCenter,
  CheckCircle,
  Visibility,
} from "@mui/icons-material";
import Layout from "@/components/Layout/Layout";
import ConfirmPopup from "@/components/common/user/ConfirmPupup";
import CompanyIntroPopup from "@/components/common/user/CompanyIntroPopup";
import OpeningAPI from "@/lib/api/OpeningAPI";
import InterviewAPI from "@/lib/api/InterviewAPI";
import { toast } from "react-toastify";
import { useLoading } from "@/lib/hook/loading";

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
  interview_id: number;
}

export type ReportListType = {
  interview_history: []
}

export default function InterviewerDashboard() {
  const router = useRouter();
  const { showLoading, hideLoading } = useLoading();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedInterview, setSelectedInterview] =
    useState<InterviewApiData | null>(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const [companyIntro, setCompanyIntro] = useState<InterviewApiData[]>([]);
  const [reportList, setReportList] = useState<any[]>([]);
  const [userId, setUserId] = useState<number | null>(null);

  const fetchInterviews = async (uid: number) => {
    try {
      const response = await OpeningAPI.getMyApplied(uid);
      const reportListResponse = await InterviewAPI.getReportList(uid);

      if (response.result && response.data && reportListResponse.data) {
        const reportList = reportListResponse.data as ReportListType;
        setCompanyIntro(response.data);
        setReportList(reportList.interview_history);
      }
    } catch (error) {
      toast.error("獲取面試數據失敗，請稍後重試。");
      setCompanyIntro([]);
    } finally {
      hideLoading();
    }
  };

  useEffect(() => {
    showLoading();
    sessionStorage.removeItem('interview_id');
    sessionStorage.removeItem('opening_name');
    sessionStorage.removeItem('company_name');
  }, []);

  useEffect(() => {
    setUserId(Number(sessionStorage.getItem('user_id')));
    if (userId == null) return;
    fetchInterviews(userId);
    setAnimateIn(true);
  }, [userId]);

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
    sessionStorage.setItem('interview_id', selectedInterview?.interview_id.toString() || '');
    sessionStorage.setItem('opening_name', selectedInterview?.opening_name || '');
    sessionStorage.setItem('company_name', selectedInterview?.company.company_name || '');
    router.push("/user/interview");
  };

  return (
    <Layout>
      <div
        className={`${styles.mainContent} ${animateIn ? styles.animateIn : ""}`}
      >
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
            {companyIntro.length > 0 && companyIntro.map((apiInterview, index) => {
              const interviewTime = new Date(apiInterview.interview_datetime);
              const now = new Date();

              const isDisabled = now.getTime() < interviewTime.getTime() - (5 * 60 * 1000);

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
                    {isDisabled ? (
                      <Button
                        disabled
                        variant="contained"
                        onClick={() => handleOpenDialog(apiInterview)}
                        sx={{ backgroundColor: '#ccc', cursor: 'not-allowed' }}
                      >
                        面試即將開始
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        className={styles.primaryButton}
                        onClick={() => handleOpenDialog(apiInterview)}
                      >
                        準備面試
                      </Button>
                    )

                    }

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

            <div className={styles.completedInterviewsCard}>
              <div className={styles.cardGlow}></div>
              <div className={styles.completedHeader}>
                <div className={styles.completedTitleWrapper}>
                  <AssignmentTurnedIn className={styles.completedIcon} />
                  <Typography variant="h6">已完成面試報告</Typography>
                </div>
              </div>
              <List className={styles.completedList}>
                {reportList
                  .filter((item) => item.interview_status === "已完成") 
                  .map((item) => (
                    <ListItem key={item.id} className={styles.completedItem}>
                      <ListItemIcon>
                        <BusinessCenter className={styles.listIcon} />
                      </ListItemIcon>
                      <ListItemText
                        primary={`${item.opening_detail.opening_name} @ ${item.opening_detail.company_name}`}
                        secondary={`面試日期：${item.interview_datetime.split("T")[0]}`}
                      />
                      <Button
                        startIcon={item.feedback ? <Visibility /> : <CheckCircle />}
                        variant="text"
                        className={styles.feedbackButton}
                        onClick={() => router.push(`/user/report/${item.interview_id}`)}
                      >
                        查看回饋
                      </Button>
                    </ListItem>
                  ))}
              </List>
            </div>
          </div>
        </section>
      </div>

      {/* 使用單獨的關閉函數 */}
      <ConfirmPopup
        open={openDialog}
        onClose={handleCloseConfirmDialog}
        onConfirm={handleStartInterview}
        companyIntro={selectedInterview}
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