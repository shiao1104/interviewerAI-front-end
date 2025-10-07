import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
} from "@mui/material";
import { VideocamOutlined, MicOutlined } from "@mui/icons-material";
import styles from "@/styles/pages/user/Interview.module.scss";
import { useEffect, useState } from "react";

interface StartInterviewDialogProps {
  open: boolean;
  mediaPermissions: {
    camera: boolean;
    microphone: boolean;
    checking: boolean;
  };
  totalQuestions: number;
  onCheckPermissions: () => void;
  onStartInterview: () => void;
}

export function StartInterviewDialog({
  open,
  mediaPermissions,
  totalQuestions,
  onCheckPermissions,
  onStartInterview,
}: StartInterviewDialogProps) {
  const [companyName, setCompanyName] = useState('');
  const [openingName, setOpeningName] = useState('');

  useEffect(() => {
    setCompanyName(sessionStorage.getItem('company_name') || '');
    setOpeningName(sessionStorage.getItem('opening_name') || '');
  }, []);

  return (
    <Dialog open={open} fullWidth maxWidth="md" disableEscapeKeyDown>
      <DialogTitle>準備開始面試</DialogTitle>
      <DialogContent>
        <Box className={styles.startDialogContent}>
          <Typography variant="h6" gutterBottom>
            面試公司: {companyName}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            面試職位: {openingName}
          </Typography>
          <Typography variant="body1" gutterBottom>
            面試將包含 {totalQuestions} 個問題，每個問題都有時間限制。
          </Typography>
          <Typography variant="body1" gutterBottom>
            請確保您的鏡頭和麥克風已就緒，在安靜的環境中進行面試。
          </Typography>

          <Box className={styles.permissionStatus} mt={3}>
            <Box display="flex" alignItems="center" mb={1}>
              <VideocamOutlined
                color={mediaPermissions.camera ? "success" : "error"}
              />
              <Typography ml={1}>
                鏡頭: {mediaPermissions.camera ? "已允許" : "未允許"}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <MicOutlined
                color={mediaPermissions.microphone ? "success" : "error"}
              />
              <Typography ml={1}>
                麥克風: {mediaPermissions.microphone ? "已允許" : "未允許"}
              </Typography>
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onCheckPermissions}
          color="primary"
          disabled={mediaPermissions.checking}
        >
          {mediaPermissions.checking ? "檢查中..." : "檢查權限"}
        </Button>
        <Button
          onClick={onStartInterview}
          variant="contained"
          color="primary"
          disabled={
            !mediaPermissions.camera ||
            !mediaPermissions.microphone ||
            mediaPermissions.checking
          }
        >
          開始面試
        </Button>
      </DialogActions>
    </Dialog>
  );
}
