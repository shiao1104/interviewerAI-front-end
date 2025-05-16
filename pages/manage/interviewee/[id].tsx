import Layout from "@/components/Layout/ManageLayout";
import { Typography, Box, Button, Grid, Divider, Switch } from "@mui/material";
import { useForm } from "react-hook-form";
import { CreateNewFolder, KeyboardBackspace, Save } from "@mui/icons-material";
import { useRouter } from "next/router";
import { intervieweeInput } from "@/lib/data/createIntervieweeData";
import InputField from "@/components/common/manage/InputField";

export default function Create() {
  const router = useRouter();
  const formProps = useForm();

  const contactFields = intervieweeInput.slice(0, 5);
  const applicationFields = intervieweeInput.slice(5, 7);
  const interviewFields = intervieweeInput.slice(7);
  const interviewState = formProps.watch("interviewState", false);

  const handleSubmit = formProps.handleSubmit((data) => {
    const formData = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      gender: data.gender,
      educationLevel: data.educationLevel,
      applyPosition: data.applyPosition,
      resumeFile: data.resume,
      interviewDate: data.interviewDate,
      interviewTime: data.interviewTime,
      interviewLocation: data.interviewLocation,
    };
    console.log("準備提交的數據:", formData);

    // 提交後可以選擇返回列表頁面
    // router.push("/manage/interviewee");
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
                  dropdownData={item.dropdownData}
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
                  dropdownData={item.dropdownData}
                  formProps={formProps}
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
                gridTemplateColumns: "1fr 1fr 2fr",
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
