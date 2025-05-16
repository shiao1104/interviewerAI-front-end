import Head from "next/head";
import styles from "@/styles/components/layout/Layout.module.scss";
import { Avatar, Box, IconButton, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { NotificationsActive, Settings } from "@mui/icons-material";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [name, setName] = useState<string | null>();

  useEffect(() => {
    setName(sessionStorage.getItem("name"));
  }, []);

  return (
    <div className={styles.layoutContainer}>
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
        <link rel="icon" href="/logo.ico" />
      </Head>
      
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
            <div className={styles.logoEffect}></div>
            <Typography variant="h5" className={styles.logo}>AI面試官</Typography>
          </div>
          <Typography variant="h4" className={styles.greeting}>您好，{name}</Typography>
          <Typography variant="subtitle1" className={styles.subtitle}>
            今天是準備面試的好日子！您有 <span className={styles.highlight}>2</span> 個即將到來的面試。
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <IconButton className={styles.iconButton}>
            <Settings />
          </IconButton>
          <IconButton className={styles.actionButton}>
            <NotificationsActive />
          </IconButton>
          <Avatar className={styles.userAvatar}>{name?.split("")[0]}</Avatar>
        </Box>
      </Box>
      
      <main className={styles.layout}>
        <article className={styles.contentArea}>
          <div className={styles.contentGlow}></div>
          {children}
        </article>
      </main>
    </div>
  );
}