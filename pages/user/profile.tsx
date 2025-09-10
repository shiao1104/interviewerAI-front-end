import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Button,
  CssBaseline,
  Typography,
  Paper,
  TextField,
  Avatar,
  Divider,
  IconButton,
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
  LocationOn as LocationIcon,
  Work as WorkIcon,
  CalendarToday as CalendarIcon,
  PhotoCamera as PhotoCameraIcon,
  KeyboardBackspace as BackIcon
} from "@mui/icons-material";
import Layout from "@/components/Layout/Layout";
import { useRouter } from "next/router";
import UserAPI from "@/lib/api/UserAPI";

// 建立藍白主題
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
  gridTemplateColumns: "1fr 1fr",
  gap: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: "1fr",
  },
}));

const SingleInfoGrid = styled(Grid)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: theme.spacing(2),
}));

export default function ProfilePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const [profile, setProfile] = useState({
    name: "王小明",
    email: "wang.xiaoming@example.com",
    phone_number: "0912-345-678",
    location: "台北市信義區忠孝東路四段123號",
    company: "科技創新股份有限公司",
    position: "前端工程師",
    joinDate: "2023年1月15日",
  });

  const [editProfile, setEditProfile] = useState(profile);

  // 取得目前使用者資料 → 帶入個人檔案
  useEffect(() => {
    const init = async () => {
      try {
        const meRes = await UserAPI.me();
        const me = (meRes as any).data?.data ?? (meRes as any).data ?? meRes;

        const fullName =
          me.full_name ??
          `${me.last_name ?? ""}${me.first_name ?? ""}`.trim() ||
          me.username ||
          profile.name;

        setProfile((prev) => ({
          ...prev,
          name: fullName,
          email: me.email ?? prev.email,
          userId: String(me.id ?? ""),
          role: me.role ?? "",
          phone_number: me.phone_number ?? prev.phone_number,
        }));
        setEditProfile((prev) => ({
          ...prev,
          name: fullName,
          email: me.email ?? prev.email,
          userId: String(me.id ?? ""),
          role: me.role ?? "",
           phone_number: me.phone_number ?? prev.phone_number,
        }));

        const sid = sessionStorage.getItem("user_id");
        console.log("[ProfilePage] session user_id =", sid, " / me.id =", me.id);
      } catch (e) {
        console.warn("[ProfilePage] 無法取得 /user/me/，使用預設資料。", e);
      }
    };
    init();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
    setEditProfile(profile);
  };

  const handleSave = () => {
    setProfile(editProfile);
    setIsEditing(false);
    // 這裡可以加入API呼叫來儲存資料
    console.log("儲存資料:", editProfile);
  };

  const handleCancel = () => {
    setEditProfile(profile);
    setIsEditing(false);
    setAvatarPreview(""); // 重置頭像預覽
    setAvatarFile(null);
  };

  const handleInputChange = (field: string, value: string) => {
    setEditProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 處理頭像上傳
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // 驗證文件類型
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        alert('請上傳 JPG、PNG 或 GIF 格式的圖片');
        return;
      }

      // 驗證文件大小 (限制為 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('圖片大小不能超過 5MB');
        return;
      }

      setAvatarFile(file);

      // 創建預覽URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
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
            {/* 基本信息區塊 */}
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              個人基本資訊
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              請填寫您的個人資訊，這些資訊將顯示在您的個人檔案中
            </Typography>

            {/* 大頭照上傳區塊 */}
            <Box sx={{ mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
                個人大頭照
              </Typography>

              <Box sx={{ position: 'relative', mb: 2 }}>
                <Avatar
                  src={avatarPreview}
                  sx={{
                    width: 120,
                    height: 120,
                    cursor: isEditing ? 'pointer' : 'default',
                    border: isEditing ? '2px dashed #ccc' : '2px solid #e0e0e0',
                    '&:hover': isEditing ? {
                      border: '2px dashed #1976d2',
                    } : {},
                  }}
                  onClick={isEditing ? handleAvatarClick : undefined}
                >
                  {!avatarPreview && (
                    <PersonIcon sx={{ fontSize: 60, color: 'grey.500' }} />
                  )}
                </Avatar>

                {isEditing && (
                  <IconButton
                    sx={{
                      position: 'absolute',
                      bottom: -5,
                      right: -5,
                      backgroundColor: 'primary.main',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'primary.dark',
                      },
                      width: 35,
                      height: 35,
                    }}
                    onClick={handleAvatarClick}
                  >
                    <PhotoCameraIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarChange}
                accept="image/jpeg,image/jpg,image/png,image/gif"
                style={{ display: 'none' }}
              />

              {isEditing && (
                <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center' }}>
                  點擊上傳個人大頭照<br />
                  支援 JPG、PNG、GIF 格式，檔案大小不超過 5MB
                </Typography>
              )}
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* 個人基本信息表單 */}
            <InfoSection>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "primary.main" }}>
                基本資料
              </Typography>

              <InfoGrid container>
                <Grid>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    <PersonIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                    姓名
                  </Typography>
                  {isEditing ? (
                    <TextField
                      fullWidth
                      value={editProfile.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="請輸入姓名"
                      variant="outlined"
                      size="small"
                    />
                  ) : (
                    <Typography variant="body1" sx={{ p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                      {profile.name}
                    </Typography>
                  )}
                </Grid>

                <Grid>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    <EmailIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                    電子郵件
                  </Typography>
                  {isEditing ? (
                    <TextField
                      fullWidth
                      value={editProfile.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="請輸入電子郵件"
                      variant="outlined"
                      size="small"
                      type="email"
                    />
                  ) : (
                    <Typography variant="body1" sx={{ p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                      {profile.email}
                    </Typography>
                  )}
                </Grid>
              </InfoGrid>

              <InfoGrid container>
                <Grid>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    <PhoneIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                    電話號碼
                  </Typography>
                  {isEditing ? (
                    <TextField
                      fullWidth
                      value={editProfile.phone_number}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="請輸入電話號碼"
                      variant="outlined"
                      size="small"
                    />
                  ) : (
                    <Typography variant="body1" sx={{ p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                      {profile.phone_number}
                    </Typography>
                  )}
                </Grid>

                <Grid>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    <CalendarIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                    到職日期
                  </Typography>
                  {isEditing ? (
                    <TextField
                      fullWidth
                      value={editProfile.joinDate}
                      onChange={(e) => handleInputChange('joinDate', e.target.value)}
                      placeholder="請輸入到職日期"
                      variant="outlined"
                      size="small"
                    />
                  ) : (
                    <Typography variant="body1" sx={{ p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                      {profile.joinDate}
                    </Typography>
                  )}
                </Grid>
              </InfoGrid>

              <SingleInfoGrid container>
                <Grid>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    <LocationIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                    地址
                  </Typography>
                  {isEditing ? (
                    <TextField
                      fullWidth
                      value={editProfile.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="請輸入地址"
                      variant="outlined"
                      size="small"
                    />
                  ) : (
                    <Typography variant="body1" sx={{ p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                      {profile.location}
                    </Typography>
                  )}
                </Grid>
              </SingleInfoGrid>
            </InfoSection>

            {/* 操作按鈕 */}
            <Box sx={{ display: 'flex', justifyContent: 'end', gap: 2, mt: 4 }}>
              {isEditing ? (
                <>
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleSave}
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