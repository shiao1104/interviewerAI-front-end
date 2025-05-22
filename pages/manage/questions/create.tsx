import InputField from "@/components/common/manage/InputField";
import Layout from "@/components/Layout/ManageLayout";
import QuestionAPI from "@/lib/api/QuestionAPI";
import { createQuestionData } from "@/lib/data/createQuestionsData";
import { DropdownTypes } from "@/lib/types/dropdownTypes";
import { QuestionsTypes } from "@/lib/types/questionsTypes";
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
  Grid,
  Typography,
  IconButton,
  Paper,
  Divider,
} from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";

export default function Create() {
  const router = useRouter();
  const [dropdownOptions, setDropdownOptions] = useState<{
    applicablePositions: DropdownTypes[];
    questionType: DropdownTypes[];
  }>({
    applicablePositions: [],
    questionType: [],
  });
  const formProps = useForm<{ questions: QuestionsTypes[] }>({
    defaultValues: {
      questions: [{}],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: formProps.control,
    name: "questions",
  });

  useEffect(() => {
    const fetch = async () => {
      const response = await axios.all([
        QuestionAPI.getQuestionType(),
        QuestionAPI.getOpeningJobs(),
      ]);
      setDropdownOptions({
        applicablePositions: response[1].data,
        questionType: response[0].data,
      });
    };
    fetch();
  }, []);

  const handleSubmit = formProps.handleSubmit((data: { questions: QuestionsTypes[] }) => {
    const dataList = data.questions.map((q) => ({
      question_type_id: q.questionType,
      question: q.questionContent,
      company_id: 1,
      position: q.applicablePositions,
      time_allowed: q.timeLimit,
      difficulty: q.questionlevel,
      valid: q.status,
    }));

    console.log(dataList);

    const fetch = async () => {
      try {
        const response = await QuestionAPI.create(dataList);
        console.log(response);
      } catch (err) {
        console.log(err);
      }
    };

    fetch();

    // alert(`成功新增 ${data.questions.length} 筆問題！`);
    // router.push("/manage/interviewee");
  });

  // 新增一個空白問題
  const addNewQuestion = () => {
    append({});
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
            <CreateNewFolder color="primary" sx={{ fontSize: "35px" }} />
            新增問題
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

        {fields.map((field, questionIndex) => (
          <Paper
            key={field.id}
            component="form"
            elevation={2}
            sx={{
              mt: "2rem",
              p: 3,
              borderRadius: 2,
              backgroundColor: "#fff",
              position: "relative",
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
              <Typography variant="h6">問題 #{questionIndex + 1}</Typography>
              {fields.length > 1 && (
                <IconButton color="error" onClick={() => remove(questionIndex)}>
                  <Delete />
                </IconButton>
              )}
            </Box>

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
                    name={`questions[${questionIndex}].${item.name}`}
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
                  name={`questions[${questionIndex}].${item.name}`}
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
                    name={`questions[${questionIndex}].${item.name}`}
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
                    name={`questions[${questionIndex}].${item.name}`}
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
        ))}

        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={addNewQuestion}
            sx={{ borderRadius: "8px" }}
          >
            新增另一個問題
          </Button>
        </Box>
      </Box>
    </Layout>
  );
}
