import Layout from "@/components/Layout/manage/Layout";
import { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Chip,
} from "@mui/material";
import { questionsData } from "@/lib/data/testData";
import { questionsSearchData } from "@/lib/data/questionsSearchData";
import { QuestionsSearchType } from "@/lib/types/questionsSearchTypes";
import { useForm } from "react-hook-form";
import SearchBar from "@/components/common/searchBar";
import DataTable from "@/components/common/DataTables";

export default function Questions() {
  const formProps = useForm();
  const [searchParams, setSearchParams] = useState<QuestionsSearchType>();

  useEffect(() => {
    console.log(searchParams);
  });

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
  ];

  const handleEdit = (id: string) => {
    console.log("Edit item:", id);
    // Implement edit logic
  };

  const handleDelete = (id: string) => {
    console.log("Delete item:", id);
    // Implement delete logic
  };

  return (
    <Layout>
      <Box
        sx={{
          p: 3,
          margin: "auto",
          width: "80vw",
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{ mb: 4, color: "#fff", fontWeight: "bold" }}
        >
          面試問題管理
        </Typography>

        <Box sx={{ backgroundColor: "#fff", borderRadius: "10px" }}>
          <SearchBar
            items={questionsSearchData}
            formProps={formProps}
            handleParams={(params: QuestionsSearchType) =>
              setSearchParams(params)
            }
          />
          
          <DataTable
            columns={columns}
            data={questionsData}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </Box>
      </Box>
    </Layout>
  );
}
