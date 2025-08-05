import Head from "next/head";
import styles from "@/styles/components/layout/Layout.module.scss";
import {
  Avatar,
  Box,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import { useEffect, useState } from "react";
import { NotificationsActive, Settings } from "@mui/icons-material";
import NotificationPopover from "../common/user/NotificationPopover";
import { useRouter } from "next/router";
import Image from "next/image";
import logo from "@/public/image/logo (1).png";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [name, setName] = useState<string | null>();
  const [profileAnchor, setProfileAnchor] = useState<null | HTMLElement>(null);
  const [notifAnchor, setNotifAnchor] = useState<null | HTMLElement>(null);

  useEffect(() => {
    setName(sessionStorage.getItem("name"));
  }, []);

  const handleNotifClick = (event: React.MouseEvent<HTMLElement>) => {
    setNotifAnchor(event.currentTarget);
  };

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setProfileAnchor(event.currentTarget);
  };

  const handleNotifClose = () => setNotifAnchor(null);
  const handleProfileClose = () => setProfileAnchor(null);

  return (
    <div className={styles.layoutContainer}>
      {/* 背景效果 + Head */}
      <div className={styles.backgroundEffect}>
        <div className={styles.gradientCircle}></div>
        <div className={styles.gradientCircleSecond}></div>
        <div className={styles.gridLines}></div>
        <div className={styles.dotsPattern}></div>
      </div>

      <Head>
        <title>AI面試官</title>
        <meta charSet="UTF-8" />
        <meta name="description" content="NTUB IMD BIRC CMS" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/logo_2.png" />
      </Head>

      {/* 頁首 */}
      <Box
        className={styles.header}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          padding: "2rem 4rem",
          position: "relative",
          zIndex: 2,
        }}
      >
        <Box className={styles.headerLeft}>
          <div className={styles.logoWrapper}>
            <Typography variant="h5" sx={{ cursor: 'pointer' }}>
              <Image src={logo} alt="Logo" width={200} onClick={() => router.push('/user')} />
            </Typography>
          </div>
          <Typography variant="subtitle1" className={styles.subtitle}>
            今天是準備面試的好日子！您有{" "}
            <span className={styles.highlight}>2</span> 個即將到來的面試。
          </Typography>
        </Box>

        {/* 右側按鈕群 */}
        <Box sx={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <IconButton onClick={handleNotifClick}>
            <NotificationsActive />
          </IconButton>
          <NotificationPopover
            anchorEl={notifAnchor}
            open={Boolean(notifAnchor)}
            onClose={handleNotifClose}
          />

          <IconButton onClick={handleProfileClick}>
            <Avatar className={styles.userAvatar}>{name?.split("")[0]}</Avatar>
          </IconButton>
          <Menu
            anchorEl={profileAnchor}
            open={Boolean(profileAnchor)}
            onClose={handleProfileClose}
            PaperProps={{
              sx: {
                mt: 1,
                minWidth: 160,
                borderRadius: 2,
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                backdropFilter: "blur(10px)",
                boxShadow: 3,
              },
            }}
          >
            <MenuItem disabled>👤 {name}</MenuItem>
            <Divider />
            <MenuItem onClick={() => router.push('/user/profile')}>
              查看個人檔案
            </MenuItem>
            <MenuItem onClick={() => router.push('/login')}>登出</MenuItem>
          </Menu>
        </Box>
      </Box>

      {/* 主要內容 */}
      <main className={styles.layout}>
        <article className={styles.contentArea}>
          <div className={styles.contentGlow}></div>
          {children}
        </article>
      </main>
    </div>
  );
}
