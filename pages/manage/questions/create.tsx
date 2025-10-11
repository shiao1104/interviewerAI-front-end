import InputField from "@/components/common/manage/InputField";
import Layout from "@/components/Layout/ManageLayout";
import QuestionAPI from "@/lib/api/QuestionAPI";
import { createQuestionData } from "@/lib/data/createQuestionsData";
import { DropdownTypes } from "@/lib/types/dropdownTypes";
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
  Chip,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "react-toastify";

export default function Create() {
  const router = useRouter();
  const [openingList, setOpeningList] = useState<DropdownTypes[]>([]);
  const [companyId, setCompanyId] = useState<number>();
  const [dropdownOptions, setDropdownOptions] = useState<{
    opening_jobs: DropdownTypes[];
    question_type: DropdownTypes[];
  }>({
    opening_jobs: [],
    question_type: [],
  });
  const formProps = useForm<{ questions: any[] }>({
    defaultValues: {
      questions: [{}],
    },
    mode: "onBlur",
  });

  const { fields, append, remove } = useFieldArray({
    control: formProps.control,
    name: "questions",
  });

  const [selectedOpenings, setSelectedOpenings] = useState<{ [key: number]: string[] }>({});

  const handleOpeningsChange = (questionIndex: number) => (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    const newValue = typeof value === 'string' ? value.split(',') : value;
    setSelectedOpenings(prev => ({
      ...prev,
      [questionIndex]: newValue
    }));

    formProps.setValue(`questions.${questionIndex}.opening_ids`, newValue);
  };

  const fetchOpeningJobs = async () => {
    try {
      const response = await QuestionAPI.getOpeningJobs();
      setOpeningList(response.data || []);

    } catch (error) {
      toast.error("無法取得職缺列表，請稍後再試");
    }
  };

  const fetch = async () => {
    const response = await axios.all([
      QuestionAPI.getQuestionType(),
      QuestionAPI.getOpeningJobs(),
    ]);
    setDropdownOptions({
      opening_jobs: response[1].data || [],
      question_type: response[0].data || [],
    });
  };

  useEffect(() => {
    setCompanyId(Number(sessionStorage.getItem('companyId')));
    if (companyId) {
      fetch();
      fetchOpeningJobs();
    }
  }, [companyId]);

  const onSubmit = async (data: { questions: any[] }) => {
    try {
      const hasEmptyOpenings = data.questions.some(
        (q, index) => !selectedOpenings[index]?.length
      );

      if (hasEmptyOpenings) {
        toast.error("請為每個問題選擇適用職缺");
        return;
      }
      const dataList = {
        ...data.questions,
        'company': companyId
      }

      await QuestionAPI.create(dataList);
      toast.success("問題新增成功");
      router.push("/manage/questions");
    } catch (error) {
      toast.error("新增問題失敗，請稍後再試");
    }
  };

  const handleSubmit = formProps.handleSubmit(onSubmit);

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
            type="submit"
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
                    name={`questions[${questionIndex}].${item.name}`}
                    label={item.label}
                    type={item.type}
                    placeholder={item.placeholder}
                    dropdownData={
                      dropdownOptions[
                      item.name as keyof typeof dropdownOptions
                      ] || item.dropdownData
                    }
                    formProps={formProps}
                    rules={{ required: true }}
                  />
                </Grid>
              ))}
            </Grid>

            {createQuestionData.slice(3).map((item, index) => (
              <Grid key={index}>
                <InputField
                  name={`questions[${questionIndex}].${item.name}`}
                  label={item.label}
                  type={item.type}
                  placeholder={item.placeholder}
                  dropdownData={item.dropdownData}
                  formProps={formProps}
                  rules={{ required: true }}
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
                value={selectedOpenings[questionIndex] || []}
                onChange={handleOpeningsChange(questionIndex)}
                input={<OutlinedInput />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip
                        key={value}
                        label={openingList.find((item: { key: any }) => item.key === value)?.value || value}
                      />
                    ))}
                  </Box>
                )}
                error={!selectedOpenings[questionIndex]?.length}
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
