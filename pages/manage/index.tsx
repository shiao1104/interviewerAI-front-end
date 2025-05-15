import Layout from "@/components/Layout/ManageLayout";
import { companyInfo } from "@/lib/data/testData";
import { Business, Language, LocationOn, People, Edit } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Paper,
  Chip,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

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
          {/* 公司基本資訊 */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Avatar
              src={companyInfo.logo}
              alt={companyInfo.name}
              sx={{ width: 80, height: 80, mr: 3 }}
            >
              {companyInfo.name[0]}
            </Avatar>
            <Box>
              <Typography variant="h5" component="div">
                {companyInfo.name}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {companyInfo.industry}
              </Typography>
            </Box>
          </Box>
          
          <Divider sx={{ my: 3 }} />
          
          {/* 聯絡資訊區塊 */}
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            基本聯絡資訊
          </Typography>
          
          <Grid 
            container 
            sx={{ 
              mb: 3,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            <Grid>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <LocationOn color="primary" sx={{ mr: 1 }} />
                <Typography variant="body1">{companyInfo.location}</Typography>
              </Box>
            </Grid>
            <Grid>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <People color="primary" sx={{ mr: 1 }} />
                <Typography variant="body1">{companyInfo.size}</Typography>
              </Box>
            </Grid>
            <Grid>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Business color="primary" sx={{ mr: 1 }} />
                <Typography variant="body1">
                  成立於 {companyInfo.founded}
                </Typography>
              </Box>
            </Grid>
            <Grid>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Language color="primary" sx={{ mr: 1 }} />
                <Typography variant="body1">{companyInfo.website}</Typography>
              </Box>
            </Grid>
          </Grid>
          
          <Divider sx={{ my: 3 }} />
          
          {/* 公司簡介區塊 */}
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            公司簡介
          </Typography>
          <Typography variant="body1" paragraph>
            {companyInfo.description}
          </Typography>
          
          <Divider sx={{ my: 3 }} />
          
          {/* 公司文化區塊 */}
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            公司文化
          </Typography>
          <Typography variant="body1" paragraph>
            {companyInfo.culture}
          </Typography>
          
          <Divider sx={{ my: 3 }} />
          
          {/* 員工福利區塊 */}
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            員工福利
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
            {companyInfo.benefits.map((benefit, index) => (
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
          
          {/* 主要專案區塊 */}
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            主要專案
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
            {companyInfo.keyProjects.map((project, index) => (
              <Chip
                key={index}
                label={project}
                color="primary"
                variant="outlined"
                sx={{ 
                  borderRadius: "8px",
                  padding: "0 8px",
                }}
              />
            ))}
          </Box>
        </Paper>
      </Box>
    </Layout>
  );
}