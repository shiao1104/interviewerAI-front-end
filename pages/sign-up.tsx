import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import AppTheme from "@/styles/theme/AppTheme";
import Image from "next/image";
import Logo from "@/public/image/logo (1).png";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "@/styles/pages/Login.module.scss";
import UserAPI from "@/lib/api/UserAPI";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";

interface SignUpFormInputs {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  verificationCode: string;
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

const SignUpContainer = styled(Stack)(({ theme }) => ({
  // height: "calc((1 - var(--template-frame-height, 0)) * 100dvh)",
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

export default function SignUp(props: { disableCustomTheme?: boolean }) {
  const router = useRouter();
  const [isClient, setIsClient] = React.useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    getValues,
  } = useForm<SignUpFormInputs>();

  const password = watch("password");

  useEffect(() => {
    setIsClient(true);
  }, []);

  // 倒數計時器
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [countdown]);

  // 發送email驗證碼
  const sendVerificationCode = async () => {
    const email = getValues("email");
    if (!email) {
      toast.error("請先輸入Email", {
        position: "top-center",
        autoClose: 1500,
      });
      return;
    }

    try {
      // 調用後端API發送驗證碼
      await UserAPI.sendVerificationCode({ to_email: email, subject: '123', message: '這是一封測試信件' });
      setVerificationSent(true);
      setCountdown(60); // 60秒倒數
      toast.success("驗證碼已發送至您的Email", {
        position: "top-center",
        autoClose: 2000,
      });
    } catch (error) {
      toast.error("發送驗證碼失敗，請稍後再試", {
        position: "top-center",
        autoClose: 1500,
      });
    }
  };

  // 驗證email驗證碼
  const verifyEmail = async () => {
    const email = getValues("email");
    const code = getValues("verificationCode");
    
    if (!email || !code) {
      toast.error("請輸入Email和驗證碼", {
        position: "top-center",
        autoClose: 1500,
      });
      return;
    }

    try {
      // 調用後端API驗證驗證碼
      await UserAPI.verifyEmail({ email, code });
      setIsEmailVerified(true);
      toast.success("Email驗證成功", {
        position: "top-center",
        autoClose: 1500,
      });
    } catch (error) {
      toast.error("驗證碼錯誤或已過期", {
        position: "top-center",
        autoClose: 1500,
      });
    }
  };

  const onSubmit = async (data: SignUpFormInputs) => {
    if (!isEmailVerified) {
      toast.error("請先完成Email驗證", {
        position: "top-center",
        autoClose: 1500,
      });
      return;
    }

    const registrationData = {
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      password: data.password,
      verification_code: data.verificationCode,
    };

    try {
      const response = await UserAPI.register(registrationData);
      toast.success("註冊成功！請登入", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      router.push("/login");
    } catch (error) {
      toast.error("註冊失敗，請檢查資料後重試", {
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

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <SignUpContainer direction="column" justifyContent="space-between">
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
            註冊
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
            {/* 姓名欄位 */}
            <Grid container spacing={2} sx={{display: 'grid', gridTemplateColumns: '1fr 1fr'}}>
              <Grid>
                <FormControl fullWidth>
                  <FormLabel htmlFor="lastName">姓氏</FormLabel>
                  <TextField
                    id="lastName"
                    placeholder="王"
                    autoComplete="family-name"
                    required
                    fullWidth
                    variant="outlined"
                    error={!!errors.lastName}
                    helperText={errors.lastName?.message}
                    {...register("lastName", {
                      required: "請輸入您的姓氏",
                      minLength: {
                        value: 1,
                        message: "姓氏不能為空",
                      },
                    })}
                  />
                </FormControl>
              </Grid>
              <Grid>
                <FormControl fullWidth>
                  <FormLabel htmlFor="firstName">名字</FormLabel>
                  <TextField
                    id="firstName"
                    placeholder="小明"
                    autoComplete="given-name"
                    required
                    fullWidth
                    variant="outlined"
                    error={!!errors.firstName}
                    helperText={errors.firstName?.message}
                    {...register("firstName", {
                      required: "請輸入您的名字",
                      minLength: {
                        value: 1,
                        message: "名字不能為空",
                      },
                    })}
                  />
                </FormControl>
              </Grid>
            </Grid>

            {/* Email欄位 */}
            <FormControl>
              <FormLabel htmlFor="email">Email (帳號)</FormLabel>
              <TextField
                id="email"
                type="email"
                placeholder="your@email.com"
                autoComplete="email"
                required
                fullWidth
                variant="outlined"
                error={!!errors.email}
                helperText={errors.email?.message}
                disabled={isEmailVerified}
                {...register("email", {
                  required: "請輸入您的Email",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Email 格式錯誤",
                  },
                })}
              />
            </FormControl>

            {/* 驗證碼欄位 */}
            <FormControl>
              <FormLabel htmlFor="verificationCode">驗證碼</FormLabel>
              <Box sx={{ display: "flex", gap: 1 }}>
                <TextField
                  id="verificationCode"
                  placeholder="請輸入6位數驗證碼"
                  required
                  fullWidth
                  variant="outlined"
                  error={!!errors.verificationCode}
                  helperText={errors.verificationCode?.message}
                  disabled={isEmailVerified}
                  {...register("verificationCode", {
                    required: "請輸入驗證碼",
                    pattern: {
                      value: /^\d{6}$/,
                      message: "驗證碼為6位數字",
                    },
                  })}
                />
                {!isEmailVerified && (
                  <Button
                    variant="outlined"
                    onClick={sendVerificationCode}
                    disabled={countdown > 0}
                    sx={{ minWidth: "120px", whiteSpace: "nowrap" }}
                  >
                    {countdown > 0 ? `${countdown}s` : "發送驗證碼"}
                  </Button>
                )}
              </Box>
            </FormControl>

            {/* 驗證按鈕 */}
            {verificationSent && !isEmailVerified && (
              <Button
                variant="outlined"
                onClick={verifyEmail}
                sx={{ alignSelf: "flex-start" }}
              >
                驗證Email
              </Button>
            )}

            {isEmailVerified && (
              <Typography color="success.main" variant="body2">
                ✓ Email已驗證
              </Typography>
            )}

            {/* 密碼欄位 */}
            <FormControl>
              <FormLabel htmlFor="password">密碼</FormLabel>
              <TextField
                id="password"
                type="password"
                placeholder="••••••"
                autoComplete="new-password"
                required
                fullWidth
                variant="outlined"
                error={!!errors.password}
                helperText={errors.password?.message}
                {...register("password", {
                  required: "請輸入密碼",
                  minLength: {
                    value: 6,
                    message: "密碼至少6位數以上",
                  },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).+$/,
                    message: "密碼需包含大小寫字母與符號",
                  },
                })}
              />
            </FormControl>

            {/* 確認密碼欄位 */}
            <FormControl>
              <FormLabel htmlFor="confirmPassword">確認密碼</FormLabel>
              <TextField
                id="confirmPassword"
                type="password"
                placeholder="••••••"
                autoComplete="new-password"
                required
                fullWidth
                variant="outlined"
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                {...register("confirmPassword", {
                  required: "請再次輸入密碼",
                  validate: (value) =>
                    value === password || "密碼不一致",
                })}
              />
            </FormControl>

            <Button 
              type="submit" 
              fullWidth 
              variant="contained"
            >
              註冊
            </Button>
          </Box>
          
          
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography sx={{ textAlign: "center" }}>
              已經有帳號了嗎?{" "}
              <Link
                href="/login"
                variant="body2"
                sx={{ alignSelf: "center" }}
              >
                登入
              </Link>
            </Typography>
          </Box>
        </Card>
      </SignUpContainer>
    </AppTheme>
  );
}