import InputField from "@/components/common/manage/InputField";
import Layout from "@/components/Layout/ManageLayout";
import {
  CreateNewFolder,
  KeyboardBackspace,
  Save,
  Add,
  Delete,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  Paper,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import { useRouter } from "next/router";
import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import { createOpeningData } from "@/lib/data/createOpeningData";
import { OpeningTypes } from "@/lib/types/openingTypes";
import { companyType } from "@/lib/data/testData";

// 定義出題類型的介面
interface QuestionConfig {
  id: string;
  questionType: string;
  questionCount: number;
}

// 擴展 OpeningTypes 來包含多個出題配置
interface ExtendedOpeningTypes
  extends Omit<OpeningTypes, "questionType" | "questionCount"> {
  questionConfigs: QuestionConfig[];
}

export default function Create() {
  const router = useRouter();
  const [newSkill, setNewSkill] = useState("");
  const [questionConfigs, setQuestionConfigs] = useState<QuestionConfig[]>([
    { id: Date.now().toString(), questionType: "", questionCount: 0 },
  ]);

  const formProps = useForm<ExtendedOpeningTypes>({
    defaultValues: {
      openingTitle: "",
      headCount: 0,
      status: "",
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
      questionConfigs: [
        { id: Date.now().toString(), questionType: "", questionCount: 0 },
      ],
    },
  });

  const handleSubmit = formProps.handleSubmit((data) => {
    console.log("準備提交的職缺數據:", { ...data, questionConfigs });
    alert("成功新增職缺！");
    router.push("/manage/opening");
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

  // 新增出題配置
  const handleAddQuestionConfig = () => {
    const newConfig: QuestionConfig = {
      id: Date.now().toString(),
      questionType: "",
      questionCount: 0,
    };
    const updatedConfigs = [...questionConfigs, newConfig];
    setQuestionConfigs(updatedConfigs);
    formProps.setValue("questionConfigs", updatedConfigs);
  };

  // 刪除出題配置
  const handleDeleteQuestionConfig = (id: string) => {
    if (questionConfigs.length <= 1) return; // 至少保留一個配置

    const updatedConfigs = questionConfigs.filter((config) => config.id !== id);
    setQuestionConfigs(updatedConfigs);
    formProps.setValue("questionConfigs", updatedConfigs);
  };

  // 更新出題配置
  const handleUpdateQuestionConfig = (
    id: string,
    field: keyof Omit<QuestionConfig, "id">,
    value: string | number
  ) => {
    const updatedConfigs = questionConfigs.map((config) =>
      config.id === id ? { ...config, [field]: value } : config
    );
    setQuestionConfigs(updatedConfigs);
    formProps.setValue("questionConfigs", updatedConfigs);
  };

  // 找到原有的出題類型和數目配置項目
  const questionTypeData = createOpeningData.find(
    (item) => item.name === "questionType"
  );
  const questionCountData = createOpeningData.find(
    (item) => item.name === "questionCount"
  );

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
          onClick={() => router.push("/manage/opening")}
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
            新增職缺
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
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            基本資訊
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
            {createOpeningData.slice(0, 3).map((item, index) => (
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
              gap: "1rem",
            }}
          >
            {createOpeningData.slice(3, 4).map((item, index) => (
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

          {/* 出題數目 - 支援多個配置 */}
          <Box
            sx={{
              mb: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              出題類型與數目
            </Typography>
            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={handleAddQuestionConfig}
              size="small"
            >
              新增出題配置
            </Button>
          </Box>

          {questionConfigs.map((config) => (
            <Paper
              key={config.id}
              elevation={1}
              sx={{
                p: 2,
                mb: 2,
                backgroundColor: "#f9f9f9",
                border: "1px solid #e0e0e0",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                {questionConfigs.length > 1 && (
                  <IconButton
                    color="error"
                    size="small"
                    onClick={() => handleDeleteQuestionConfig(config.id)}
                  >
                    <Delete />
                  </IconButton>
                )}
              </Box>

              <Grid
                container
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                }}
              >
                <Grid>
                  {questionTypeData && (
                    <InputField
                      name={`questionType_${config.id}`}
                      label={questionTypeData.label}
                      type={questionTypeData.type}
                      placeholder={questionTypeData.placeholder}
                      dropdownData={questionTypeData.dropdownData}
                      formProps={{
                        ...formProps,
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        setValue: (value: any) => {
                          handleUpdateQuestionConfig(
                            config.id,
                            "questionType",
                            value
                          );
                        },
                        getValues: () => config.questionType,
                        control: {
                          ...formProps.control,
                          _getWatch: () => config.questionType,
                        },
                      }}
                    />
                  )}
                </Grid>
                <Grid>
                  <InputField
                    name={"questionCount"}
                    label={"請輸入數目"}
                    type={"number"}
                    placeholder={"請輸入數目"}
                    formProps={formProps}
                  />
                </Grid>
              </Grid>
            </Paper>
          ))}
        </Paper>
      </Box>
    </Layout>
  );
}
