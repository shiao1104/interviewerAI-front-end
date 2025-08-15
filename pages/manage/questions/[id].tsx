import InputField from "@/components/common/manage/InputField";
import Layout from "@/components/Layout/ManageLayout";
import QuestionAPI from "@/lib/api/QuestionAPI";
import { createQuestionData } from "@/lib/data/createQuestionsData";
import { DropdownTypes } from "@/lib/types/dropdownTypes";
import { QuestionDataType, QuestionsTypes } from "@/lib/types/questionsTypes";
import { Edit as EditIcon, KeyboardBackspace, Save } from "@mui/icons-material";
import { Box, Button, Grid, Typography, Paper, Divider } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FieldValues, useForm, UseFormReturn } from "react-hook-form";
import { toast } from "react-toastify";

export default function Edit() {
  const router = useRouter();
  const { id } = router.query;
  const [dropdownOptions, setDropdownOptions] = useState<{
    company_id: DropdownTypes[];
    question_type: DropdownTypes[];
  }>({
    company_id: [],
    question_type: [],
  });
  const formProps = useForm<QuestionsTypes>();
  const { handleSubmit: handleFormSubmit, getValues } = formProps;

  useEffect(() => {
    if (id) {
      const fetch = async () => {
        try {
          const response = await axios.all([
            QuestionAPI.getRecord(id as unknown as number),
            QuestionAPI.getOpeningJobs(),
            QuestionAPI.getQuestionType(),
          ]);

          const questionData = response[0].data as unknown as QuestionsTypes;

          formProps.reset({
            question_type: questionData?.question_type,
            question: questionData.question,
            time_allowed: questionData.time_allowed,
            difficulty: questionData.difficulty
          });

          setDropdownOptions({
            company_id: response[1].data || [],
            question_type: response[2].data || [],
          });
        } catch (error) {
          console.error("載入資料失敗:", error);
          toast.error("載入資料失敗");
        }
      };

      fetch();
    }
  }, [id, formProps]);

  const onSubmit = async (data: QuestionsTypes) => {
    try {
      console.log("提交的資料:", data);
      await QuestionAPI.update(Number(id), data);
      toast.success("問題更新成功");
      router.push("/manage/questions");
    } catch (error) {
      console.error("更新失敗:", error);
      toast.error("更新問題失敗，請稍後再試");
    }
  };

  // 手動觸發表單提交的函數
  const handleManualSubmit = () => {
    const formData = getValues();
    onSubmit(formData as QuestionsTypes);
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
            onClick={handleManualSubmit}
            sx={{ height: "40px" }}
          >
            儲存更新
          </Button>
        </Box>

        <Paper
          component="form"
          onSubmit={handleFormSubmit(onSubmit)}
          elevation={2}
          sx={{
            mt: "2rem",
            p: 3,
            borderRadius: 2,
            backgroundColor: "#fff",
          }}
        >
          <Grid
            container
            sx={{
              mb: "1rem",
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "1rem",
            }}
          >
            {createQuestionData.slice(0, 3).map((item, index) => (
              <Grid key={index}>
                <InputField
                  name={item.name}
                  label={item.label}
                  type={item.type}
                  placeholder={item.placeholder}
                  dropdownData={
                    dropdownOptions[
                    item.name as keyof typeof dropdownOptions
                    ] || item.dropdownData
                  }
                  formProps={formProps}
                />
              </Grid>
            ))}
          </Grid>

          {createQuestionData.slice(3).map((item, index) => (
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

          {/* 隱藏的提交按鈕，用於鍵盤 Enter 提交 */}
          <Button type="submit" sx={{ display: "none" }}>
            Submit
          </Button>
        </Paper>
      </Box>
    </Layout>
  );
}