import React from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
  Chip,
  Avatar,
  Grid,
} from "@mui/material";
import {
  Business,
  LocationOn,
  People,
  Language,
  Work,
  LocalPhone
} from "@mui/icons-material";
import { interviewData } from "@/pages/user";

export default function CompanyIntroPopup({
  open,
  onClose,
  interview,
}: {
  open: boolean;
  onClose: () => void;
  interview: interviewData | null;
}) {
  // 模擬公司資料，實際上您應該擴展 interviewData 類型來包含這些資訊
  // 或從別的 API 獲取這些資料
  const companyInfo = interview ? {
    name: interview.company,
    logo: `/images/companies/${interview.company.toLowerCase().replace(/\s+/g, '_')}.png`,
    position: interview.position,
    industry: "資訊科技",
    location: "台北市信義區",
    telephone: "0912-456-789",
    founded: "2010年",
    website: "www.example.com",
    description: "科技未來有限公司是一家專注於人工智能、雲端運算和大數據分析的科技公司。我們致力於開發創新解決方案，協助企業優化營運流程、提升效率並創造價值。通過前沿技術與行業專業知識的結合，我們為客戶提供定制化的服務，滿足其獨特需求。",
    culture: "我們擁有開放、創新的工作文化，鼓勵員工分享想法、勇於嘗試。我們重視團隊合作和持續學習，定期舉辦知識分享和培訓活動，協助員工成長和發展。我們提供彈性工作安排和舒適的工作環境，確保員工工作與生活的平衡。",
    benefits: [
      "彈性工作時間",
      "優質健康保險",
      "年度旅遊補助",
      "教育訓練津貼",
      "免費健身房",
      "股票選擇權"
    ],
    positionDesc: "作為資深前端工程師，您將負責開發高效能、直覺的用戶界面，並與設計和後端團隊緊密合作，打造卓越的用戶體驗。您將參與產品從概念到實現的整個過程，並推動前端技術的創新和最佳實踐。"
  } : null;

  if (!companyInfo) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogContent dividers>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
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
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LocationOn color="primary" sx={{ mr: 1 }} />
              <Typography variant="body2">{companyInfo.location}</Typography>
            </Box>
          </Grid>
          <Grid>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LocalPhone color="primary" sx={{ mr: 1 }} />
              <Typography variant="body1">{companyInfo.telephone}</Typography>
            </Box>
          </Grid>
          <Grid>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
          員工福利
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
          {companyInfo.benefits.map((benefit, index) => (
            <Chip key={index} label={benefit} />
          ))}
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Work color="secondary" sx={{ mr: 1 }} />
            <Typography variant="h6">
              {companyInfo.position}
            </Typography>
          </Box>
          <Typography variant="body1">
            {companyInfo.positionDesc}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="primary">
          關閉
        </Button>
      </DialogActions>
    </Dialog>
  );
}