import InputField from "@/components/common/manage/InputField";
import Layout from "@/components/Layout/ManageLayout";
import { CreateNewFolder, KeyboardBackspace, Save } from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import { createJobData } from "@/lib/data/createJobsData";
import { JobsTypes } from "@/lib/types/jobsTypes";

export default function Create() {
  const router = useRouter();
  const [newSkill, setNewSkill] = useState("");

  const formProps = useForm<JobsTypes>({
    defaultValues: {
    position: "",
    salaryRange: "",
    workLocation: "",
    jobType: "",
    educationRequirement: "",
    departmentRequirement: "",
    experienceRequirement: "",
    languageRequirement: "",
    workNature: "",
    workHours: [],
    skills: [],
    leavePolicy: "",
    jobDescription: "",
    contactInfo: "",      
    createDate: new Date().toISOString().split("T")[0].replace(/-/g, "/"),
    },
  });

  const handleSubmit = formProps.handleSubmit((data) => {
    console.log("準備提交的職位數據:", data);

    alert("成功新增職位！");
    router.push("/manage/jobs");
  });

  const handleAddSkill = () => {
    if (newSkill.trim() === "") return;

    const currentSkills = formProps.getValues("skills") || [];
    if (!currentSkills.includes(newSkill.trim())) {
      formProps.setValue("skills", [...currentSkills, newSkill.trim()]);
    }
    setNewSkill("");
  };

  const handleDeleteSkill = (skillToDelete: string) => {
    const currentSkills = formProps.getValues("skills") || [];
    formProps.setValue(
      "skills",
      currentSkills.filter((skill) => skill !== skillToDelete)
    );
  };

  return (
    <Layout>
      <Box
        sx={{
          p: 3,
          margin: "2rem auto",
          maxWidth: "1000px",
          borderRadius: "16px",
        }}
      >
        <Button
          startIcon={<KeyboardBackspace />}
          onClick={() => router.push("/manage/jobs")}
        >
          返回列表
        </Button>

        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            variant="h4"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mt: "1rem",
            }}
          >
            <CreateNewFolder color="primary" sx={{ fontSize: "35px" }} />
            新增職位
          </Typography>

          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={handleSubmit}
            sx={{ height: "40px" }}
          >
            儲存資料
          </Button>
        </Box>

        <Paper
          elevation={2}
          sx={{
            mt: "2rem",
            p: 3,
            borderRadius: 2,
            backgroundColor: "#fff",
          }}
        >
          {/* 基本信息區塊 */}
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            基本資訊
          </Typography>

          <Grid
            container
            sx={{
              mb: "1rem",
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: "1rem",
            }}
          >
            {createJobData.slice(0, 4).map((item, index) => (
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

          <Divider sx={{ my: 3 }} />

          {/* 工作條件區塊 */}
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            應徵條件
          </Typography>

          <Grid
            container
            sx={{
              mb: "1rem",
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: "1rem",
            }}
          >
            {createJobData.slice(4, 8).map((item, index) => (
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

          {/* 技能標籤區塊 */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              擅長工具 / 技能條件
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <TextField
                size="small"
                placeholder="新增技能（例如：React）"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
              />
              <Button variant="outlined" size="small" onClick={handleAddSkill}>
                新增
              </Button>
            </Box>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              <Controller
                name="skills"
                control={formProps.control}
                render={({ field }) => (
                  <>
                    {field.value &&
                      field.value.map((skill, i) => (
                        <Chip
                          key={i}
                          label={skill}
                          onDelete={() => handleDeleteSkill(skill)}
                          color="primary"
                          variant="outlined"
                          size="small"
                        />
                      ))}
                  </>
                )}
              />
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            工作條件
          </Typography>

          <Grid
            container
            sx={{
              mb: "1rem",
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
              gap: "1rem",
            }}
          >
            {createJobData.slice(8, 11).map((item, index) => (
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

          <Divider sx={{ my: 3 }} />

          {/* 職務描述與其他資訊 */}
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            詳細說明與聯絡資訊
          </Typography>

          <Grid sx={{ mb: 3 }}>
            {createJobData.slice(11, 12).map((item, index) => (
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

          <Grid
            container
            sx={{
              mb: "1rem",
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: "1rem",
            }}
          >
            {createJobData.slice(12).map((item, index) => (
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
        </Paper>
      </Box>
    </Layout>
  );
}
