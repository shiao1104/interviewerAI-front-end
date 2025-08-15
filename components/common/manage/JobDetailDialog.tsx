// components/common/JobDetailDialog.tsx
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
  Chip,
  Paper,
  Grid,
} from "@mui/material";
import { Work, Close } from "@mui/icons-material";
import { getStatueColor } from "@/lib/hook/getStatueColor";

interface JobDetailDialogProps {
  open: boolean;
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  type?: string;
}

export default function JobDetailDialog({
  open,
  onClose,
  data,
  type,
}: JobDetailDialogProps) {
  if (!data) return null;

  const openingInfo = [
    { label: "職缺名稱", value: data.opening_name },
    { label: "工作地點", value: data.workplace_location },
    { label: "工作類型", value: data.employment_type },
    { label: "工作內容說明", value: data.opening_info }
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: "primary.main",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Work />
          <Typography variant="h6" component="div">
            {type == "opening" ? "職缺詳細資訊" : "職位詳細資訊"}
          </Typography>
        </Box>
        <Button onClick={onClose} sx={{ color: "white", minWidth: "auto" }}>
          <Close />
        </Button>
      </DialogTitle>

      <DialogContent sx={{ p: 3, bgcolor: "#f8f8f8" }}>
        <Paper
          elevation={2}
          sx={{
            p: 3,
            borderRadius: 2,
            backgroundColor: "#fff",
            mb: 3,
            mt: "2rem",
          }}
        >
          {/* 職缺資訊區塊 */}
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            職缺資訊
          </Typography>

          {/* 基本資訊 - 3欄排列 */}
          <Grid
            container
            spacing={3}
            sx={{
              mb: 3,
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 2,
            }}
          >
            {openingInfo.slice(0, 3).map((item) => (
              <Box key={item.label}>
                <Typography
                  variant="subtitle2"
                  color="textSecondary"
                  sx={{ fontWeight: 600, mb: 0.5 }}
                >
                  {item.label}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {item.value || "—"}
                </Typography>
              </Box>
            ))}
          </Grid>
          <Grid
            container
            spacing={3}
            sx={{
              mb: 3,
              display: "grid",
              gap: 2,
            }}
          >
            {openingInfo.slice(3).map((item) => (
              <Box key={item.label}>
                <Typography
                  variant="subtitle2"
                  color="textSecondary"
                  sx={{ fontWeight: 600, mb: 0.5 }}
                >
                  {item.label}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {item.value || "—"}
                </Typography>
              </Box>
            ))}
          </Grid>
        </Paper>
      </DialogContent>

      <DialogActions sx={{ p: 2, justifyContent: "center" }}>
        <Button
          variant="contained"
          onClick={onClose}
          sx={{ borderRadius: "8px" }}
        >
          關閉視窗
        </Button>
      </DialogActions>
    </Dialog>
  );
}
