import InputField from "@/components/common/manage/InputField";
import Layout from "@/components/Layout/ManageLayout";
import QuestionAPI from "@/lib/api/QuestionAPI";
import { createQuestionData } from "@/lib/data/createQuestionsData";
import { DropdownTypes } from "@/lib/types/dropdownTypes";
import { Edit as EditIcon, KeyboardBackspace, Save } from "@mui/icons-material";
import { Box, Button, Grid, Typography, Paper, Divider } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function Edit() {
  const router = useRouter();
  const { id } = router.query;
  const [dropdownOptions, setDropdownOptions] = useState<{
    company_id: DropdownTypes[];
    question_type_id: DropdownTypes[];
  }>({
    company_id: [],
    question_type_id: [],
  });
  const formProps = useForm();

  useEffect(() => {
    if (id) {
      const fetch = async () => {
        const response = await axios.all([
          QuestionAPI.getData(id as unknown as number),
          QuestionAPI.getOpeningJobs(),
          QuestionAPI.getQuestionType(),
        ]);

        const questionData = response[0].data;
        formProps.reset({
          company_id: questionData.company_id,
          question_type_id: questionData.question_type_id,
          question: questionData.question,
          time_allowed: questionData.time_allowed,
          difficulty: questionData.difficulty,
          valid: questionData.valid,
        });

        setDropdownOptions({
          company_id: response[1].data || [],
          question_type_id: response[2].data || [],
        });
      };

      fetch();
    }
  }, [id, formProps]);

  const handleSubmit = formProps.handleSubmit((data) => {
    console.log("準備更新的數據:", data);

    // 可以在這裡發送數據到 API
    // 例如: updateQuestion(id, data);

    alert("問題更新成功！");

    // 更新後可以選擇返回列表頁面
    // router.push("/manage/questions");
  });

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
          onClick={() => router.push("/manage/questions")}
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
            <EditIcon color="primary" sx={{ fontSize: "35px" }} />
            修改問題
          </Typography>

          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={handleSubmit}
            sx={{ height: "40px" }}
          >
            儲存更新
          </Button>
        </Box>

        <Paper
          component="form"
          onSubmit={handleSubmit}
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
            問題基本資訊
          </Typography>

          <Grid
            container
            sx={{
              mb: "1rem",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            {createQuestionData.slice(0, 2).map((item, index) => (
              <Grid key={index}>
                <InputField
                  name={item.name}
                  label={item.label}
                  type={item.type}
                  placeholder={item.placeholder}
                  dropdownData={
                    dropdownOptions[
                      item.name as keyof typeof dropdownOptions
                    ] || []
                  }
                  formProps={formProps}
                />
              </Grid>
            ))}
          </Grid>

          {createQuestionData.slice(2, 3).map((item, index) => (
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

          <Divider sx={{ my: 3 }} />

          {/* 問題內容區塊 */}
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            問題內容設定
          </Typography>

          <Grid
            container
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "1rem",
            }}
          >
            {/* 問題內容佔滿一行 */}
            <Grid>
              {createQuestionData.slice(3, 4).map((item, index) => (
                <InputField
                  key={index}
                  name={item.name}
                  label={item.label}
                  type={item.type}
                  placeholder={item.placeholder}
                  dropdownData={item.dropdownData}
                  formProps={formProps}
                />
              ))}
            </Grid>

            {/* 其他設定分兩列 */}
            {createQuestionData.slice(4).map((item, index) => (
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
