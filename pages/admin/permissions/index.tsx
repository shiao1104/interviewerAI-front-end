import PopupModal from "@/components/common/admin/PopupModal";
import DataTable from "@/components/common/DataTables";
import SearchBar from "@/components/common/searchBar";
import Layout from "@/components/Layout/AdminLayout";
import AdminAPI from "@/lib/api/AdminAPI";
import { permissionCreateData } from "@/lib/data/admin/permissionCreateData";
import { permissionSearchData } from "@/lib/data/admin/permissionSearchData";
import { useLoading } from "@/lib/hook/loading";
import { SearchType } from "@/lib/types/searchTypes";
import { AccountCircle, Add, Delete, Edit } from "@mui/icons-material";
import { Box, Typography, Button, IconButton, Chip } from "@mui/material";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function Permissions() {
    const { showLoading, hideLoading } = useLoading()
    const formProps = useForm();
    const [searchParams, setSearchParams] = useState<any>();
    const [filterDataList, setFilterDataList] = useState<any>([]);
    const [companyData, setCompanyData] = useState<any>([]);
    const [popupCreateActive, setPopupCreateActive] = useState(false);
    const [popupEditActive, setPopupEditActive] = useState(false);
    const [editingCompany, setEditingCompany] = useState<any>(null);

    const columns = [
        { id: "id", label: "ID" },
        { id: "username", label: "姓名", textAlign: "center" },
        { id: "email", label: "email", textAlign: "center" },
        {
            id: "auth",
            label: "權限",
            sortable: true,
            textAlign: "center",
            render: (_: any, row: { is_staff: boolean, is_superuser: boolean }) => (
                <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
                    {row.is_staff ? <Chip label={'公司端'} color="primary" variant="outlined" /> :
                        row.is_superuser ? <Chip label={'管理者'} color="warning" variant="outlined" /> :
                            <Chip label={'面試者'} color="success" variant="outlined" />}

                </Box>
            ),
        },
        {
            id: "actions",
            label: "操作",
            render: (_: any, row: { id: any; }) => (
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
                        onClick={() => deleteCompany(row.id)}
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
            const response = await AdminAPI.getData();
            setCompanyData(response.data);
            setFilterDataList(response.data);
        } catch (error) {
            toast.error("無法載入公司資料，請稍後再試。");
        } finally { hideLoading(); }
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
                if (!value) return true;

                if (key === 'auth') {
                    if (value === '公司端') {
                        return item.is_staff === true;
                    } else if (value === '管理者') {
                        return item.is_superuser === true;
                    } else if (value === '面試者') {
                        return !item.is_staff && !item.is_superuser;
                    }
                }

                const itemValue = item[key]?.toString().toLowerCase() || '';
                const searchValue = value.toString().toLowerCase();
                return itemValue.includes(searchValue);
            });
        });

        setFilterDataList(filtered);
    };

    useEffect(() => {
        if (companyData.length > 0) {
            filterData(searchParams);
        }
    }, [companyData, searchParams]);

    const handleEdit = async (row: any) => {
        showLoading();

        try {
            const res = await AdminAPI.getRecord(row.id);
            setEditingCompany(res.data);
            setPopupEditActive(true);
        } catch (error) {
            toast.error("無法載入資訊");
        } finally { hideLoading(); }
    };

    const handleUpdate = async (formData: any) => {
        showLoading();

        let dataList = formData;

        if (formData.auth == 0) {
            dataList = {
                ...formData,
                is_staff: true,
                company_id: dataList.company
            }
        } else if (formData.auth == 1) {
            dataList = {
                ...formData,
                is_superuser: true
            }
        }
        delete dataList.auth;
        delete dataList.company

        try {
            await AdminAPI.update(formData.id, formData);
            toast.success("更新成功");
            setPopupEditActive(false);
            setEditingCompany(null);
            fetchData();
        } catch (error) {
            toast.error("更新失敗，請稍後再試。");
        } finally { hideLoading(); }
    };


    const deleteCompany = async (id: string) => {
        showLoading();

        try {
            await AdminAPI.delete(id);
            toast.success("刪除成功");
            fetchData();
        } catch (error) {
            window.location.reload();
        } finally { hideLoading(); }
    };

    const submit = async (data: any) => {
        showLoading();

        let dataList = data;

        if (data.auth == 0) {
            dataList = {
                ...data,
                is_staff: true
            }
        } else if (data.auth == 1) {
            dataList = {
                ...data,
                is_superuser: true
            }
        }
        delete dataList.auth;

        try {
            await AdminAPI.create(dataList);
            toast.success("新增成功！");
            setPopupCreateActive(false);
            fetchData();
        } catch (error) {
            toast.error("新增失敗，請稍後再試。");
        } finally { hideLoading(); }
    }

    const handleResetFilter = () => {
        window.location.reload();
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


                <Box sx={{ display: "flex", alignItems: "center", justifyContent: 'end', gap: 1 }}>
                    <SearchBar
                        items={permissionSearchData}
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
                    }}
                >
                    <DataTable columns={columns} data={filterDataList} />
                </Box>
            </Box>
            {popupEditActive && editingCompany && (
                <PopupModal
                    title="編輯人員資訊"
                    inputList={permissionCreateData}
                    defaultValues={editingCompany}
                    onClose={() => setPopupEditActive(false)}
                    onSubmit={handleUpdate}
                />
            )}
            {popupCreateActive && (
                <PopupModal
                    title="新增人員"
                    inputList={permissionCreateData}
                    onClose={() => setPopupCreateActive(false)}
                    onSubmit={data => submit(data)}
                />
            )}
        </Layout>
    )
}