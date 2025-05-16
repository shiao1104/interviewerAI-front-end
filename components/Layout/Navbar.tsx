import {
  NotificationsActive,
  Settings,
  Logout,
  Person,
} from "@mui/icons-material";
import {
  Avatar,
  Badge,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  List,
  ListItem,
  Toolbar,
} from "@mui/material";
import { useEffect, useState } from "react";
import styles from "@/styles/components/layout/Navbar.module.scss";
import { useRouter } from "next/router";

export default function Navbar() {
  const router = useRouter();
  const [notifications] = useState([
    {
      id: 1,
      title: "面試提醒",
      message:
        "明天下午 2:00 您有一場與 ABC 公司的面試明天下午 2:00 您有一場與 ABC 公司的面試",
      time: "1 小時前",
    },
    {
      id: 2,
      title: "新訊息",
      message: "人力資源部門向您發送了一條新訊息",
      time: "3 小時前",
    },
    {
      id: 3,
      title: "面試更新",
      message: "您的面試地點已更新，請查看詳情",
      time: "昨天",
    },
  ]);
  const [name, setName] = useState<string | null>();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationAnchorEl, setNotificationAnchorEl] =
    useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);
  const notificationOpen = Boolean(notificationAnchorEl);

  useEffect(() => {
    setName(sessionStorage.getItem("name"));
  }, []);

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationClick = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleLogout = () => {
    sessionStorage.clear();
    handleClose();
    router.push("/login");
  };

  const handleViewProfile = () => {
    handleClose();
  };

  return (
    <Toolbar
      sx={{
        display: "flex",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        alignItems: "center",
        borderBottom: "1px solid #ccc",
        height: "90px",
        background: "#fff",
        zIndex: 999,
      }}
    >
      <div>
        <Typography variant="h4">
          您好，{name}
        </Typography>
        <Typography variant="subtitle1">
          今天是準備面試的好日子！您有 2 個即將到來的面試。
        </Typography>
      </div>
      <div className={styles.headerActions}>
        <IconButton className={styles.actionButton}>
          <Settings />
        </IconButton>
        <IconButton
          className={styles.actionButton}
          onClick={handleNotificationClick}
          aria-controls={notificationOpen ? "notification-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={notificationOpen ? "true" : undefined}
        >
          <Badge badgeContent={notifications.length} color="error">
            <NotificationsActive />
          </Badge>
        </IconButton>
        <Menu
          id="notification-menu"
          anchorEl={notificationAnchorEl}
          open={notificationOpen}
          onClose={handleNotificationClose}
          PaperProps={{
            elevation: 4,
            className: styles.notificationPaper,
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <Box className={styles.notificationHeader}>
            <NotificationsActive />
            <Typography variant="h6">通知</Typography>
          </Box>
          <Divider />
          <List className={styles.notificationList}>
            {notifications.map((notification) => (
              <div key={notification.id}>
                <ListItem className={styles.notificationItem}>
                  <Box className={styles.notificationContent}>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography
                        variant="subtitle2"
                        className={styles.notificationTitle}
                      >
                        {notification.title}
                      </Typography>

                      <Typography
                        variant="caption"
                        className={styles.notificationTime}
                      >
                        {notification.time}
                      </Typography>
                    </Box>
                    <Typography
                      variant="body2"
                      className={styles.notificationMessage}
                    >
                      {notification.message}
                    </Typography>
                  </Box>
                </ListItem>
              </div>
            ))}
          </List>
        </Menu>
        <Avatar
          className={styles.userAvatar}
          onClick={handleAvatarClick}
          aria-controls={open ? "account-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          {name?.split("")[0]}
        </Avatar>
        <Menu
          id="account-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 4,
            className: styles.menuPaper,
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <MenuItem onClick={handleViewProfile} className={styles.menuItem}>
            <ListItemIcon>
              <Person fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="個人檔案" />
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout} className={styles.menuItem}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="登出" />
          </MenuItem>
        </Menu>
      </div>
    </Toolbar>
  );
}
