import InputField from "@/components/common/manage/InputField";
import Layout from "@/components/Layout/ManageLayout";
import QuestionAPI from "@/lib/api/QuestionAPI";
import { createQuestionData } from "@/lib/data/createQuestionsData";
import { DropdownTypes } from "@/lib/types/dropdownTypes";
import { QuestionDetail, ReportTypes } from "@/lib/types/questionsTypes";
import { Edit as EditIcon, KeyboardBackspace, Save } from "@mui/icons-material";
import { Box, Button, Grid, Typography, Paper, Divider, Chip, MenuItem, OutlinedInput, Select, SelectChangeEvent } from "@mui/material";
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
  const formProps = useForm<ReportTypes>();
  const { handleSubmit: handleFormSubmit, getValues, setValue } = formProps;
  const [openingList, setOpeningList] = useState<DropdownTypes[]>([]);
  const [selectedOpenings, setSelectedOpenings] = useState<{ [key: number]: string[] }>({});
  
  const [selectedQuestionTypes, setSelectedQuestionTypes] = useState<number[]>([]);

  const handleOpeningsChange = (questionIndex: number) => (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    const newValue = typeof value === 'string' ? value.split(',') : value;
    setSelectedOpenings(prev => ({
      ...prev,
      [questionIndex]: newValue
    }));
  };

  const handleQuestionTypeChange = (event: SelectChangeEvent<number[]>) => {
    const {
      target: { value },
    } = event;
    const newValue = typeof value === 'string' ? [parseInt(value)] : value;
    setSelectedQuestionTypes(newValue);
    setValue('question_type_detail', newValue);
  };

  const fetchOpeningJobs = async () => {
    try {
      const response = await QuestionAPI.getOpeningJobs();
      setOpeningList(response.data || []);
    } catch (error) {
      toast.error("無法取得職缺列表,請稍後再試");
    }
  };

  const fetch = async () => {
    try {
      const response = await axios.all([
        QuestionAPI.getRecord(id as unknown as number),
        QuestionAPI.getOpeningJobs(),
        QuestionAPI.getQuestionType(),
      ]);

      const questionData = response[0].data as unknown as QuestionDetail;

      // 處理問題類型資料: 將單一物件轉換為陣列格式
      let initialQuestionTypes: number[] = [];
      if (questionData?.question_type_detail) {
        // 如果是物件,取其 question_type_id
        if (typeof questionData.question_type_detail === 'object' && 'question_type_id' in questionData.question_type_detail) {
          initialQuestionTypes = [questionData.question_type_detail.question_type_id];
        }
        // 如果已經是陣列
        else if (Array.isArray(questionData.question_type_detail)) {
          initialQuestionTypes = questionData.question_type_detail;
        }
      }

      setSelectedQuestionTypes(initialQuestionTypes);

      formProps.reset({
        question_type: questionData?.question_type,
        question_type_detail: initialQuestionTypes,
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

  useEffect(() => {
    if (id) {
      fetch();
      fetchOpeningJobs();
    }
  }, [id]);

  const onSubmit = async (data: any) => {
    try {
      // 確保問題類型資料格式正確
      const submitData = {
        ...data,
        question_type_detail: selectedQuestionTypes
      };
      
      console.log("提交的資料:", submitData);
      await QuestionAPI.update(Number(id), submitData);
      toast.success("問題更新成功");
      router.push("/manage/questions");
    } catch (error) {
      console.error("更新失敗:", error);
      toast.error("更新問題失敗,請稍後再試");
    }
  };

  const handleManualSubmit = () => {
    const formData = getValues();
    onSubmit(formData as unknown as QuestionDetail);
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
        </Paper>
      </Box>
    </Layout>
  );
}