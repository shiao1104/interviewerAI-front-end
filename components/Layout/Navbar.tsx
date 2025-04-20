import { NotificationsActive, Settings } from "@mui/icons-material";
import { Avatar, Badge, IconButton, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import styles from "@/styles/components/layout/Navbar.module.scss";

export default function Navbar() {
  const [notifications] = useState(3);
  const [name, setName] = useState<string | null>();

  useEffect(() => {
    setName(sessionStorage.getItem("name"));
  }, []);

  return (
    <section className={styles.header}>
      <div className={styles.welcomeSection}>
        <Typography variant="h4" className={styles.welcomeText}>
          您好，{name}
        </Typography>
        <Typography variant="subtitle1" className={styles.welcomeSubtext}>
          今天是準備面試的好日子！您有 2 個即將到來的面試。
        </Typography>
      </div>
      <div className={styles.headerActions}>
        <IconButton className={styles.actionButton}>
          <Settings />
        </IconButton>
        <IconButton className={styles.actionButton}>
          <Badge badgeContent={notifications} color="error">
            <NotificationsActive />
          </Badge>
        </IconButton>
        <Avatar className={styles.userAvatar}>{name?.split('')[0]}</Avatar>
      </div>
    </section>
  );
}
