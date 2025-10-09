import PopupModal from "@/components/common/admin/PopupModal";
import DataTable from "@/components/common/DataTables";
import SearchBar from "@/components/common/searchBar";
import Layout from "@/components/Layout/AdminLayout";
import AdminAPI from "@/lib/api/AdminAPI";
import CompanyAPI from "@/lib/api/CompanyAPI";
import { companyCreateData } from "@/lib/data/admin/companyCreateData";
import { companySearchData } from "@/lib/data/admin/companySearchData";
import { SearchType } from "@/lib/types/searchTypes";
import { AccountCircle, Add, Delete, Edit } from "@mui/icons-material";
import { Box, Typography, Button, IconButton } from "@mui/material";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function Permissions() {
    const formProps = useForm();
    const [searchParams, setSearchParams] = useState<any>();
    const [filterDataList, setFilterDataList] = useState<any>([]);
    const [companyData, setCompanyData] = useState<any>([]);
    const [popupCreateActive, setPopupCreateActive] = useState(false);
    const [popupEditActive, setPopupEditActive] = useState(false);
    const [editingCompany, setEditingCompany] = useState<any>(null);

    const handleEdit = async (row: any) => {
        try {
            const res = await CompanyAPI.getData(row.company_id);
            setEditingCompany(res.data);
            setPopupEditActive(true);
        } catch (error) {
            toast.error("無法載入公司資訊");
        }
    };

    const handleUpdate = async (formData: any) => {
        try {
            await CompanyAPI.update(formData, formData.company_id);
            toast.success("公司資料已更新！");
            setPopupEditActive(false);
            setEditingCompany(null);
            fetchData(); // 重新載入
        } catch (error) {
            toast.error("更新失敗，請稍後再試。");
        }
    };


    const deleteCompany = async () => {
        try {
            await CompanyAPI.delete(1);
            toast.success("公司資料已成功刪除！");
            fetchData();
        } catch (error) {
            toast.error("無法刪除公司資料，請稍後再試。");
        }
    };

    const columns = [
        { id: "id", label: "ID", sortable: true },
        { id: "username", label: "姓名", textAlign: "center" },
        { id: "email", label: "email", textAlign: "center" },
        {
            id: "actions",
            label: "操作",
            render: (_: any, row: { company_id: any; }) => (
                <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
                    <IconButton
                        onClick={() => handleEdit(row)}
                        size="small"
                        title="編輯"
                        color="primary"
                    >
                        <Edit fontSize="small" />
                    </IconButton>

                    <IconButton
                        onClick={deleteCompany}
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

    const fetchData = async () => {
        try {
            const response = await AdminAPI.getData();
            setCompanyData(response.data);
            setFilterDataList(response.data);
        } catch (error) {
            toast.error("無法載入公司資料，請稍後再試。");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

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

                switch (key) {
                    case 'company_name':
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
    }, [companyData, searchParams]);

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
                        權限管理
                    </Typography>

                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<Add />}
                        onClick={() => setPopupCreateActive(true)}
                        sx={{ height: 40 }}
                    >
                        新增人員
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
                    <DataTable columns={columns} data={filterDataList} />
                </Box>
            </Box>
            {popupEditActive && editingCompany && (
                <PopupModal
                    title="編輯人員資訊"
                    inputList={companyCreateData}
                    defaultValues={editingCompany}
                    onClose={() => setPopupEditActive(false)}
                    onSubmit={handleUpdate}
                />
            )}
            {popupCreateActive && (
                <PopupModal
                    title="新增人員"
                    inputList={companyCreateData}
                    onClose={() => setPopupCreateActive(false)}
                    onSubmit={async (data) => {
                        try {
                            await CompanyAPI.create(data);
                            toast.success("公司資料已新增！");
                            setPopupCreateActive(false);
                            fetchData();
                        } catch (error) {
                            toast.error("新增失敗，請稍後再試。");
                        }
                    }}
                />
            )}
        </Layout>
    )
}