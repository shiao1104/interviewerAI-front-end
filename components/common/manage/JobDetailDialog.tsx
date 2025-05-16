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
    { label: "職缺名稱", value: data.openingTitle },
    { label: "需求人數", value: data.headCount },
    {
      label: "職缺狀態",
      value: (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
          <Chip
            label={data.status}
            color={getStatueColor(data.status)}
            size="small"
          />
        </Box>
      ),
    },
    { label: "薪資範圍", value: data.salaryRange },
    { label: "工作地點", value: data.workLocation },
    { label: "工作類型", value: data.jobType },
  ];

  const basicInfo = [
    { label: "職位名稱", value: data.position },
    { label: "薪資範圍", value: data.salaryRange },
    { label: "工作地點", value: data.workLocation },
    { label: "工作類型", value: data.jobType },
  ];

  const jobRequirements = [
    { label: "學歷要求", value: data.educationRequirement },
    { label: "科系限制", value: data.departmentRequirement || "不限" },
    { label: "工作經驗", value: data.experienceRequirement },
    { label: "語文條件", value: data.languageRequirement || "未要求" },
    {
      label: "擅長工具 / 技能條件",
      value: data.skills?.length ? (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
          {data.skills.map((skill: string) => (
            <Chip
              key={skill}
              label={skill}
              sx={{ borderRadius: "8px", padding: "0 8px" }}
            />
          ))}
        </Box>
      ) : (
        "未指定"
      ),
    },
  ];

  const workConditions = [
    { label: "工作性質", value: data.workNature },
    { label: "上班時段", value: data.workHours?.join("、") },
    { label: "休假制度", value: data.leavePolicy },
  ];

  const otherInfo = [
    { label: "工作內容說明", value: data.jobDescription },
    { label: "聯絡方式 / 投遞方式", value: data.contactInfo },
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
            {type == "opening" ? "職缺詳細資訊" : "職位詳細資訊"}
          </Typography>
        </Box>
        <Button onClick={onClose} sx={{ color: "white", minWidth: "auto" }}>
          <Close />
        </Button>
      </DialogTitle>

      <DialogContent sx={{ p: 3, bgcolor: "#f8f8f8" }}>
        {type == "opening" && (
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
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              職缺資訊
            </Typography>

            <Grid
              container
              sx={{
                mb: "1rem",
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: "1rem",
              }}
            >
              {openingInfo.map((item) => (
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
        )}

        {type !== "opening" && (
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
            {/* 基本資訊區塊 */}
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              基本資訊
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
        )}
        
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
              gridTemplateColumns: "1fr 1fr 1fr",
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
