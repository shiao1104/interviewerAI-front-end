import {
  Logout,
  Person,
} from "@mui/icons-material";
import {
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  List,
  ListItem,
} from "@mui/material";
import { useEffect, useState } from "react";
import styles from "@/styles/components/layout/manage/Navbar.module.scss";
import { useRouter } from "next/router";
import { NavbarData } from "@/lib/data/navbarData";

export default function Navbar() {
  const router = useRouter();
  const [name, setName] = useState<string | null>();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  useEffect(() => {
    setName(sessionStorage.getItem("name"));
  }, []);

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
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
    <section className={styles.header}>
      <List className={styles.listWrap}>
        {NavbarData.map((item, index) => (
          <ListItem
            key={index}
            onClick={() => router.push(item.path)}
            className={styles.listItem}
          >
            {item.icon && <item.icon />}
            {item.name}
          </ListItem>
        ))}
      </List>

      <div className={styles.headerActions}>
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
    </section>
  );
}
