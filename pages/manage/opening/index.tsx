import Layout from "@/components/Layout/ManageLayout";
import { useEffect, useState } from "react";
import {
  Typography,
  Box,
  IconButton,
  Button,
  Chip,
  Switch,
} from "@mui/material";
import { SearchType } from "@/lib/types/searchTypes";
import { openingData } from "@/lib/data/testData";
import { useForm } from "react-hook-form";
import SearchBar from "@/components/common/searchBar";
import DataTable from "@/components/common/DataTables";
import { Add, Delete, Edit, MoreHoriz, Work } from "@mui/icons-material";
import { useRouter } from "next/router";
import JobDetailDialog from "@/components/common/manage/JobDetailDialog";
import { getStatueColor } from "@/lib/hook/getStatueColor";
import { openingSearchData } from "@/lib/data/openingSearchData";
import OpeningAPI from "@/lib/api/OpeningAPI";

export default function Opening() {
  const router = useRouter();
  const formProps = useForm();
  const [searchParams, setSearchParams] = useState<SearchType>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [localOpeningData, setLocalOpeningData] = useState(openingData);
  const [dataList, setDataList] = useState(openingData);

  const fetchData = async () => {
    try {
      const response = await OpeningAPI.getData();
      setDataList(response.data || []);
      console.log(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    console.log(searchParams);
    fetchData();
  }, []);

  const handleToggleValidity = (id: number) => {
    setLocalOpeningData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, vaild: !item.vaild } : item
      )
    );
  };

  const columns = [
    { id: "id", label: "代碼", sortable: true },
    { id: "openingTitle", label: "職缺名稱", sortable: true },
    { id: "workLocation", label: "工作地點", sortable: true },
    { id: "createDate", label: "建立日期", sortable: true },
    {
      id: "actions",
      label: "操作",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (_: any, row: any) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton
            onClick={() => router.push(`/manage/opening/${row.id}`)}
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
          <IconButton onClick={() => handleShow(row.id)} size="small">
            <MoreHoriz fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  const handleShow = (id: number) => {
    const found = localOpeningData.find((item) => item.id === id);
    setSelectedJob(found);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    console.log("Delete item:", id);
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
          <DataTable columns={columns} data={dataList} />
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
