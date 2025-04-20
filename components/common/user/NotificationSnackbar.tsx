import { Snackbar, Alert } from "@mui/material";

interface NotificationSnackbarProps {
  open: boolean;
  message: string;
  severity: "success" | "info" | "warning" | "error";
  onClose: () => void;
}

export function NotificationSnackbar({
  open,
  message,
  severity,
  onClose,
}: NotificationSnackbarProps) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert onClose={onClose} severity={severity}>
        {message}
      </Alert>
    </Snackbar>
  );
}
