import { Backdrop, CircularProgress, Box, Typography } from "@mui/material";

interface PermissionCheckingBackdropProps {
  open: boolean;
}

export function PermissionCheckingBackdrop({
  open,
}: PermissionCheckingBackdropProps) {
  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={open}
    >
      <Box display="flex" flexDirection="column" alignItems="center">
        <CircularProgress color="inherit" />
        <Typography variant="body1" sx={{ mt: 2 }}>
          正在檢查媒體權限...
        </Typography>
      </Box>
    </Backdrop>
  );
}
