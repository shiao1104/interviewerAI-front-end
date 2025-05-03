import React, { useState } from "react";
import Layout from "@/components/Layout/manage/Layout";
import InputField from "@/components/common/InputField";
import styles from "@/styles/pages/manage/EditCompany.module.scss";
import { companyInfo } from "@/lib/data/testData";
import {
  Avatar,
  Box,
  Button,
  Card,
  TextField,
  Typography,
  Grid,
  IconButton,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { editCompanyInput } from "@/lib/data/editCompanyInput";

export default function EditCompanyInfo() {
  const formProps = useForm();
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    name: companyInfo.name,
    industry: companyInfo.industry,
    location: companyInfo.location,
    size: companyInfo.size,
    founded: companyInfo.founded,
    website: companyInfo.website,
    logo: companyInfo.logo,
  });

  const handleNext = () => {
    // 這裡可以添加表單驗證邏輯
    router.push("/manage/edit-company-details");
  };

  const handleCancel = () => {
    router.push("/manage");
  };

  const steps = ["基本資訊", "詳細資訊"];

  return (
    <Layout>
      <section className={styles.container}>
        <Card className={styles.content}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <IconButton onClick={handleCancel} sx={{ mr: 1 }}>
              <ArrowBackIcon />
            </IconButton>
            <Typography>返回</Typography>
          </Box>

          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              公司基本資訊
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              請填寫公司的基本資訊，這些資訊將顯示在公司主頁上
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
            <Box sx={{ position: "relative", mr: 3 }}>
              <Avatar
                src={formData.logo}
                alt={formData.name}
                sx={{ width: 100, height: 100 }}
              >
                {formData.name && formData.name[0]}
              </Avatar>
              <IconButton
                sx={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  backgroundColor: "white",
                  "&:hover": { backgroundColor: "#f5f5f5" },
                  border: "1px solid #e0e0e0",
                }}
                size="small"
              >
                <PhotoCameraIcon fontSize="small" />
              </IconButton>
            </Box>
            <Box>
              <Typography variant="body2" gutterBottom>
                公司標誌
              </Typography>
              <Typography variant="caption" color="text.secondary">
                建議上傳尺寸為 400x400 像素的圖片
              </Typography>
            </Box>
          </Box>

          <Grid className={styles.inputWrap}>
            {editCompanyInput.map((item, index) => (
              <Grid key={index}>
                <InputField
                  name={item.name}
                  label={item.label}
                  type={item.type}
                  placeholder={item.placeholder}
                  dropdownData={item.dropdownData}
                  formProps={formProps}
                />
              </Grid>
            ))}
          </Grid>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 4,
              pt: 2,
              borderTop: "1px solid #e0e0e0",
            }}
          >
            <Button variant="outlined" onClick={handleCancel}>
              取消
            </Button>
            <Button
              variant="contained"
              endIcon={<NavigateNextIcon />}
              onClick={handleNext}
            >
              下一步
            </Button>
          </Box>
        </Card>
      </section>
    </Layout>
  );
}
