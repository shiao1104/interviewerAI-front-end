import InputField from "@/components/common/manage/InputField";
import Layout from "@/components/Layout/ManageLayout";
import {
  CreateNewFolder,
  KeyboardBackspace,
  Save,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { createOpeningData } from "@/lib/data/createOpeningData";
import OpeningAPI from "@/lib/api/OpeningAPI";
import { OpeningTypes } from "@/lib/types/openingTypes";
import { toast } from "react-toastify";
import { useEffect } from "react";

export default function Edit() {
  const router = useRouter();
  const {id} = router.query;

  const formProps = useForm<OpeningTypes>({
    defaultValues: {
      opening_name: "",
      workplace_location: "",
      employment_type: "",
      opening_info: ""
    },
  });
  
  const fetchOpeningData = async () => {
    try {
      const response = await OpeningAPI.getRecord(Number(id));
      formProps.reset(response.data);
    } catch (error) {
      toast.error("無法載入職缺資料，請稍後再試。");
    }
  };

  useEffect(() => {
    if (router.isReady && id) {
      fetchOpeningData();
    }
  }, [router.isReady, id]);

  const handleSubmit = async () => {
    const openings = formProps.getValues();
    const data = {
      ...openings,
      company: 11
    }

    try {
      await OpeningAPI.update(Number(id), data);
      toast.success("職缺資料已成功更新！");
      router.push("/manage/opening");
    } catch (error) {
      toast.error("儲存職缺資料失敗，請稍後再試。");
    }
  }

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
          onClick={() => router.push("/manage/opening")}
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
            編輯職缺
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

        <Paper
          elevation={2}
          sx={{
            mt: "2rem",
            p: 3,
            borderRadius: 2,
            backgroundColor: "#fff",
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            基本資訊
          </Typography>

          <Grid
            container
            sx={{
              mb: "1rem",
              display: "grid",
              gap: "1rem",
            }}
          >
            {createOpeningData.slice(0, 3).map((item, index) => (
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

          <Grid
            container
            sx={{
              mb: "1rem",
              display: "grid",
              gap: "1rem",
            }}
          >
            {createOpeningData.slice(3).map((item, index) => (
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
