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
import { useLoading } from "@/lib/hook/loading";

export default function Edit() {
  const router = useRouter();
  const { id } = router.query;
  const { showLoading, hideLoading } = useLoading();
  const formProps = useForm<IntervieweeTypes>();

  const contactFields = intervieweeInput.slice(0, 3);
  const applicationFields = intervieweeInput.slice(3, 5);
  const interviewFields = intervieweeInput.slice(5);
  const interviewState = formProps.watch("interview_status");
  const [interviewStatus, setInterviewStatus] = useState<boolean>();

  const [dropdownOptions, setDropdownOptions] = useState<{
    opening: DropdownTypes[];
  }>({
    opening: [],
  });

  const fetchData = async () => {
    showLoading();

    try {
      const [openingListResponse, intervieweeResponse] = await Promise.all([
        OpeningAPI.getData(),
        InterviewAPI.getRecord(Number(id))
      ]);

      const openingList: any[] = openingListResponse.data ?? [];
      const transformedOpenings = openingList.map((item: any) => ({
        key: item.opening_id,
        value: item.opening_name
      }));

      setDropdownOptions({
        opening: transformedOpenings,
      });

      if (intervieweeResponse.data) {
        const intervieweeData = intervieweeResponse.data as IntervieweeTypes;

        const formData = {
          opening: intervieweeData.opening,
          remark: intervieweeData.remark,
          name: intervieweeData.candidate_detail?.username || '',
          email: intervieweeData.candidate_detail?.email || '',
          phone_number: intervieweeData.candidate_detail?.phone_number || '',
          interview_status: intervieweeData.interview_status,
          interview_datetime: intervieweeData.interview_datetime,
          interview_date: '',
          interview_time: '',
        };

        if (intervieweeData.interview_datetime) {
          const interviewDate = new Date(intervieweeData.interview_datetime);
          formData.interview_date = interviewDate.toISOString().split('T')[0];
          formData.interview_time = interviewDate.toTimeString().slice(0, 5);
          setInterviewStatus(true);
        }

        formProps.reset(formData);
      }
    } catch (error) {
      toast.error("無法獲取資料，請稍後再試。");
    } finally {
      hideLoading();
    }
  };

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const handleSubmit = async () => {
    showLoading();

    try {
      const data = formProps.getValues();

      if (interviewStatus) {
        if (!data.interview_date || !data.interview_time) {
          toast.error("請填寫面試日期和時間");
          hideLoading();
          return;
        }
        const date = new Date(`${data.interview_date}T${data.interview_time}`);
        data.interview_datetime = date.toISOString();

      }

      delete data.interview_date;
      delete data.interview_time;
      delete data.candidate_detail;
      delete data.opening_detail;
      delete data.interviewState;
      delete data.interview_status;

      await InterviewAPI.update(Number(id), data);
      toast.success("面試者資料已更新成功！");
      router.push("/manage/interviewee");
    } catch (error) {
      toast.error("無法更新面試者資料，請稍後再試。");
    } finally {
      hideLoading();
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

          {interviewState !== 'completed' && (
            <>
              <Divider sx={{ m: "1rem 0" }} />
              <Typography variant="h6" sx={{ mb: ".5rem" }}>
                安排初步面試
                <Switch
                  checked={interviewStatus || false}
                  onChange={(e) => {
                    setInterviewStatus(!interviewStatus);
                  }}
                />
              </Typography>
              {interviewStatus && (
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
            </>
          )}
        </Box>
      </Box>
    </Layout>
  );
}