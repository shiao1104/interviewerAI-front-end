import Layout from "@/components/Layout/ManageLayout";
import { useEffect, useState } from "react";
import { Typography, Box, IconButton, Button } from "@mui/material";
import { jobData } from "@/lib/data/testData";
import { questionsSearchData } from "@/lib/data/questionsSearchData";
import { QuestionsSearchType } from "@/lib/types/questionsSearchTypes";
import { useForm } from "react-hook-form";
import SearchBar from "@/components/common/searchBar";
import DataTable from "@/components/common/DataTables";
import {
  Add,
  Delete,
  Edit,
  MoreHoriz,
  Work,
} from "@mui/icons-material";
import { useRouter } from "next/router";
import JobDetailDialog from "@/components/common/manage/JobDetailDialog";
import { JobsTypes } from "@/lib/types/jobsTypes";

export default function Jobs() {
  const router = useRouter();
  const formProps = useForm();
  const [searchParams, setSearchParams] = useState<QuestionsSearchType>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedJob, setSelectedJob] = useState<JobsTypes>();
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    console.log(searchParams);
  });

  const columns = [
  { id: "id", label: "代碼" },
  { id: "position", label: "職位名稱" },
  { id: "workLocation", label: "工作地點" },
  { id: "jobType", label: "工作類型" },
  { id: "createDate", label: "建立日期" },
  {
    id: "actions",
    label: "操作",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (_: any, row: any) => (
      <Box sx={{ display: "flex", gap: 1 }}>
        <IconButton onClick={() => router.push(`/manage/jobs/${row.id}`)} size="small">
          <Edit fontSize="small" />
        </IconButton>
        <IconButton onClick={() => handleDelete(row.id)} size="small" color="error">
          <Delete fontSize="small" />
        </IconButton>
        <IconButton onClick={() => handleShow(row.id)} size="small">
          <MoreHoriz fontSize="small" />
        </IconButton>
      </Box>
    ),
  },
];

  const handleShow = (id: number) => {
    const found = jobData.find((item) => item.id === id);
    setSelectedJob(found);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    console.log("Delete item:", id);
  };

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
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Work color="primary" sx={{ fontSize: "35px" }} />
            職位管理
          </Typography>

          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={() => router.push("/manage/jobs/create")}
            sx={{ height: 40 }}
          >
            新增職位
          </Button>
        </Box>

        <Box sx={{ mb: 3 }}>
          <SearchBar
            items={questionsSearchData}
            formProps={formProps}
            handleParams={(params: QuestionsSearchType) =>
              setSearchParams(params)
            }
          />
        </Box>

        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            backgroundColor: "#f9f9f9",
            border: "1px solid #e0e0e0",
          }}
        >
          <DataTable columns={columns} data={jobData} />
        </Box>
      </Box>
      <JobDetailDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        data={selectedJob}
      />
    </Layout>
  );
}
