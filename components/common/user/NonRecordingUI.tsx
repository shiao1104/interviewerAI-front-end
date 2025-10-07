// NonRecordingUI.tsx - 非錄影狀態指示器組件
import React from 'react';
import styles from '@/styles/pages/user/Interview.module.scss';
import { Box, Typography, Button } from '@mui/material';
import { 
  VideocamOff,
  MicOff,
  CheckCircle
} from '@mui/icons-material';

interface NonRecordingUIProps {
  isInterviewStarted: boolean;
  isPreparing: boolean;
  mediaPermissions: {
    camera: boolean;
    microphone: boolean;
  };
  onCheckPermissions: () => Promise<boolean>;
}

export const NonRecordingUI: React.FC<NonRecordingUIProps> = ({
  isInterviewStarted,
  isPreparing,
  mediaPermissions,
  onCheckPermissions,
}) => {
  if (!isInterviewStarted) {
    return (
      <Box className={styles.nonRecordingUI}>
        <Box className={`${styles.statusChip} ${styles.standby}`}>
          <CheckCircle className={styles.statusIcon} />
          <Typography variant="body2">
            點擊「開始面試」按鈕
          </Typography>
        </Box>
      </Box>
    );
  }
  
  if (isPreparing) {
    return (
      <Box className={styles.nonRecordingUI}>
      </Box>
    );
  }
  
  if (!mediaPermissions.camera || !mediaPermissions.microphone) {
    return (
      <Box className={styles.nonRecordingUI}>
        <Box className={`${styles.statusChip} ${styles.error}`}>
          {!mediaPermissions.camera && (
            <>
              <VideocamOff className={styles.statusIcon} />
              <Typography variant="body2">
                需要鏡頭權限
              </Typography>
            </>
          )}
          {!mediaPermissions.microphone && (
            <>
              <MicOff className={styles.statusIcon} />
              <Typography variant="body2">
                需要麥克風權限
              </Typography>
            </>
          )}
        </Box>
        <Button 
          variant="contained" 
          color="primary" 
          size="small"
          onClick={onCheckPermissions}
          style={{ marginTop: '0.5rem' }}
        >
          重新檢查權限
        </Button>
      </Box>
    );
  }
  
  return (
    <Box className={styles.nonRecordingUI}>
      <Box className={`${styles.statusChip} ${styles.standby}`}>
        <CheckCircle className={styles.statusIcon} />
        <Typography variant="body2">
          設備就緒
        </Typography>
      </Box>
    </Box>
  );
};