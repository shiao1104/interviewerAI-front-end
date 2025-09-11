import DataTable from "@/components/common/DataTables";
import SearchBar from "@/components/common/searchBar";
import Layout from "@/components/Layout/ManageLayout";
import { companySearchData } from "@/lib/data/admin/companySearchData";
import { SearchType } from "@/lib/types/searchTypes";
import { AccountCircle, Add, Delete, Edit } from "@mui/icons-material";
import { Box, Typography, Button, IconButton } from "@mui/material";
import router from "next/router";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

export default function Company() {
    const formProps = useForm();
    const [searchParams, setSearchParams] = useState<any>();
    const [filterDataList, setFilterDataList] = useState<any>([]);
    const [companyData, setCompanyData] = useState<any>([
        { id: 1, name: "公司A" },
        { id: 2, name: "公司B" },
        { id: 3, name: "公司C" },
    ]);

    const columns = [
        { id: "id", label: "公司 ID", sortable: true },
        { id: "name", label: "公司名稱", textAlign: "center" },
        {
            id: "actions",
            label: "操作",
            render: (_: any, row: { id: any; }) => (
                <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
                    <IconButton
                        onClick={() => router.push(`/manage/interviewee/${row.id}`)}
                        size="small"
                        title="編輯"
                        color="primary"
                    >
                        <Edit fontSize="small" />
                    </IconButton>
                    <IconButton
                        onClick={() => router.push(`/manage/interviewee/${row.id}`)}
                        size="small"
                        title="刪除"
                        color="error"
                    >
                        <Delete fontSize="small" />
                    </IconButton>
                </Box>
            ),
            textAlign: "center",
        },
    ];

    const filterData = (params: SearchType | undefined) => {
        if (!params || Object.keys(params).length === 0) {
            setFilterDataList(companyData);
            return;
        }

        const filtered = companyData.filter((item: any) => {
            const { nowPage, ...filterParams } = params;

            return Object.entries(filterParams).every(([key, value]) => {
                if (!value || value === '') return true;

                const itemValue = item[key];
                if (!itemValue) return false;

                const itemStr = String(itemValue).toLowerCase();
                const searchStr = String(value).toLowerCase();
                console.log('Filtering:', { key, itemStr, searchStr });

                switch (key) {
                    case 'name':
                        return itemStr.includes(searchStr);
                    default:
                        return itemStr.includes(searchStr);
                }
            });
        });

        setFilterDataList(filtered);
    };

    useEffect(() => {
        if (companyData.length > 0) {
            filterData(searchParams);
        }
    }, [searchParams, companyData]);

    const handleResetFilter = () => {
        formProps.reset();
        setSearchParams(undefined);
        setFilterDataList(companyData);
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
                        <AccountCircle color="primary" sx={{ fontSize: "35px" }} />
                        公司管理
                    </Typography>

                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<Add />}
                        onClick={() => router.push("/manage/interviewee/create")}
                        sx={{ height: 40 }}
                    >
                        新增公司
                    </Button>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", justifyContent: 'end', gap: 1 }}>
                    <SearchBar
                        items={companySearchData}
                        formProps={formProps}
                        handleParams={(params) => setSearchParams(params)}
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
                    }}
                >
                    <DataTable columns={columns} data={companyData} />
                </Box>
            </Box>
        </Layout>
    )
}