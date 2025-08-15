import Layout from "@/components/Layout/ManageLayout";
import { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Chip,
  IconButton,
  Button,
} from "@mui/material";
import { questionsSearchData } from "@/lib/data/questionsSearchData";
import { SearchType } from "@/lib/types/searchTypes";
import { useForm } from "react-hook-form";
import SearchBar from "@/components/common/searchBar";
import DataTable from "@/components/common/DataTables";
import { Add, Delete, Edit, HelpOutline } from "@mui/icons-material";
import { useRouter } from "next/router";
import QuestionAPI from "@/lib/api/QuestionAPI";
import { QuestionsTypes } from "@/lib/types/questionsTypes";
import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

export default function Questions() {
  const router = useRouter();
  const formProps = useForm();
  const [searchParams, setSearchParams] = useState<SearchType>();
  const [dataList, setDataList] = useState<QuestionsTypes[]>(
    []
  );

  const fetchData = async () => {
    try {
      const response = await axios.all([
        QuestionAPI.getData(),
        QuestionAPI.getQuestionType(),
      ]);

      const processedData = (response[0].data || []).map((item: any) =>
        typeof item === "object" && item !== null
          ? {
            ...item,
            question_type: item.question_type_detail?.question_type || ''
          }
          : {}
      );

      setDataList(processedData || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    console.log(searchParams);
    fetchData();
  }, []);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "容易":
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
    { id: "question_type", label: "問題類型", sortable: true },
    { id: "question", label: "問題內容" },
    { id: "time_allowed", label: "時間限制", sortable: true },
    {
      id: "difficulty",
      label: "難度等級",
      render: (value: string) => (
        <Chip label={value} color={getDifficultyColor(value)} size="small" />
      ),
      sortable: true,
    },
    { id: "created_time", label: "建立日期", sortable: true },
    {
      id: "actions",
      label: "操作",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (_: any, row: any) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton
            onClick={() => router.push(`/manage/questions/${row.question_id}`)}
            size="small"
          >
            <Edit fontSize="small" />
          </IconButton>
          <IconButton
            onClick={() => handleDelete(row.question_id)}
            size="small"
            color="error"
          >
            <Delete fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: '確認刪除問題',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: '確認刪除',
      cancelButtonText: '取消'
    })

    if (result.isConfirmed) {
      try {
        await QuestionAPI.delete(Number(id));
        router.reload();
        toast.success("問題刪除成功");
      } catch (error) {
        toast.error("新增問題失敗，請稍後再試");
      }
    }
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
          <DataTable columns={columns} data={dataList} />
        </Box>
      </Box>
    </Layout>
  );
}
