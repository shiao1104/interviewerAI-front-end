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
      setDataList(response[0].data || []);
      console.log(response[0].data);

      // const response = await QuestionAPI.getData();
      // setDataList(response.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    console.log(searchParams);
    fetchData();
  }, []);

  const handleToggleValidity = (id: number) => {
    setDataList((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, vaild: !item.status } : item
      )
    );
  };

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
    // { id: "position", label: "適用職位", sortable: true },
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
    // {
    //   id: "vaild",
    //   label: "啟用狀態",
    //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //   render: (_: any, row: any) => (
    //     <Box sx={{ display: "flex", gap: 1 }}>
    //       <Switch
    //         checked={row.vaild}
    //         onChange={() => handleToggleValidity(row.question_id)}
    //       />
    //     </Box>
    //   ),
    //   sortable: true,
    // },
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
