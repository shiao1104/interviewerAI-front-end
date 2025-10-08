import Layout from "@/components/Layout/ManageLayout";
import CompanyAPI from "@/lib/api/CompanyAPI";
import { companyInfo } from "@/lib/data/testData";
import { useLoading } from "@/lib/hook/loading";
import { CompanyTypes } from "@/lib/types/companyTypes";
import { Business, Language, LocationOn, Edit, LocalPhone } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Paper,
  Chip,
  Divider,
  Grid,
  Typography,
  Link,
} from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Home() {
  const router = useRouter();
  const { showLoading, hideLoading } = useLoading();
  const [dataList, setDataList] = useState<CompanyTypes>();
  const [benefitList, setBenefitList] = useState<string[]>([]);

  const fetch = async () => {
    showLoading();
    
    try {
      // TODO: 這裡的 company_id 先寫死，之後要改成動態抓取
      const response = await CompanyAPI.getData(11);
      const data = response.data as unknown as CompanyTypes;
      setDataList(data);
      setBenefitList(data.company_benefits?.split('、') || []);
    } catch (err) {
      toast.error("無法獲取公司資訊，請稍後再試。");
    } finally {
      hideLoading();
    }
  }

  useEffect(() => {
    fetch();
  }, []);

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
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            variant="h4"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mt: "1rem",
              mb: "1rem",
            }}
          >
            <Business color="primary" sx={{ fontSize: "35px" }} />
            公司資訊
          </Typography>

          <Button
            variant="contained"
            startIcon={<Edit />}
            onClick={() => router.push("/manage/edit-company")}
            sx={{ height: "40px" }}
          >
            編輯資訊
          </Button>
        </Box>

        <Paper
          elevation={2}
          sx={{
            mt: "1rem",
            p: 3,
            borderRadius: 2,
            backgroundColor: "#fff",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Avatar
              src={companyInfo.logo}
              alt={companyInfo.name}
              sx={{ width: 80, height: 80, mr: 3 }}
            >
              {dataList?.company_name?.[0]}
            </Avatar>
            <Box>
              <Typography variant="h5" component="div">
                {dataList?.company_name}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {dataList?.industry_name}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            基本聯絡資訊
          </Typography>

          <Grid
            container
            sx={{
              mb: 3,
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
                md: "1fr 1fr 1fr"
              },
              gap: "5px",
            }}
          >
            <Grid>
              {dataList?.addresses == null ? Object.entries(dataList?.addresses || {}).map(([key, address]) => (
                <Box key={key} sx={{ display: "flex", alignItems: "center", mb: '5px' }}>
                  <LocationOn color="primary" sx={{ mr: 1 }} />
                  <Typography variant="body1">
                    {typeof address === "string" ? address : ""}
                  </Typography>
                </Box>
              )) :
                <Box sx={{ display: "flex", alignItems: "center", mb: '5px' }}>
                  <LocationOn color="primary" sx={{ mr: 1 }} />
                  <Typography variant="body1">
                    {dataList?.address || "無地址資訊"}
                  </Typography>
                </Box>}
            </Grid>
            <Grid>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <LocalPhone color="primary" sx={{ mr: 1 }} />
                <Typography variant="body1">{dataList?.telephone}</Typography>
              </Box>
            </Grid>
            <Grid>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Language color="primary" sx={{ mr: 1 }} />
                <Link href={dataList?.company_website} target="_blank" variant="body1">
                  {dataList?.company_website}
                </Link>
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            公司簡介
          </Typography>
          <Typography variant="body1" paragraph>
            {dataList?.company_description}
          </Typography>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            員工福利
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
            {benefitList.map((benefit, index) => (
              <Chip
                key={index}
                label={benefit}
                sx={{
                  borderRadius: "8px",
                  padding: "0 8px",
                }}
              />
            ))}
          </Box>

          <Divider sx={{ my: 3 }} />
        </Paper>
      </Box>
    </Layout>
  );
}