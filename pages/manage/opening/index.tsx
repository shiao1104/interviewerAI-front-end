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
import { Add, Delete, Edit, MoreHoriz, Work } from "@mui/icons-material";
import { useRouter } from "next/router";
import JobDetailDialog from "@/components/common/manage/JobDetailDialog";
import { openingSearchData } from "@/lib/data/openingSearchData";
import OpeningAPI from "@/lib/api/OpeningAPI";
import { OpeningTypes } from "@/lib/types/openingTypes";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

export default function Opening() {
  const router = useRouter();
  const formProps = useForm();
  const [searchParams, setSearchParams] = useState<SearchType>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [localOpeningData, setLocalOpeningData] = useState<OpeningTypes[]>([]);

  const fetchData = async () => {
    try {
      const response = await OpeningAPI.getData();
      setLocalOpeningData(response.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    console.log(searchParams);
    fetchData();
  }, []);

  const columns = [
    { id: "opening_id", label: "代碼", sortable: true },
    { id: "opening_name", label: "職缺名稱", sortable: true },
    { id: "workplace_location", label: "工作地點", sortable: true },
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
          <IconButton onClick={() => handleShow(row.opening_id)} size="small">
            <MoreHoriz fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  const handleShow = (id: number) => {
    const found = localOpeningData.find((item) => item.opening_id === id);
    setSelectedJob(found);
    setDialogOpen(true);
  };

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

        <Box sx={{ mb: 3 }}>
          <SearchBar
            items={openingSearchData}
            formProps={formProps}
            handleParams={(params: SearchType) =>
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
      <JobDetailDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        data={selectedJob}
        type="opening"
      />
    </Layout>
  );
}
