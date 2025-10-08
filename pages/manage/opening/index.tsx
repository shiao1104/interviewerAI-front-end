import Layout from "@/components/Layout/ManageLayout";
import { useEffect, useState } from "react";
import {
  Typography,
  Box,
  IconButton,
  Button,
} from "@mui/material";
import { SearchType } from "@/lib/types/searchTypes";
import { useForm } from "react-hook-form";
import SearchBar from "@/components/common/searchBar";
import DataTable from "@/components/common/DataTables";
import { Add, Delete, Edit, Work } from "@mui/icons-material";
import { useRouter } from "next/router";
import { openingSearchData } from "@/lib/data/openingSearchData";
import OpeningAPI from "@/lib/api/OpeningAPI";
import { OpeningTypes } from "@/lib/types/openingTypes";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useLoading } from "@/lib/hook/loading";

export default function Opening() {
  const router = useRouter();
  const formProps = useForm();
  const { showLoading, hideLoading } = useLoading();
  const [searchParams, setSearchParams] = useState<SearchType>();
  const [localOpeningData, setLocalOpeningData] = useState<OpeningTypes[]>([]);
  const [filteredDataList, setFilteredDataList] = useState<OpeningTypes[]>([]);

  const fetchData = async () => {
    showLoading();

    try {
      const response = await OpeningAPI.getData();
      setLocalOpeningData(response.data || []);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "取得資料失敗，請稍後再試");
    } finally {
      hideLoading();
    }
  };

  const filterData = (params: SearchType | undefined) => {
    if (!params || Object.keys(params).length === 0) {
      setFilteredDataList(localOpeningData);
      return;
    }

    const filtered = localOpeningData.filter((item) => {
      const { nowPage, ...filterParams } = params;

      return Object.entries(filterParams).every(([key, value]) => {
        if (!value || value === '') return true;

        const itemValue = item[key as keyof OpeningTypes];

        if (!itemValue) return false;

        const itemStr = String(itemValue).toLowerCase();
        const searchStr = String(value).toLowerCase();

        switch (key) {
          case 'difficulty':
            return searchStr === '全部' ? true : itemStr === searchStr;
          case 'question':
            return itemStr.includes(searchStr);
          default:
            return itemStr.includes(searchStr);
        }
      });
    });

    setFilteredDataList(filtered);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (localOpeningData.length > 0) {
      filterData(searchParams);
    }
  }, [searchParams, localOpeningData]);

  const columns = [
    { id: "opening_id", label: "ID", sortable: true },
    { id: "opening_name", label: "職缺名稱", sortable: true },
    { id: "opening_info", label: "工作內容說明", maxWidth: "350px" },
    { id: "update_time", label: "建立日期", sortable: true },
    {
      id: "actions",
      label: "操作",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (_: any, row: any) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton
            onClick={() => router.push(`/manage/opening/${row.opening_id}`)}
            size="small"
          >
            <Edit fontSize="small" />
          </IconButton>
          <IconButton
            onClick={() => handleDelete(row.opening_id)}
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
      title: '確認刪除職缺',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: '確認刪除',
      cancelButtonText: '取消'
    })

    if (result.isConfirmed) {
      try {
        await OpeningAPI.delete(Number(id));
        router.reload();
        toast.success("職缺已成功刪除！");
      } catch (error) {
        toast.error("刪除職缺失敗，請稍後再試。");
      }
    }
  };

  const handleResetFilter = () => {
    formProps.reset();
    setSearchParams(undefined);
    setFilteredDataList(localOpeningData);
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
            職缺管理
          </Typography>

          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={() => router.push("/manage/opening/create")}
            sx={{ height: 40 }}
          >
            新增職缺
          </Button>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", justifyContent: 'end', gap: 1 }}>
          <SearchBar
            items={openingSearchData}
            formProps={formProps}
            handleParams={(params: SearchType) => setSearchParams(params)}
          />

          <Button
            variant="text"
            onClick={handleResetFilter}
            sx={{ minWidth: "auto", marginTop: "12px" }}
          >
            重置篩選
          </Button>
        </Box>

        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            backgroundColor: "#f9f9f9",
            border: "1px solid #e0e0e0",
            minWidth: "1000px",
          }}
        >
          <DataTable columns={columns} data={filteredDataList} />
        </Box>
      </Box>
    </Layout>
  );
}
