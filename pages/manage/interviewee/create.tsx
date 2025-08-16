import Layout from "@/components/Layout/ManageLayout";
import { Typography, Box, Button, Grid, Divider, Switch } from "@mui/material";
import { useForm } from "react-hook-form";
import { CreateNewFolder, KeyboardBackspace, Save } from "@mui/icons-material";
import { useRouter } from "next/router";
import { intervieweeInput } from "@/lib/data/createIntervieweeData";
import InputField from "@/components/common/manage/InputField";
import { toast } from "react-toastify";
import InterviewAPI from "@/lib/api/InterviewAPI";
import { IntervieweeTypes } from "@/lib/types/intervieweeTypes";
import { useEffect, useState } from "react";
import OpeningAPI from "@/lib/api/OpeningAPI";
import { DropdownTypes } from "@/lib/types/dropdownTypes";

export default function Create() {
  const router = useRouter();
  const formProps = useForm<IntervieweeTypes>();

  const contactFields = intervieweeInput.slice(0, 3);
  const applicationFields = intervieweeInput.slice(3, 6);
  const interviewFields = intervieweeInput.slice(6);
  const interviewState = formProps.watch("interviewState", false);
  const [dropdownOptions, setDropdownOptions] = useState<{
    opening: DropdownTypes[];
  }>({
    opening: [],
  });

  const fetchData = async () => {
    try {
      const response = await OpeningAPI.getData();
      const transformedOpenings = response.data?.map((item: any) => ({
        key: item.opening_id,
        value: item.opening_name
      })) || [];

      console.log("職缺資料:", transformedOpenings);

      setDropdownOptions({
        opening: transformedOpenings,
      });
    } catch (error) {
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async () => {
    const data = formProps.getValues();

    if (data.interviewState && data.interview_date && data.interview_time) {
      try {
        const date = new Date(`${data.interview_date}T${data.interview_time}`);
        data.interview_datetime = date.toISOString();

        delete data.interview_date;
        delete data.interview_time;
      } catch (error) {
        toast.error("請檢查面試日期和時間格式");
        return;
      }
    }

    try {
      await InterviewAPI.create(data);
      toast.success("面試者資料已儲存成功！");
      router.push("/manage/interviewee");
    } catch (error) {
      console.error("儲存面試者資料失敗:", error);
      toast.error("無法儲存面試者資料，請稍後再試。");
    }
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
          onClick={() => router.push("/manage/interviewee")}
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
            新增面試者
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

        <Box
          sx={{
            mt: "2rem",
            p: 2,
            borderRadius: 2,
            backgroundColor: "#fff",
            border: "1px solid #e0e0e0",
          }}
        >
          <Typography variant="h6" sx={{ mb: ".5rem" }}>
            聯絡資訊
          </Typography>
          <Grid
            sx={{
              gap: "1rem",
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
            }}
          >
            {contactFields.map((item, index) => (
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
                  } formProps={formProps}
                />
              </Grid>
            ))}
          </Grid>
          <Divider sx={{ m: "1rem 0" }} />
          <Typography variant="h6" sx={{ mb: ".5rem" }}>
            應徵資料
          </Typography>
          <Grid sx={{ display: "grid", gap: "1rem" }}>
            {applicationFields.map((item, index) => (
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
                  } formProps={formProps}
                />
              </Grid>
            ))}
          </Grid>
          <Divider sx={{ m: "1rem 0" }} />
          <Typography variant="h6" sx={{ mb: ".5rem" }}>
            安排初步面試
            <Switch {...formProps.register("interviewState")} />
          </Typography>
          {interviewState && (
            <Grid
              sx={{
                display: "grid",
                gap: "1rem",
                gridTemplateColumns: "1fr 1fr",
              }}
            >
              {interviewFields.map((item, index) => (
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
          )}
        </Box>
      </Box>
    </Layout>
  );
}
