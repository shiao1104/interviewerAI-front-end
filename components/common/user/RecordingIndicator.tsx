// RecordingIndicator.tsx - 錄影中指示器組件
import React from 'react';
import styles from '@/styles/pages/user/Interview.module.scss';
import { Box, Typography } from '@mui/material';
import { FiberManualRecord } from '@mui/icons-material';

interface RecordingIndicatorProps {
  isRecording: boolean;
  timeLeft: number;
  formatTime: (seconds: number) => string;
}

export const RecordingIndicator: React.FC<RecordingIndicatorProps> = ({
  isRecording,
  timeLeft,
  formatTime,
}) => {
  return (
    <Box className={styles.recordingIndicator}>
      <FiberManualRecord 
        fontSize="small" 
        color="error" 
        className={styles.recordingDot} 
      />
      <Typography variant="body2" className={styles.recordingTime}>
        {isRecording ? `錄製中 ${formatTime(timeLeft)}` : '準備就緒'}
      </Typography>
    </Box>
  );
}