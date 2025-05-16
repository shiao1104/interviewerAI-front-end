import Layout from "@/components/Layout/ManageLayout";
import { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Chip,
  IconButton,
  Button,
  Switch,
} from "@mui/material";
import { questionsData } from "@/lib/data/testData";
import { questionsSearchData } from "@/lib/data/questionsSearchData";
import { QuestionsSearchType } from "@/lib/types/questionsSearchTypes";
import { useForm } from "react-hook-form";
import SearchBar from "@/components/common/searchBar";
import DataTable from "@/components/common/DataTables";
import { Add, Delete, Edit, HelpOutline } from "@mui/icons-material";
import { useRouter } from "next/router";

export default function Questions() {
  const router = useRouter();
  const formProps = useForm();
  const [searchParams, setSearchParams] = useState<QuestionsSearchType>();
  const [localOpeningData, setLocalOpeningData] = useState(questionsData);

  useEffect(() => {
    console.log(searchParams);
  });

  const handleToggleValidity = (id: number) => {
    setLocalOpeningData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, vaild: !item.vaild } : item
      )
    );
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "簡單":
        return "success";
      case "中等":
        return "warning";
      case "困難":
        return "error";
      default:
        return "default";
    }
  };

  const columns = [
    { id: "position", label: "職位" },
    { id: "type", label: "類型" },
    { id: "question", label: "問題" },
    { id: "timeAllowed", label: "時間" },
    {
      id: "difficulty",
      label: "難度",
      render: (value: string) => (
        <Chip label={value} color={getDifficultyColor(value)} size="small" />
      ),
    },
    { id: "createDate", label: "建立日期" },
    {
      id: "vaild",
      label: "啟用狀態",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (_: any, row: any) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Switch
            checked={row.vaild}
            onChange={() => handleToggleValidity(row.id)}
          />
        </Box>
      ),
    },
    {
      id: "actions",
      label: "操作",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (_: any, row: any) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton
            onClick={() => router.push(`/manage/questions/${row.id}`)}
            size="small"
          >
            <Edit fontSize="small" />
          </IconButton>
          <IconButton
            onClick={() => handleDelete(row.id)}
            size="small"
            color="error"
          >
            <Delete fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  const handleDelete = (id: string) => {
    console.log("Delete item:", id);
    // Implement delete logic
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
            <HelpOutline color="primary" sx={{ fontSize: "35px" }} />
            問題管理
          </Typography>

          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={() => router.push("/manage/questions/create")}
            sx={{ height: 40 }}
          >
            新增問題
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
          <DataTable columns={columns} data={localOpeningData} />
        </Box>
      </Box>
    </Layout>
  );
}
