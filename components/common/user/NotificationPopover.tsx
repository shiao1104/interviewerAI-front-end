import { Popover, Typography, Box, Divider } from "@mui/material";

interface NotificationPopoverProps {
  anchorEl: null | HTMLElement;
  open: boolean;
  onClose: () => void;
}

const notifications = [
  {
    title: "📝 面試確認通知",
    content: "您與「科技未來有限公司」的面試已確認",
    time: "1 小時前",
  },
  {
    title: "📩 面試回饋已送達",
    content: "「網路應用服務」已提供您面試回饋",
    time: "1 天前",
  },
  {
    title: "🛠️ 系統更新通知",
    content: "系統已更新模擬面試功能，包含更多行業問題",
    time: "2 天前",
  },
];

export default function NotificationPopover({
  anchorEl,
  open,
  onClose,
}: NotificationPopoverProps) {
  return (
    <Popover
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      PaperProps={{
        sx: {
          width: 320,
          p: 2,
          borderRadius: 3,
          boxShadow: 4,
          backgroundColor: "white",
        },
      }}
    >
      <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mb: 1,
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            通知與提醒
          </Typography>
          <Typography
            variant="body2"
            color="primary"
            sx={{ cursor: "pointer" }}
          >
            標記全部為已讀
          </Typography>
        </Box>
        {notifications.map((item, index) => (
          <Box
            key={index}
            sx={{ mb: index < notifications.length - 1 ? 2 : 0 }}
          >
            <Typography variant="subtitle1" fontWeight="bold">
              {item.title}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {item.content}
            </Typography>
            <Typography variant="caption" sx={{ color: "gray" }}>
              {item.time}
            </Typography>
            {index < notifications.length - 1 && <Divider sx={{ mt: 1.5 }} />}
          </Box>
        ))}
      </Box>
    </Popover>
  );
}
