import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import AppTheme from "@/styles/theme/AppTheme";
import Image from "next/image";
import Logo from "@/public/image/logo (1).png";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { GoogleUser } from "@/lib/types/googleUser";
import ForgotPassword from "@/components/common/ForgotPassword";
import { jwtDecode } from "jwt-decode";
import styles from "@/styles/pages/Login.module.scss";
import UserAPI from "@/lib/api/UserAPI";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";

interface LoginFormInputs {
  email: string;
  password: string;
}

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  [theme.breakpoints.up("sm")]: {
    maxWidth: "450px",
  },
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
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
    ...theme.applyStyles("dark", {
      backgroundImage:
        "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
    }),
  },
}));

export default function SignIn(props: { disableCustomTheme?: boolean }) {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const [isClient, setIsClient] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onSubmit = async (data: LoginFormInputs) => {
    const dataList = {
      username: data.email,
      password: data.password,
    };

    try {
      const response = await UserAPI.access(dataList);
      if (response.data && response.data.access) {
        sessionStorage.setItem("token", response.data.access);
        toast.success("登入成功", {
          position: "top-center",
          autoClose: 1500,
          hideProgressBar: true,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        router.push("/");
      } else {
        toast.error("登入失敗：無法取得存取權杖", {
          position: "top-center",
          autoClose: 1500,
          hideProgressBar: true,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    } catch {
      toast.error("登入失敗", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const googleLogin = (credentialResponse: CredentialResponse) => {
    if (credentialResponse.credential) {
      const decoded: GoogleUser = jwtDecode(credentialResponse.credential);
      console.log("登入成功:", decoded);
      sessionStorage.setItem("google_token", "sssssssssssssssss");
      sessionStorage.setItem("name", decoded.name);
      sessionStorage.setItem("email", decoded.email);
      router.push("/");
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
            登入
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              gap: 2,
            }}
          >
            <FormControl>
              <FormLabel htmlFor="email">帳號</FormLabel>
              <TextField
                id="email"
                type="email"
                placeholder="your@email.com"
                autoComplete="email"
                autoFocus
                required
                fullWidth
                variant="outlined"
                error={!!errors.email}
                helperText={errors.email?.message}
                {...register("email", {
                  required: "請輸入您的Email",
                  pattern: {
                    // value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Email 格式錯誤",
                  },
                })}
              />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="password">密碼</FormLabel>
              <TextField
                id="password"
                type="password"
                placeholder="••••••"
                autoComplete="current-password"
                required
                fullWidth
                variant="outlined"
                error={!!errors.password}
                helperText={errors.password?.message}
                {...register("password", {
                  // required: "請輸入密碼",
                  // minLength: {
                  //   value: 6,
                  //   message: "密碼至少6位數以上",
                  // },
                  // pattern: {
                  //   value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).+$/,
                  //   message: "密碼需包含大小寫字母與符號",
                  // },
                })}
              />
            </FormControl>

            <ForgotPassword open={open} handleClose={handleClose} />

            <Button type="submit" fullWidth variant="contained">
              登入
            </Button>

            <Link
              component="button"
              type="button"
              onClick={handleClickOpen}
              variant="body2"
              sx={{ alignSelf: "center" }}
            >
              忘記密碼?
            </Link>
          </Box>
          <Divider>or</Divider>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {isClient && (
              <GoogleLogin
                onSuccess={(credentialResponse) =>
                  googleLogin(credentialResponse)
                }
                onError={() => {
                  console.log("登入失敗");
                }}
              />
            )}
            <Typography sx={{ textAlign: "center" }}>
              還沒有註冊嗎?{" "}
              <Link
                href="/sign-up"
                variant="body2"
                sx={{ alignSelf: "center" }}
              >
                註冊
              </Link>
            </Typography>
          </Box>
        </Card>
      </SignInContainer>
    </AppTheme>
  );
}
