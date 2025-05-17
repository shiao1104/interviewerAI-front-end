import Layout from "@/components/Layout/Layout";
import { Edit, EmailOutlined } from "@mui/icons-material";
import {
  Box,
  Card,
  Divider,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Stack,
  Typography,
} from "@mui/material";

export default function Profile() {
  return (
    <Layout>
      <Box sx={{ flex: 1, width: "100%" }}>
        <Stack
          spacing={4}
          sx={{
            display: "flex",
            maxWidth: "800px",
            mx: "auto",
            px: { xs: 2, md: 6 },
            py: { xs: 2, md: 3 },
          }}
        >
          <Card>
            <Box sx={{ mb: 1 }}>
              <Typography>個人檔案</Typography>
            </Box>
            <Divider />
            <Stack
              direction="row"
              spacing={3}
              sx={{ display: { xs: "none", md: "flex" }, my: 1 }}
            >
              <Stack direction="column" spacing={1}>
                <IconButton
                  aria-label="upload new picture"
                  sx={{
                    bgcolor: "background.body",
                    position: "absolute",
                    zIndex: 2,
                    borderRadius: "50%",
                    left: 100,
                    top: 170,
                    boxShadow: "sm",
                  }}
                >
                  <Edit />
                </IconButton>
              </Stack>
              <Stack spacing={2} sx={{ flexGrow: 1 }}>
                <Stack spacing={1}>
                  <FormLabel>Name</FormLabel>
                  <FormControl
                    sx={{
                      display: { sm: "flex-column", md: "flex-row" },
                      gap: 2,
                    }}
                  >
                    <Input placeholder="First name" />
                    <Input placeholder="Last name" sx={{ flexGrow: 1 }} />
                  </FormControl>
                </Stack>
                <Stack direction="row" spacing={2}>
                  <FormControl>
                    <FormLabel>Role</FormLabel>
                    <Input defaultValue="UI Developer" />
                  </FormControl>
                  <FormControl sx={{ flexGrow: 1 }}>
                    <FormLabel>Email</FormLabel>
                    <Input
                      type="email"
                      startAdornment={<EmailOutlined />}
                      placeholder="email"
                      defaultValue="siriwatk@test.com"
                      sx={{ flexGrow: 1 }}
                    />
                  </FormControl>
                </Stack>
              </Stack>
            </Stack>
            <Stack
              direction="column"
              spacing={2}
              sx={{ display: { xs: "flex", md: "none" }, my: 1 }}
            >
              <Stack direction="row" spacing={2}>
                <Stack direction="column" spacing={1}>
                  <IconButton
                    sx={{
                      bgcolor: "background.body",
                      position: "absolute",
                      zIndex: 2,
                      borderRadius: "50%",
                      left: 85,
                      top: 180,
                      boxShadow: "sm",
                    }}
                  >
                    <Edit />
                  </IconButton>
                </Stack>
                <Stack spacing={1} sx={{ flexGrow: 1 }}>
                  <FormLabel>Name</FormLabel>
                  <FormControl
                    sx={{
                      display: {
                        sm: "flex-column",
                        md: "flex-row",
                      },
                      gap: 2,
                    }}
                  >
                    <Input placeholder="First name" />
                    <Input placeholder="Last name" />
                  </FormControl>
                </Stack>
              </Stack>
              <FormControl>
                <FormLabel>Role</FormLabel>
                <Input defaultValue="UI Developer" />
              </FormControl>
            </Stack>
          </Card>
        </Stack>
      </Box>
    </Layout>
  );
}
