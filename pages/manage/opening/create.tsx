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

export default function Create() {
  const router = useRouter();

  const formProps = useForm<OpeningTypes>({
    defaultValues: {
      company: 11,
      opening_name: "",
      workplace_location: "",
      employment_type: "",
      opening_info: ""
    },
  });

  const handleSubmit = async () => {
    const openings = formProps.getValues();

    try {
      await OpeningAPI.create(openings);
      toast.success("職缺資料已成功儲存！");
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
            新增職缺
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
              gridTemplateColumns: { xs: "1fr 1fr", md: "1fr 1fr 1fr" },
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
