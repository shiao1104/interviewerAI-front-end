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
import { InterviewApiData } from "@/pages/user";

export default function CompanyIntroPopup({
  open,
  onClose,
  companyIntro,
}: {
  open: boolean;
  onClose: () => void;
  companyIntro: InterviewApiData | null;
}) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogContent dividers>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            sx={{ width: 60, height: 60, mr: 2 }}
          >
            {companyIntro?.company.company_name.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="h5" component="div">
              {companyIntro?.company.company_name}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {/* {companyIntro?.industry} */}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LocationOn color="primary" sx={{ mr: 1 }} />
              <Typography variant="body2">{companyIntro?.company_address}</Typography>
            </Box>
          </Grid>
          <Grid>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LocalPhone color="primary" sx={{ mr: 1 }} />
              <Typography variant="body1">{companyIntro?.company.telephone}</Typography>
            </Box>
          </Grid>
          <Grid>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Language color="primary" sx={{ mr: 1 }} />
              <Typography variant="body2">{companyIntro?.company.company_website}</Typography>
            </Box>
          </Grid>
        </Grid>

        <Typography variant="h6" gutterBottom>
          公司簡介
        </Typography>
        <Typography variant="body1" paragraph>
          {companyIntro?.company.company_description}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ bgcolor: 'background.default', borderRadius: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Work color="secondary" sx={{ mr: 1 }} />
            <Typography variant="h6">
              {companyIntro?.opening_name}
            </Typography>
          </Box>
          <Typography variant="body1">
            {companyIntro?.opening_info}
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