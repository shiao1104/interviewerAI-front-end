import Layout from "@/components/Layout/ManageLayout";
import { JSXElementConstructor, ReactElement, ReactNode, ReactPortal, useEffect, useState } from "react";
import { Typography, Box, Chip, IconButton, Button } from "@mui/material";
import { intervieweeSearchData } from "@/lib/data/intervieweeSearchData";
import { SearchType } from "@/lib/types/searchTypes";
import { useForm } from "react-hook-form";
import SearchBar from "@/components/common/searchBar";
import DataTable from "@/components/common/DataTables";
import { AccountCircle, Add, Edit, MoreHoriz, Search } from "@mui/icons-material";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import InterviewAPI from "@/lib/api/InterviewAPI";
import { IntervieweeTypes } from "@/lib/types/intervieweeTypes";
import { getDifficultyColor } from "@/lib/hook/getDifficultyColor";
import InputField from "@/components/common/InputField";
import { DropdownTypes } from "@/lib/types/dropdownTypes";
import OpeningAPI from "@/lib/api/OpeningAPI";
import { interviewStateData } from "@/lib/data/testData";

export default function Interviewee() {
  const router = useRouter();
  const formProps = useForm();
  const [intervieweeData, setIntervieweeData] = useState([]);
  const [searchParams, setSearchParams] = useState<SearchType>();
  const [filteredIntervieweeData, setFilteredIntervieweeData] = useState([]);
  const [dropdownOptions, setDropdownOptions] = useState<{
    opening: DropdownTypes[];
  }>({
    opening: [],
  });

  const fetchOpenings = async () => {
    try {
      const response = await OpeningAPI.getData();
      const openingList: any[] = response.data ?? [];
      const transformedOpenings = openingList.map((item: any) => ({
        key: item.opening_id,
        value: item.opening_name
      }));

      setDropdownOptions({
        opening: transformedOpenings,
      });
    } catch (err) {
      toast.error("無法獲取職位列表，請稍後再試。");
    }
  };

  const fetchData = async () => {
    try {
      const response = await InterviewAPI.getData();

      if (response.data && Array.isArray(response.data)) {
        const transformedData = response.data.map((item: IntervieweeTypes) => ({
          id: item.interview_id,
          name: item.candidate_detail?.username || '',
          type: item.opening_detail?.opening_name || "-",
          company: item.opening_detail?.company_name,
          interview_status: getInterviewStatus(item.interview_status, item.interview_datetime),
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

  const formatDate = (dateString: string | number | Date) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

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

  const filterData = (params: SearchType | undefined) => {
    if (!params || Object.keys(params).length === 0) {
      setFilteredIntervieweeData(intervieweeData);
      return;
    }

    const filtered = intervieweeData.filter((item: any) => {
      const { nowPage, ...filterParams } = params;

      return Object.entries(filterParams).every(([key, value]) => {
        if (!value || value === '') return true;

        const itemValue = item[key];
        if (!itemValue) return false;

        const itemStr = String(itemValue).toLowerCase();
        const searchStr = String(value).toLowerCase();

        switch (key) {
          case 'interview_result':
            return searchStr === '全部' ? true : itemStr === searchStr;
          case 'name':
          case 'type':
          case 'company':
            return itemStr.includes(searchStr);
          default:
            return itemStr.includes(searchStr);
        }
      });
    });

    setFilteredIntervieweeData(filtered);
  };

  const handleSearch = () => {
    const params = formProps.getValues();

    setSearchParams({ nowPage: 0, ...params });
  };

  const handleResetFilter = () => {
    window.location.reload();
    formProps.reset();
    setSearchParams(undefined);
    setFilteredIntervieweeData(intervieweeData);
  };

  useEffect(() => {
    fetchData();
    fetchOpenings();
  }, []);

  useEffect(() => {
    if (intervieweeData.length > 0) {
      filterData(searchParams);
    }
  }, [searchParams, intervieweeData]);

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
      id: "interview_status",
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

        <Box sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center'}}>
          {/* 搜尋欄 */}
          <Box sx={{ display: 'grid', gap: '1rem', gridTemplateColumns: '200px 200px 200px 100px 100px', alignItems: 'center', mb: 3 }}>
            <InputField
              name={'name'}
              label={'姓名'}
              type={'text'}
              formProps={formProps}
            />
            <InputField
              name={'type'}
              label={'應徵職位'}
              type={'dropdown'}
              placeholder={'請選擇應徵職位'}
              dropdownData={dropdownOptions.opening}
              formProps={formProps}
            />
            <InputField
              name={'interview_result'}
              label={'面試結果'}
              type={'dropdown'}
              placeholder={'請選擇面試結果'}
              dropdownData={interviewStateData}
              formProps={formProps}
            />

            <Button
              endIcon={<Search />}
              variant="outlined"
              sx={{ height: "43px" }}
              onClick={handleSearch}
            >
              搜尋
            </Button>

            <Button
              variant="text"
              onClick={handleResetFilter}
              sx={{ minWidth: "auto" }}
            >
              重置篩選
            </Button>
          </Box>
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
          <DataTable columns={columns} data={filteredIntervieweeData} />
        </Box>
      </Box>
    </Layout>
  );
}