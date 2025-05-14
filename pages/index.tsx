import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import AppTheme from "@/styles/theme/AppTheme";
import Image from "next/image";
import Logo from "@/public/image/logo (1).png";
import styles from "@/styles/pages/Login.module.scss";
import { useRouter } from "next/router";
import { useState } from "react";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  [theme.breakpoints.up("sm")]: {
    maxWidth: "550px",
  },
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  height: "calc((1 - var(--template-frame-height, 0)) * 100dvh)",
  minHeight: "100%",
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
  "&::before": {
    content: '""',
    display: "block",
    position: "absolute",
    zIndex: -1,
    inset: 0,
    backgroundImage:
      "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
    backgroundRepeat: "no-repeat",
  },
}));

const ToggleButton = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  gap: theme.spacing(2),
  padding: theme.spacing(1.5),
  borderRadius: "16px",
  background: "rgba(255, 255, 255, 0.05)",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  boxShadow: "0 0 10px rgba(0, 255, 255, 0.2), 0 0 20px rgba(0, 255, 255, 0.1)",
  margin: "1rem 0",

  "& button": {
    flex: 1,
    padding: theme.spacing(6),
    borderRadius: "12px",
    backgroundColor: "transparent",
    border: "1px solid transparent",
    color: theme.palette.text.primary,
    transition: "all 0.3s ease",
    fontWeight: 600,
    letterSpacing: "1px",
    "&:hover": {
      backgroundColor: "rgba(0,255,255,0.05)",
      borderColor: "rgba(0,255,255,0.3)",
    },
  },

  "& .selected": {
    background:
      "linear-gradient(135deg, rgba(0,255,255,0.2), rgba(0,100,255,0.3))",
    border: "1px solid rgba(0,255,255,0.6)",
    boxShadow: "0 0 5px rgba(0,255,255,0.4), 0 0 15px rgba(0,100,255,0.3)",
    color: theme.palette.primary.main,
  },
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  padding: theme.spacing(1.5),
  borderRadius: "12px",
  fontWeight: 600,
  letterSpacing: "0.5px",
  background: "#1976d2", // 主藍色
  color: "#fff",
  boxShadow: "0 4px 10px rgba(25, 118, 210, 0.2)",
  transition: "all 0.3s ease",
  "&:hover": {
    background: "#1565c0",
    boxShadow: "0 6px 12px rgba(21, 101, 192, 0.3)",
  },
}));

export default function SignIn(props: { disableCustomTheme?: boolean }) {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState("");

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRole === "user") {
      router.push("/user");
    } else if (selectedRole === "manage") {
      router.push("/manage");
    }
  };

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <SignInContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <Box className={styles.iconWrap} sx={{ textAlign: "center" }}>
            <Image src={Logo} alt="" width={150} />
          </Box>
          <Typography
            component="h1"
            variant="h4"
            sx={{
              width: "100%",
              fontSize: "clamp(2rem, 10vw, 2.15rem)",
              textAlign: "center",
            }}
          >
            請選擇身分
          </Typography>
          <ToggleButton>
            <Button
              className={selectedRole === "user" ? "selected" : ""}
              onClick={() => handleRoleSelect("user")}
              type="button"
            >
              面試者身分
            </Button>
            <Button
              className={selectedRole === "manage" ? "selected" : ""}
              onClick={() => handleRoleSelect("manage")}
              type="button"
            >
              面試官身分
            </Button>
          </ToggleButton>

          <SubmitButton
            type="submit"
            fullWidth
            variant="contained"
            onClick={(e) => handleSubmit(e)}
          >
            確定
          </SubmitButton>
        </Card>
      </SignInContainer>
    </AppTheme>
  );
}
