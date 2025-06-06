import Head from "next/head";
import { Menu, MenuOpen, ExitToApp } from "@mui/icons-material";
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  Toolbar,
  Button,
} from "@mui/material";
import Logo from "@/public/image/logo (1).png";
import Image from "next/image";
import { NavbarData } from "@/lib/data/navbarData";
import { useState } from "react";
import { useRouter } from "next/router";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    if (confirm('確定要登出嗎？')) {
      sessionStorage.clear();
      router.push('/login');
    }
  };

  return (
    <>
      <Head>
        <title>InterviewAI 公司端</title>
        <meta charSet="UTF-8" />
        <meta name="description" content="NTUB IMD BIRC CMS" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/logo_2.png" />
      </Head>
      <main>
        <section>
          <Toolbar
            sx={{
              position: "sticky",
              top: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between", // 讓左右兩邊對齊
              borderBottom: "1px solid #ccc",
              height: "64px",
              background: "#fff",
              zIndex: 999,
            }}
          >
            {/* 左側：選單按鈕和 Logo */}
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton
                onClick={() => setOpen(!open)}
                sx={{
                  borderRadius: "50%",
                  padding: 1,
                  marginRight: 1,
                }}
              >
                {open ? <MenuOpen /> : <Menu />}
              </IconButton>
              <Image src={Logo} alt="interview AI" width={140} />
            </Box>

            {/* 右側：登出按鈕 */}
            <IconButton
              onClick={handleLogout}
              color="error"
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 500,
                px: 2,
              }}
            >
              <ExitToApp />
            </IconButton>
          </Toolbar>

          <Box>
            <Drawer
              variant="persistent"
              anchor="left"
              open={open}
              sx={{
                width: 240,
                flexShrink: 0,
                "& .MuiDrawer-paper": {
                  width: 240,
                  top: "65px", // Toolbar 下方
                  height: "calc(100% - 65px)",
                  boxSizing: "border-box",
                },
              }}
            >
              <List>
                {NavbarData.map((item, index) => {
                  const isActive = router.pathname === item.path;

                  return (
                    <ListItem key={index} disablePadding>
                      <ListItemButton
                        onClick={() => router.push(item.path)}
                        selected={isActive}
                        sx={{
                          px: 2.5,
                          py: 1.5,
                          borderRadius: 2,
                          mx: 1,
                          my: 0.5,
                          color: isActive ? "#1976d2" : "#555",
                          backgroundColor: isActive ? "#e3f2fd" : "transparent",
                          "&:hover": {
                            backgroundColor: "#f5f5f5",
                          },
                        }}
                      >
                        <Box
                          sx={{
                            minWidth: 32,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            mr: 2,
                            color: isActive ? "#1976d2" : "#888",
                          }}
                        >
                          <item.icon fontSize="small" />
                        </Box>
                        {item.name}
                      </ListItemButton>
                    </ListItem>
                  );
                })}
              </List>
            </Drawer>

            <article
              style={{
                marginLeft: open ? 240 : 0, // 當 Drawer 展開時，右側內容往右推
                transition: "margin 0.3s ease",
              }}
            >
              {children}
            </article>
          </Box>
        </section>
      </main>
    </>
  );
}