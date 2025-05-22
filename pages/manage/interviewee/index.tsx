import Layout from "@/components/Layout/ManageLayout";
import { useEffect, useState } from "react";
import { Typography, Box, Chip, IconButton, Button } from "@mui/material";
import { intervieweeData } from "@/lib/data/testData";
import { intervieweeSearchData } from "@/lib/data/intervieweeSearchData";
import { SearchType } from "@/lib/types/searchTypes";
import { useForm } from "react-hook-form";
import SearchBar from "@/components/common/searchBar";
import DataTable from "@/components/common/DataTables";
import { AccountCircle, Add, Edit, MoreHoriz } from "@mui/icons-material";
import { useRouter } from "next/router";

export default function Interviewee() {
  const router = useRouter();
  const formProps = useForm();
  const [searchParams, setSearchParams] = useState<SearchType>();

  useEffect(() => {
    console.log(searchParams);
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "已完成":
        return "success";
      case "未到場":
        return "warning";
      default:
        return "default";
    }
  };

  const columns = [
    { id: "id", label: "ID", sortable: true },
    { id: "name", label: "姓名", textAlign: "center" },
    { id: "type", label: "應徵職位", textAlign: "center", sortable: true },
    {
      id: "difficulty",
      label: "面試時間",
      render: (value: string) => (
        <Chip label={value} color={getDifficultyColor(value)} size="small" />
      ),
      textAlign: "center",
      sortable: true,
    },
    {
      id: "createDate",
      label: "建立日期",
      textAlign: "center",
      sortable: true,
    },
    {
      id: "actions",
      label: "操作",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (_: any, row: any) => (
        <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
          <IconButton
            onClick={() => router.push(`/manage/interviewee/${row.id}`)}
            size="small"
          >
            <Edit fontSize="small" />
          </IconButton>
          <IconButton
            onClick={() => router.push(`/manage/interviewee/report/${row.id}`)}
            size="small"
          >
            <MoreHoriz fontSize="small" />
          </IconButton>
        </Box>
      ),
      textAlign: "center",
    },
  ];

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
        {/* 改進的標題與按鈕排版 */}
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
            <AccountCircle color="primary" sx={{ fontSize: "35px" }} />
            面試者管理
          </Typography>

          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={() => router.push("/manage/interviewee/create")}
            sx={{ height: 40 }}
          >
            新增面試者
          </Button>
        </Box>

        <Box sx={{ mb: 3 }}>
          <SearchBar
            items={intervieweeSearchData}
            formProps={formProps}
            handleParams={(params: SearchType) => setSearchParams(params)}
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
          <DataTable columns={columns} data={intervieweeData} />
        </Box>
      </Box>
    </Layout>
  );
}
