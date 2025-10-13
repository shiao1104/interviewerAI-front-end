import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  CssBaseline,
  Typography,
  Paper,
  TextField,
  Grid
} from "@mui/material";
import { styled, ThemeProvider, createTheme } from "@mui/material/styles";
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  KeyboardBackspace as BackIcon
} from "@mui/icons-material";
import Layout from "@/components/Layout/Layout";
import { useRouter } from "next/router";
import UserAPI from "@/lib/api/UserAPI";
import { useLoading } from "@/lib/hook/loading";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
      light: "#42a5f5",
      dark: "#1565c0",
    },
    secondary: {
      main: "#00bcd4",
    },
    background: {
      default: "#f8fafc",
      paper: "#ffffff",
    },
  },
});

const ProfileContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  margin: "auto",
  maxWidth: "1000px",
  borderRadius: "16px",
}));

const InfoSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

const InfoGrid = styled(Grid)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  display: "grid",
  gridTemplateColumns: "",
  gap: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: "1fr",
  },
}));

export default function ProfilePage() {
  const router = useRouter();
  const { showLoading, hideLoading } = useLoading();
  const [isEditing, setIsEditing] = useState(false);
  const { register, setValue, handleSubmit, reset, getValues } = useForm();

  useEffect(() => {
    showLoading();
    const init = async () => {
      try {
        const response = await UserAPI.me();

        const data = response.data;
        setValue('first_name', data?.first_name);
        setValue('last_name', data?.last_name);
        setValue('email', data?.email);
        setValue('phone_number', data?.phone_number);
      } catch (e) {
        toast.error('查無資料')
      } finally {
        hideLoading();
      }
    };
    init();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async (data: any) => {
    showLoading();
    setIsEditing(false);

    try {
      await UserAPI.update(data);
      reset(data);
      toast.success('更新成功')
    } catch {
      toast.error('更新失敗')
    } finally {
      hideLoading();
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleGoBack = () => {
    router.push("/user");
    console.log("返回上一頁");
  };

  return (
    <Layout>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ProfileContainer>
          <Button
            startIcon={<BackIcon />}
            onClick={handleGoBack}
            sx={{ mb: 2 }}
          >
            返回
          </Button>

          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography
              variant="h4"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <PersonIcon color="primary" sx={{ fontSize: "35px" }} />
              個人檔案管理
            </Typography>
          </Box>

          <Paper
            elevation={2}
            sx={{
              p: 3,
              borderRadius: 2,
              backgroundColor: "#fff",
            }}
          >
            <InfoSection>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "primary.main" }}>
                基本資料
              </Typography>

              <InfoGrid container>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
                  <Grid>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      <PersonIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                      姓氏
                    </Typography>
                    {isEditing ? (
                      <TextField
                        fullWidth
                        {...register('last_name')}
                        placeholder="請輸入姓氏"
                        variant="outlined"
                        size="small"
                      />
                    ) : (
                      <Typography variant="body1" sx={{ p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                        {getValues('last_name')}
                      </Typography>
                    )}
                  </Grid>
                  <Grid>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      <PersonIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                      名字
                    </Typography>
                    {isEditing ? (
                      <TextField
                        fullWidth
                        {...register('first_name')}
                        placeholder="請輸入名字"
                        variant="outlined"
                        size="small"
                      />
                    ) : (
                      <Typography variant="body1" sx={{ p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                        {getValues('first_name')}
                      </Typography>
                    )}
                  </Grid>
                </Box>

                <Grid>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    <EmailIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                    電子郵件
                  </Typography>
                  {isEditing ? (
                    <TextField
                      fullWidth
                      {...register('email')}
                      placeholder="請輸入電子郵件"
                      variant="outlined"
                      size="small"
                      type="email"
                    />
                  ) : (
                    <Typography variant="body1" sx={{ p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                      {getValues('email')}
                    </Typography>
                  )}
                </Grid>

                <Grid>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    <PhoneIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                    電話號碼
                  </Typography>
                  {isEditing ? (
                    <TextField
                      fullWidth
                      {...register('phone_number')}
                      placeholder="請輸入電話號碼"
                      variant="outlined"
                      size="small"
                    />
                  ) : (
                    <Typography variant="body1" sx={{ p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                      {getValues('phone_number')}
                    </Typography>
                  )}
                </Grid>
              </InfoGrid>
            </InfoSection>

            <Box sx={{ display: 'flex', justifyContent: 'end', gap: 2, mt: 4 }}>
              {isEditing ? (
                <>
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleSubmit(handleSave)}
                    sx={{ height: "40px" }}
                  >
                    儲存更新
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<CancelIcon />}
                    onClick={handleCancel}
                    sx={{ height: "40px" }}
                  >
                    取消
                  </Button>
                </>
              ) : (
                <Button
                  variant="contained"
                  startIcon={<EditIcon />}
                  onClick={handleEdit}
                  sx={{ height: "40px" }}
                >
                  編輯資料
                </Button>
              )}
            </Box>
          </Paper>
        </ProfileContainer>
      </ThemeProvider>
    </Layout>
  );
}