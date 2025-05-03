import React, { useState } from "react";
import Layout from "@/components/Layout/manage/Layout";
import styles from "@/styles/pages/manage/EditCompany.module.scss";
import { companyInfo } from "@/lib/data/testData";
import {
  Box,
  Button,
  Card,
  TextField,
  Typography,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  Chip,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import { useRouter } from "next/router";

export default function EditCompanyDetails() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(1);
  const [formData, setFormData] = useState({
    description: companyInfo.description,
    culture: companyInfo.culture,
    benefits: [...companyInfo.benefits],
    keyProjects: [...companyInfo.keyProjects],
  });
  const [newItem, setNewItem] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState("benefits"); // 'benefits' or 'projects'

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePrevious = () => {
    router.push("/manage/edit-company-info");
  };

  const handleSave = () => {
    // 這裡可以添加保存邏輯，例如API調用
    // 保存成功後跳轉回主頁
    router.push("/manage");
  };

  const handleCancel = () => {
    router.push("/manage");
  };

  const handleOpenDialog = (type) => {
    setDialogType(type);
    setNewItem("");
    setDialogOpen(true);
  };

  const handleAddItem = () => {
    if (!newItem.trim()) return;
    
    if (dialogType === "benefits") {
      setFormData((prev) => ({
        ...prev,
        benefits: [...prev.benefits, newItem.trim()],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        keyProjects: [...prev.keyProjects, newItem.trim()],
      }));
    }
    
    setNewItem("");
    setDialogOpen(false);
  };

  const handleDeleteItem = (type, index) => {
    if (type === "benefits") {
      const newBenefits = [...formData.benefits];
      newBenefits.splice(index, 1);
      setFormData((prev) => ({
        ...prev,
        benefits: newBenefits,
      }));
    } else {
      const newProjects = [...formData.keyProjects];
      newProjects.splice(index, 1);
      setFormData((prev) => ({
        ...prev,
        keyProjects: newProjects,
      }));
    }
  };

  const steps = ["基本資訊", "詳細資訊"];

  return (
    <Layout>
      <section className={styles.container}>
        <Card className={styles.content}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <IconButton onClick={handlePrevious} sx={{ mr: 1 }}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4">編輯公司資訊</Typography>
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
              公司詳細資訊
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              請填寫公司的詳細資訊，讓潛在的應聘者更好地了解您的公司
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" gutterBottom>
              公司簡介
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="請描述公司的背景、業務範圍及目標等"
            />
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" gutterBottom>
              公司文化
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              name="culture"
              value={formData.culture}
              onChange={handleChange}
              placeholder="請描述公司的文化理念、價值觀等"
            />
          </Box>

          <Box sx={{ mb: 4 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="subtitle1">員工福利</Typography>
              <Button
                size="small"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog("benefits")}
              >
                添加福利
              </Button>
            </Box>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {formData.benefits.length > 0 ? (
                formData.benefits.map((benefit, index) => (
                  <Chip
                    key={index}
                    label={benefit}
                    onDelete={() => handleDeleteItem("benefits", index)}
                  />
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  請添加員工福利項目
                </Typography>
              )}
            </Box>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="subtitle1">主要專案</Typography>
              <Button
                size="small"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog("projects")}
              >
                添加專案
              </Button>
            </Box>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {formData.keyProjects.length > 0 ? (
                formData.keyProjects.map((project, index) => (
                  <Chip
                    key={index}
                    label={project}
                    color="primary"
                    variant="outlined"
                    onDelete={() => handleDeleteItem("projects", index)}
                  />
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  請添加公司主要專案
                </Typography>
              )}
            </Box>
          </Box>

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
            <Box>
              <Button
                variant="outlined"
                onClick={handlePrevious}
                sx={{ mr: 2 }}
              >
                上一步
              </Button>
              <Button
                variant="contained"
                onClick={handleSave}
              >
                保存
              </Button>
            </Box>
          </Box>
        </Card>
      </section>

      {/* 添加項目對話框 */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>
          {dialogType === "benefits" ? "添加員工福利" : "添加主要專案"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            fullWidth
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder={
              dialogType === "benefits"
                ? "例如：五險一金、彈性工作時間"
                : "例如：智能客服系統、跨境電商平台"
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Button
                    variant="contained"
                    size="small"
                    onClick={handleAddItem}
                    disabled={!newItem.trim()}
                  >
                    添加
                  </Button>
                </InputAdornment>
              ),
            }}
            onKeyPress={(e) => {
              if (e.key === "Enter" && newItem.trim()) {
                handleAddItem();
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>關閉</Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
}