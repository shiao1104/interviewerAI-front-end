import Layout from "@/components/Layout/ManageLayout";
import styles from "@/styles/pages/manage/Home.module.scss";
import { companyInfo } from "@/lib/data/testData";
import { Business, Language, LocationOn, People } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import { CiEdit } from "react-icons/ci";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  return (
    <Layout>
      <section className={styles.container}>
        <Card className={styles.content}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "2rem",
            }}
          >
            <Typography variant="h4">公司資訊</Typography>
            <Button
              sx={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                border: 1,
              }}
              onClick={() => router.push("/manage/edit-company")}
            >
              編輯
              <CiEdit />
            </Button>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Avatar
              src={companyInfo.logo}
              alt={companyInfo.name}
              sx={{ width: 60, height: 60, mr: 2 }}
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
          <Divider sx={{ my: 2 }} />
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <LocationOn color="primary" sx={{ mr: 1 }} />
                <Typography variant="body2">{companyInfo.location}</Typography>
              </Box>
            </Grid>
            <Grid>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <People color="primary" sx={{ mr: 1 }} />
                <Typography variant="body2">{companyInfo.size}</Typography>
              </Box>
            </Grid>
            <Grid>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Business color="primary" sx={{ mr: 1 }} />
                <Typography variant="body2">
                  成立於 {companyInfo.founded}
                </Typography>
              </Box>
            </Grid>
            <Grid>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Language color="primary" sx={{ mr: 1 }} />
                <Typography variant="body2">{companyInfo.website}</Typography>
              </Box>
            </Grid>
          </Grid>
          <Typography variant="h6" gutterBottom>
            公司簡介
          </Typography>
          <Typography variant="body1" paragraph>
            {companyInfo.description}
          </Typography>
          <Typography variant="h6" gutterBottom>
            公司文化
          </Typography>
          <Typography variant="body1" paragraph>
            {companyInfo.culture}
          </Typography>
          <Typography variant="h6" gutterBottom>
            員工福利
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
            {companyInfo.benefits.map((benefit, index) => (
              <Chip key={index} label={benefit} />
            ))}
          </Box>
          <Typography variant="h6" gutterBottom>
            主要專案
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
            {companyInfo.keyProjects.map((project, index) => (
              <Chip
                key={index}
                label={project}
                color="primary"
                variant="outlined"
              />
            ))}
          </Box>
        </Card>
      </section>
    </Layout>
  );
}
