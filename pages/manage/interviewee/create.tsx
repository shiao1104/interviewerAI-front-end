import Layout from "@/components/Layout/ManageLayout";
import { Typography, Box, Button, Grid } from "@mui/material";
import { useForm } from "react-hook-form";
import { CreateNewFolder, KeyboardBackspace } from "@mui/icons-material";
import { useRouter } from "next/router";
import { intervieweeInput } from "@/lib/data/createIntervieweeData";
import InputField from "@/components/common/InputField";

export default function Create() {
  const router = useRouter();
  const formProps = useForm();

  return (
    <Layout>
      <Box
        sx={{
          p: 3,
          margin: "2rem auto",
          maxWidth: "1500px",
          borderRadius: "16px",
        }}
      >
        <Button
          startIcon={<KeyboardBackspace />}
          onClick={() => router.push("/manage/interviewee")}
        >
          返回列表
        </Button>
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

        <Grid>
          {intervieweeInput.slice(0, 6).map((item, index) => (
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
      </Box>
    </Layout>
  );
}
