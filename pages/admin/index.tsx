import PopupModal from "@/components/common/admin/PopupModal";
import DataTable from "@/components/common/DataTables";
import SearchBar from "@/components/common/searchBar";
import Layout from "@/components/Layout/AdminLayout";
import CompanyAPI from "@/lib/api/CompanyAPI";
import { companyCreateData } from "@/lib/data/admin/companyCreateData";
import { companySearchData } from "@/lib/data/admin/companySearchData";
import { useLoading } from "@/lib/hook/loading";
import { SearchType } from "@/lib/types/searchTypes";
import { AccountCircle, Add, Delete, Edit, MoreHoriz } from "@mui/icons-material";
import { Box, Typography, Button, IconButton } from "@mui/material";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function Company() {
    const { showLoading, hideLoading } = useLoading()
    const formProps = useForm();
    const [searchParams, setSearchParams] = useState<any>();
    const [filterDataList, setFilterDataList] = useState<any>([]);
    const [companyData, setCompanyData] = useState<any>([]);
    const [popupCreateActive, setPopupCreateActive] = useState(false);
    const [popupEditActive, setPopupEditActive] = useState(false);
    const [editingCompany, setEditingCompany] = useState<any>(null);

    const handleEdit = async (row: any) => {
        showLoading();

        try {
            const res = await CompanyAPI.getData(row.company_id);
            setEditingCompany(res.data);
            setPopupEditActive(true);
        } catch (error) {
            toast.error("無法載入公司資訊");
        } finally { hideLoading() }
    };

    const handleUpdate = async (formData: any) => {
        showLoading();

        formData = {
            ...formData,
            'industry': formData.industry_name
        }

        delete formData.industry_name;
        try {
            await CompanyAPI.update(formData, formData.company_id);
            toast.success("公司資料已更新！");
            setPopupEditActive(false);
            setEditingCompany(null);
            fetchData();
        } catch (error) {
            toast.error("更新失敗，請稍後再試。");
        } finally { hideLoading() }
    };


    const deleteCompany = async (id: number) => {
        showLoading();

        try {
            await CompanyAPI.delete(id);
            toast.success("公司資料已成功刪除！");
            fetchData();
        } catch (error) {
            toast.error("無法刪除公司資料，請稍後再試。");
        } finally { hideLoading() }
    };

    const submit = async (data: any) => {
        showLoading();

        data = {
            ...data,
            'industry': data.industry_name
        }

        delete data.industry_name;
        try {
            await CompanyAPI.create(data);
            toast.success("公司資料已新增！");
            setPopupCreateActive(false);
            fetchData();
        } catch (error) {
            toast.error("新增失敗，請稍後再試。");
        } finally { hideLoading() }
    }

    const columns = [
        { id: "company_id", label: "ID", sortable: true },
        { id: "company_name", label: "公司名稱", textAlign: "center" },
        { id: "industry_name", label: "公司類別", textAlign: "center" },
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
                        onClick={() => deleteCompany(row.company_id)}
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
        showLoading();
        try {
            const response = await CompanyAPI.getData();
            setCompanyData(response.data);
            setFilterDataList(response.data);
        } catch (error) {
            toast.error("無法載入公司資料，請稍後再試。");
        } finally { hideLoading() }
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
                        公司列表
                    </Typography>

                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<Add />}
                        onClick={() => setPopupCreateActive(true)}
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
                    <DataTable columns={columns} data={filterDataList} />
                </Box>
            </Box>
            {popupEditActive && editingCompany && (
                <PopupModal
                    title="編輯公司資訊"
                    inputList={companyCreateData}
                    defaultValues={editingCompany}
                    onClose={() => setPopupEditActive(false)}
                    onSubmit={handleUpdate}
                />
            )}
            {popupCreateActive && (
                <PopupModal
                    title="新增公司"
                    inputList={companyCreateData}
                    onClose={() => setPopupCreateActive(false)}
                    onSubmit={(data) => submit(data)}
                />
            )}
        </Layout>
    )
}