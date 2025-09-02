import React from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  FormControlLabel,
  Checkbox,
  Box,
  Alert,
  Divider,
} from "@mui/material";
import { InterviewApiData } from "@/pages/user";

export default function ConfirmPopup({
  open,
  onClose,
  onConfirm,
  companyIntro,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  companyIntro: InterviewApiData | null;
}) {
  const [consentGiven, setConsentGiven] = React.useState(false);

  const handleConfirm = () => {
    if (consentGiven) {
      onConfirm();
    }
  };
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogContent dividers>
        {companyIntro && (
          <div>
            <Typography variant="h6">{companyIntro.opening_name}</Typography>
            <Typography variant="subtitle1" gutterBottom>
              {companyIntro.company.company_name}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 2 }}>
              <Alert severity="info" sx={{ mb: 2 }}>
                本次面試準備將收集您的影音資料，請閱讀以下隱私聲明
              </Alert>

              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                資料收集與使用聲明
              </Typography>

              <Typography variant="body2" paragraph>
                在您進行面試準備過程中，我們將會收集以下資訊：
              </Typography>

              <Typography variant="body2" component="div">
                <ul>
                  <li>面試模擬過程的錄影內容</li>
                  <li>您的語音及回答內容</li>
                  <li>表情和肢體語言的視覺資料</li>
                </ul>
              </Typography>

              <Typography variant="body2" paragraph>
                這些資料將用於：
              </Typography>

              <Typography variant="body2" component="div">
                <ul>
                  <li>提供面試表現的分析和反饋</li>
                  <li>改善您的面試技巧</li>
                  <li>生成個人化的建議報告</li>
                </ul>
              </Typography>

              <Typography variant="body2" paragraph>
                您的資料安全對我們至關重要。所有收集的資料將依照我們的隱私政策進行加密存儲，且不會未經您的同意分享給第三方。您可以隨時要求刪除您的錄影資料。
              </Typography>
            </Box>

            <FormControlLabel
              control={
                <Checkbox
                  checked={consentGiven}
                  onChange={(e) => setConsentGiven(e.target.checked)}
                  color="primary"
                />
              }
              label="我已閱讀並同意上述資料收集與使用聲明"
            />
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>取消</Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color="primary"
          disabled={!consentGiven}
        >
          開始準備
        </Button>
      </DialogActions>
    </Dialog>
  );
}
