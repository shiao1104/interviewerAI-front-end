import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import AppTheme from "@/styles/theme/AppTheme";
import Image from "next/image";
import Logo from "@/public/image/logo (1).png";
import { useRouter } from "next/router";
import { useEffect } from "react";
import ForgotPassword from "@/components/common/ForgotPassword";
import styles from "@/styles/pages/Login.module.scss";
import UserAPI from "@/lib/api/UserAPI";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { useLoading } from "@/lib/hook/loading";
import Swal from "sweetalert2";

interface LoginFormInputs {
  repassword: string;
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

export default function ResetPassword(props: { disableCustomTheme?: boolean }) {
  const { showLoading, hideLoading } = useLoading();
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const token = router.asPath.split('=')[1];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  useEffect(() => {
    sessionStorage.setItem('token', token);
  }, [token]);

  const handleClose = () => {
    setOpen(false);
  };

  const onSubmit = async (data: LoginFormInputs) => {
    if (data.password !== data.repassword) {
      Swal.fire({
        icon: 'error',
        title: '密碼不一致',
      });

      return;
    }

    try {
      showLoading();
      const response = await fetch("http://127.0.0.1:8000/user/reset-password/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          new_password: data.password,
          token: token,
        }),
      });
      toast.success('密碼重設成功，請重新登入');
    } catch {

    } finally {
      hideLoading();
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
            密碼重設
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
                {...register("password")}
              />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="password">重新輸入密碼</FormLabel>
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
                {...register("repassword")}
              />
            </FormControl>

            <ForgotPassword open={open} handleClose={handleClose} />

            <Button type="submit" fullWidth variant="contained">
              確認
            </Button>
          </Box>
        </Card>
      </SignInContainer>
    </AppTheme>
  );
}
