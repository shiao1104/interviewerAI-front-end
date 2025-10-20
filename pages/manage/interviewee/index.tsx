import Layout from "@/components/Layout/ManageLayout";
import { useEffect, useState } from "react";
import { Typography, Box, Chip, IconButton, Button } from "@mui/material";
import { SearchType } from "@/lib/types/searchTypes";
import { useForm } from "react-hook-form";
import DataTable from "@/components/common/DataTables";
import { AccountCircle, Add, Edit, MoreHoriz, Search } from "@mui/icons-material";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import InterviewAPI from "@/lib/api/InterviewAPI";
import InputField from "@/components/common/InputField";
import { DropdownTypes } from "@/lib/types/dropdownTypes";
import OpeningAPI from "@/lib/api/OpeningAPI";
import { interviewStateData } from "@/lib/data/testData";
import { useLoading } from "@/lib/hook/loading";

export default function Interviewee() {
  const router = useRouter();
  const formProps = useForm();
  const { showLoading, hideLoading } = useLoading();
  const [intervieweeData, setIntervieweeData] = useState([]);
  const [searchParams, setSearchParams] = useState<SearchType>();
  const [filteredIntervieweeData, setFilteredIntervieweeData] = useState([]);
  const [dropdownOptions, setDropdownOptions] = useState<{
    opening: DropdownTypes[];
  }>({
    opening: [],
  });

  const fetchOpenings = async () => {
    showLoading();
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
    } finally {
      hideLoading();
    }
  };

  const fetchData = async () => {
    showLoading();

    try {
      const response = await InterviewAPI.getData();

      if (response.data && Array.isArray(response.data)) {
        const transformedData = response.data.map((item: any) => ({
          id: item.interview_id,
          name: item.candidate_detail?.username || '',
          type: item.opening_detail?.opening_name || "-",
          company: item.opening_detail?.company_name,
          interview_status: item.interview_status,
          createDate: formatDate(item.interview_datetime),
          interview_result: item.interview_result,
          total_score: item.total_score,
          originalData: item
        }));
        setIntervieweeData(transformedData);
      }
    } catch (err) {
      toast.error("無法獲取面試者資料，請稍後再試。");
    } finally {
      hideLoading();
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
      render: (value: string, row: any) => {
        if (value === "已完成") {
          return <Chip label={value} variant="outlined" color="success" size="small" />;
        } else if (value === "已排定") {
          return <Chip label={value} variant="outlined" color="warning" size="small" />;
        }
        return <Chip label={"尚未安排"} variant="outlined" size="small" />;
      },
      textAlign: "center",
      sortable: true,
    },
    {
      id: "interview_result",
      label: "面試結果",
      render: (value: string, row: any) => {
        if (value === "第二階段通過" || value === "第一階段通過" || value === "錄取") {
          return <Chip label={value} variant="outlined" color="success" size="small" />;
        } else if (value === "第一階段未通過" || value === "第二階段未通過") {
          return <Chip label={value} variant="outlined" color="error" size="small" />;
        } else if (value === "尚未面試") {
          return <Chip label="尚未面試" variant="outlined" color="warning" size="small" />;
        } else if (value === "待處理") {
          return <Chip label={value} variant="outlined" size="small" />;
        }
        return '-';
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

        <Box sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center' }}>
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