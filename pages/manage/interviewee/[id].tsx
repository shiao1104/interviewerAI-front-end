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

export default function Edit() {
  const router = useRouter();
  const { id } = router.query;
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
      const intervieweeData = await InterviewAPI.getRecord(Number(id));

      const transformedOpenings = response.data?.map((item: any) => ({
        key: item.opening_id,
        value: item.opening_name
      })) || [];

      setDropdownOptions({
        opening: transformedOpenings,
      });

      if (intervieweeData.data) {
        const backendData = intervieweeData.data;
        
        let formData = typeof backendData === "object" && backendData !== null ? { ...backendData } : {};
        
        if (backendData.interview_datetime) {
          const interviewDate = new Date(backendData.interview_datetime);
          formData.interview_date = interviewDate.toISOString().split('T')[0]; // YYYY-MM-DD
          formData.interview_time = interviewDate.toTimeString().slice(0, 5); // HH:MM
          formData.interviewState = true;
        } else {
          formData.interviewState = false;
        }

        if (backendData.candidate_detail) {
          formData.username = backendData.candidate_detail.username;
          formData.email = backendData.candidate_detail.email;
          formData.phone_number = backendData.candidate_detail.phone_number;
        }

        if (backendData.opening_detail) {
          formData.opening_name = backendData.opening_detail.opening_name;
          formData.company_name = backendData.opening_detail.company_name;
        }

        formProps.reset(formData);
      }
    } catch (error) {
      console.error("獲取資料失敗:", error);
      toast.error("無法獲取資料，請稍後再試。");
    }
  }

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const handleSubmit = async () => {
    const data = formProps.getValues();

    // 如果有面試安排，處理日期時間
    if (data.interviewState && data.interview_date && data.interview_time) {
      try {
        const date = new Date(`${data.interview_date}T${data.interview_time}`);
        data.interview_datetime = date.toISOString();

        // 清理不需要的欄位
        delete data.interview_date;
        delete data.interview_time;
      } catch (error) {
        toast.error("請檢查面試日期和時間格式");
        return;
      }
    }

    // 清理不需要傳送到後端的欄位
    delete data.candidate_detail;
    delete data.opening_detail;
    delete data.interviewState;

    try {
      await InterviewAPI.update(Number(id), data); // 使用 update 而不是 create
      toast.success("面試者資料已更新成功！");
      router.push("/manage/interviewee");
    } catch (error) {
      console.error("更新面試者資料失敗:", error);
      toast.error("無法更新面試者資料，請稍後再試。");
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
            編輯面試者
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
                  } 
                  formProps={formProps}
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
                  } 
                  formProps={formProps}
                />
              </Grid>
            ))}
          </Grid>
          <Divider sx={{ m: "1rem 0" }} />
          <Typography variant="h6" sx={{ mb: ".5rem" }}>
            安排初步面試
            <Switch 
              {...formProps.register("interviewState")}
              checked={interviewState}
            />
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