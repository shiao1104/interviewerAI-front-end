import InputField from "@/components/common/manage/InputField";
import Layout from "@/components/Layout/ManageLayout";
import QuestionAPI from "@/lib/api/QuestionAPI";
import { createQuestionData } from "@/lib/data/createQuestionsData";
import { DropdownTypes } from "@/lib/types/dropdownTypes";
import { QuestionDetail } from "@/lib/types/questionsTypes";
import { Edit as EditIcon, KeyboardBackspace, Save } from "@mui/icons-material";
import { Box, Button, Grid, Typography, Paper, Chip, MenuItem, OutlinedInput, Select, SelectChangeEvent } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
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
  const formProps = useForm<any>();
  const { handleSubmit: handleFormSubmit, getValues, setValue } = formProps;
  const [openingList, setOpeningList] = useState<DropdownTypes[]>([]);
  const [selectedOpenings, setSelectedOpenings] = useState<number[]>([]);

  const handleOpeningsChange = (event: SelectChangeEvent<number[]>) => {
    const {
      target: { value },
    } = event;
    const newValue = typeof value === 'string' ? [parseInt(value)] : value;
    setSelectedOpenings(newValue);
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

      const questionData = response[0].data as any;

      let initialQuestionTypes: number[] = [];
      if (questionData?.question_type_detail) {
        if (typeof questionData.question_type_detail === 'object' && 'question_type_id' in questionData.question_type_detail) {
          initialQuestionTypes = [questionData.question_type_detail.question_type_id];
        } else if (Array.isArray(questionData.question_type_detail)) {
          initialQuestionTypes = questionData.question_type_detail;
        }
      }

      let initialOpenings: number[] = [];
      if (questionData?.using_openings && Array.isArray(questionData.using_openings)) {
        initialOpenings = questionData.using_openings.map((item: any) => item.opening);
      }

      setSelectedOpenings(initialOpenings);

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
      if (!selectedOpenings || selectedOpenings.length === 0) {
        toast.error("請選擇至少一個適用職缺");
        return;
      }

      const submitData = {
        question_type: data.question_type,
        difficulty: data.difficulty,
        time_allowed: data.time_allowed,
        question: data.question,
        opening_ids: selectedOpenings,
        opening_action: 'replace'
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

          <Grid sx={{ mt: 2 }}>
            <Typography variant="subtitle1">
              <Typography component="span" color="error" fontSize="0.75rem">
                *{" "}
              </Typography>
              適用職缺
            </Typography>
            <Select
              fullWidth
              multiple
              sx={{
                borderRadius: "5px",
                "& .MuiOutlinedInput-input": {
                  padding: "10px 14px",
                },
              }}
              value={selectedOpenings}
              onChange={handleOpeningsChange}
              input={<OutlinedInput />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip
                      key={value}
                      label={openingList.find((item: any) => item.key === value)?.value || value}
                    />
                  ))}
                </Box>
              )}
              error={!selectedOpenings?.length}
            >
              <MenuItem disabled value="">
                請選擇適用職缺
              </MenuItem>
              {openingList.map((name) => (
                <MenuItem
                  key={name.key}
                  value={name.key}
                >
                  {name.value}
                </MenuItem>
              ))}
            </Select>
          </Grid>
        </Paper>
      </Box>
    </Layout>
  );
}