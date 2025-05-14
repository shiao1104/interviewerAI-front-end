import Layout from "@/components/Layout/ManageLayout";
import { useEffect, useState } from "react";
import { Typography, Box, Chip, IconButton, Button } from "@mui/material";
import { intervieweeData } from "@/lib/data/testData";
import { intervieweeSearchData } from "@/lib/data/intervieweeSearchData";
import { QuestionsSearchType } from "@/lib/types/questionsSearchTypes";
import { useForm } from "react-hook-form";
import SearchBar from "@/components/common/searchBar";
import DataTable from "@/components/common/DataTables";
import { Add, AssessmentOutlined, MoreHoriz } from "@mui/icons-material";
import { useRouter } from "next/router";

export default function Interviewee() {
  const router = useRouter();
  const formProps = useForm();
  const [searchParams, setSearchParams] = useState<QuestionsSearchType>();

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
    { id: "id", label: "ID" },
    { id: "name", label: "姓名", textAlign: "center" },
    { id: "type", label: "應徵職位", textAlign: "center" },
    {
      id: "difficulty",
      label: "面試時間",
      render: (value: string) => (
        <Chip label={value} color={getDifficultyColor(value)} size="small" />
      ),
      textAlign: "center",
    },
    { id: "createDate", label: "建立日期", textAlign: "center" },
    {
      id: "actions",
      label: "操作",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (_: any, row: any) => (
        <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
          <IconButton onClick={() => handleShow(row.id)} size="small">
            <MoreHoriz fontSize="small" />
          </IconButton>
        </Box>
      ),
      textAlign: "center",
    },
  ];

  const handleShow = (id: string) => {
    console.log("Edit item:", id);
    router.push(`/manage/interviewee/${id}`);
    // Implement edit logic
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
            <AssessmentOutlined color="primary" sx={{ fontSize: "35px" }} />
            面試者列表
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
          <DataTable columns={columns} data={intervieweeData} />
        </Box>
      </Box>
    </Layout>
  );
}
