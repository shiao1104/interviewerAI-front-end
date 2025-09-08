import Layout from "@/components/Layout/ManageLayout";
import { JSXElementConstructor, ReactElement, ReactNode, ReactPortal, useEffect, useState } from "react";
import { Typography, Box, Chip, IconButton, Button } from "@mui/material";
import { intervieweeSearchData } from "@/lib/data/intervieweeSearchData";
import { SearchType } from "@/lib/types/searchTypes";
import { useForm } from "react-hook-form";
import SearchBar from "@/components/common/searchBar";
import DataTable from "@/components/common/DataTables";
import { AccountCircle, Add, Edit, MoreHoriz } from "@mui/icons-material";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import InterviewAPI from "@/lib/api/InterviewAPI";
import { IntervieweeTypes } from "@/lib/types/intervieweeTypes";

export default function Interviewee() {
  const router = useRouter();
  const formProps = useForm();
  const [intervieweeData, setIntervieweeData] = useState([]);
  const [searchParams, setSearchParams] = useState<SearchType>();

  const fetchData = async () => {
    try {
      const response = await InterviewAPI.getData();

      if (response.data && Array.isArray(response.data)) {
        const transformedData = response.data.map((item: IntervieweeTypes) => ({
          id: item.interview_id,
          name: item.candidate_detail?.username || '',
          type: item.opening_detail?.opening_name || "-",
          company: item.opening_detail?.company_name,
          difficulty: getInterviewStatus(item.interview_status, item.interview_datetime),
          createDate: formatDate(item.interview_datetime),
          interview_result: item.interview_result,
          total_score: item.total_score,
          originalData: item
        }));
        setIntervieweeData(transformedData);
      }
    } catch (err) {
      console.error("獲取面試者資料失敗:", err);
      toast.error("無法獲取面試者資料，請稍後再試。");
    }
  };

  // 格式化日期
  const formatDate = (dateString: string | number | Date) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  // 根據面試狀態和時間判斷顯示狀態
  const getInterviewStatus = (status: any, datetime: string | number | Date) => {
    const now = new Date();
    const interviewDate = new Date(datetime);

    switch (status) {
      case "已完成":
        return "已完成";
      case "已排定":
        if (interviewDate < now) {
          return "未到場";
        } else {
          return `預計 ${formatDate(datetime)}`;
        }
      default:
        return "待安排";
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getDifficultyColor = (difficulty: string | string[]) => {
    if (difficulty.includes("已完成")) {
      return "success";
    } else if (difficulty.includes("未到場")) {
      return "error";
    } else if (difficulty.includes("預計")) {
      return "primary";
    } else {
      return "default";
    }
  };

  const columns = [
    { id: "id", label: "面試ID", sortable: true },
    { id: "name", label: "姓名", textAlign: "center" },
    {
      id: "type",
      label: "應徵職位",
      textAlign: "center",
      sortable: true,
      render: (value: any, row: { company: string }) => (
        <Box>
          <div>{value}</div>
          <Typography variant="caption" color="textSecondary">
            {row.company}
          </Typography>
        </Box>
      )
    },
    {
      id: "difficulty",
      label: "面試狀態",
      render: (value: any) => (
        <Chip
          label={value}
          color={getDifficultyColor(value)}
          size="small"
          variant="outlined"
        />
      ),
      textAlign: "center",
      sortable: true,
    },
    {
      id: "interview_result",
      label: "面試結果",
      render: (value: string, row: any) => {
        if (value === "第二階段通過") {
          return <Chip label="第二階段通過" color="success" size="small" />;
        } else if (value === "第二階段未通過") {
          return <Chip label="第二階段未通過" color="error" size="small" />;
        } else if (value === "第一階段通過") {
          return <Chip label="第一階段通過" variant="outlined" color="success" size="small" />;
        } else if (value === "第一階段未通過") {
          return <Chip label="第一階段未通過" variant="outlined" color="error" size="small" />;
        } else if (value === "尚未面試") {
          return <Chip label="尚未面試" color="warning" size="small" />;
        }
        return "-";
      },
      textAlign: "center",
      sortable: true,
    },
    {
      id: "total_score",
      label: "總分",
      render: (value: any) => value ? `${value}分` : "-",
      textAlign: "center",
      sortable: true,
    },
    {
      id: "createDate",
      label: "面試時間",
      textAlign: "center",
      sortable: true,
    },
    {
      id: "actions",
      label: "操作",
      render: (_: any, row: { id: any; }) => (
        <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
          <IconButton
            onClick={() => router.push(`/manage/interviewee/${row.id}`)}
            size="small"
            title="編輯"
          >
            <Edit fontSize="small" />
          </IconButton>
          <IconButton
            onClick={() => router.push(`/manage/interviewee/report/${row.id}`)}
            size="small"
            title="查看詳情"
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
        {/* 標題與按鈕 */}
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

        {/* 搜尋欄 */}
        <Box sx={{ mb: 3 }}>
          <SearchBar
            items={intervieweeSearchData}
            formProps={formProps}
            handleParams={(params) => setSearchParams(params)}
          />
        </Box>

        {/* 數據表格 */}
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