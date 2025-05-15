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

interface JobDetailDialogProps {
  open: boolean;
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any; // 建議用正式 JobType 取代 any
}

export default function JobDetailDialog({
  open,
  onClose,
  data,
}: JobDetailDialogProps) {
  if (!data) return null;

  // 把欄位分組顯示，增加可讀性
  const basicInfo = [
    { label: "職位名稱", value: data.position },
    { label: "公司名稱", value: data.company },
    { label: "工作待遇", value: data.salary },
    { label: "上班地點", value: data.location },
    { label: "職務類別", value: data.category },
    { label: "職缺狀態", value: data.status },
  ];

  const jobRequirements = [
    { label: "學歷要求", value: data.education },
    { label: "科系限制", value: data.departmentLimit || "不限" },
    { label: "工作經驗", value: data.experience },
    { label: "語文條件", value: data.languages || "未要求" },
    {
      label: "擅長工具 / 技能條件",
      value: data.skills?.length ? (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
          {data.skills.map((skill: string) => (
            <Chip
              key={skill}
              label={skill}
              sx={{
                borderRadius: "8px",
                padding: "0 8px",
              }}
            />
          ))}
        </Box>
      ) : (
        "未指定"
      ),
    },
  ];

  const workConditions = [
    { label: "工作性質", value: data.jobType },
    { label: "上班時段", value: data.workHours },
    { label: "休假制度", value: data.leavePolicy },
    { label: "管理責任", value: data.management || "無" },
  ];

  const otherInfo = [
    { label: "工作內容說明", value: data.description },
    { label: "聯絡方式 / 投遞方式", value: data.contact },
    { label: "建立日期", value: data.createDate },
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
            職位詳細資訊
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
            mt: '2rem'
          }}
        >
          {/* 基本資訊區塊 */}
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            基本職缺資訊
          </Typography>

          <Grid
            container
            sx={{
              mb: "1rem",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            {basicInfo.map((item) => (
              <Box key={item.label} sx={{ mb: 1 }}>
                <Typography
                  variant="subtitle2"
                  color="textSecondary"
                  fontWeight={500}
                >
                  {item.label}
                </Typography>
                <Typography variant="body1">{item.value || "—"}</Typography>
              </Box>
            ))}
          </Grid>
        </Paper>

        <Paper
          elevation={2}
          sx={{
            p: 3,
            borderRadius: 2,
            backgroundColor: "#fff",
            mb: 3,
          }}
        >
          {/* 應徵條件區塊 */}
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            應徵條件
          </Typography>

          <Grid
            container
            sx={{
              mb: "1rem",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            {jobRequirements.map((item) => (
              <Box
                key={item.label}
                sx={{
                  mb: 1,
                  // 如果是技能項目，則佔據整行
                  gridColumn: item.label.includes("技能") ? "span 2" : "auto",
                }}
              >
                <Typography
                  variant="subtitle2"
                  color="textSecondary"
                  fontWeight={500}
                >
                  {item.label}
                </Typography>
                <Typography variant="body1">{item.value || "—"}</Typography>
              </Box>
            ))}
          </Grid>
        </Paper>

        <Paper
          elevation={2}
          sx={{
            p: 3,
            borderRadius: 2,
            backgroundColor: "#fff",
            mb: 3,
          }}
        >
          {/* 工作條件區塊 */}
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            工作條件
          </Typography>

          <Grid
            container
            sx={{
              mb: "1rem",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            {workConditions.map((item) => (
              <Box key={item.label} sx={{ mb: 1 }}>
                <Typography
                  variant="subtitle2"
                  color="textSecondary"
                  fontWeight={500}
                >
                  {item.label}
                </Typography>
                <Typography variant="body1">{item.value || "—"}</Typography>
              </Box>
            ))}
          </Grid>
        </Paper>

        <Paper
          elevation={2}
          sx={{
            p: 3,
            borderRadius: 2,
            backgroundColor: "#fff",
          }}
        >
          {/* 其他資訊區塊 */}
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            詳細說明與聯絡資訊
          </Typography>

          {otherInfo.map((item) => (
            <Box key={item.label} sx={{ mb: 2 }}>
              <Typography
                variant="subtitle2"
                color="textSecondary"
                fontWeight={500}
              >
                {item.label}
              </Typography>
              <Typography
                variant="body1"
                sx={{ mt: 0.5, whiteSpace: "pre-wrap" }}
              >
                {item.value || "—"}
              </Typography>
              <Divider sx={{ mt: 2 }} />
            </Box>
          ))}
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
