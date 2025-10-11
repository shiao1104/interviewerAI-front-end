import { Box, Button, TextField, Typography, IconButton, MenuItem } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import CompanyAPI from "@/lib/api/CompanyAPI";
import { DropdownTypes } from "@/lib/types/dropdownTypes";

export default function PopupModal({
    title,
    inputList,
    defaultValues,
    onClose,
    onSubmit,
}: {
    title: string,
    inputList?: any[],
    defaultValues?: any,
    onClose: () => void,
    onSubmit: (data: any) => void
}) {
    const { register, handleSubmit, reset, watch } = useForm({
        defaultValues,
    });
    const [companyList, setCompanyList] = useState<DropdownTypes[]>([]);
    const [typeList, setTypeList] = useState<DropdownTypes[]>([]);

    const fetchDropdown = async () => {
        try {
            const companyResponse = await CompanyAPI.getData();
            const industryResponse = await CompanyAPI.getIndustryList();

            const companyList: any[] = companyResponse.data ?? [];
            const industryList: any[] = industryResponse.data ?? [];
            const transformedCompanyList = companyList.map((item: any) => ({
                key: item.company_id,
                value: item.company_name
            }));
            setCompanyList(transformedCompanyList);
            setTypeList(industryList);
        } catch { }
    }

    useEffect(() => {
        fetchDropdown();

        if (!defaultValues) { return; }
        let data;
        data = {
            ...defaultValues,
            'auth': defaultValues.is_staff ? 0 : defaultValues.is_superuser ? 1 : 2,
            'company': defaultValues.company_id ? defaultValues.company_id : '',
            'industry_name': defaultValues.industry_id

        }
        reset(data);
    }, [])

    const handleFormSubmit = (data: any) => {
        onSubmit(data);
        reset();
    };

    return (
        <>
            <Box
                sx={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    backdropFilter: "blur(4px)",
                    zIndex: 1000,
                }}
                onClick={onClose}
            />

            <Box
                sx={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                    borderRadius: 2,
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                    minWidth: "400px",
                    maxWidth: "500px",
                    width: "90%",
                    maxHeight: "80vh",
                    overflow: "hidden",
                    zIndex: 1001,
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        p: 2,
                        pb: 2,
                        borderBottom: "1px solid #f0f0f0",
                    }}
                >
                    <Typography
                        variant="h5"
                        component="h2"
                        sx={{
                            fontWeight: 600,
                            color: "#2c3e50",
                            fontSize: "1.5rem",
                        }}
                    >
                        {title}
                    </Typography>
                    <IconButton
                        onClick={onClose}
                        sx={{
                            color: "#64748b",
                            "&:hover": {
                                backgroundColor: "#f1f5f9",
                                color: "#475569",
                            },
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </Box>

                <Box sx={{ p: 3, maxHeight: "60vh", overflow: "auto" }}>
                    <form onSubmit={handleSubmit(handleFormSubmit)}>
                        {inputList?.map((input, index) => {
                            const isLastItem = index === inputList.length - 1;
                            const authValue = watch('auth');
                            if (isLastItem && authValue !== 0) {
                                return null;
                            }

                            return (
                                <Box key={index} sx={{ mb: 3 }}>
                                    <Typography
                                        component="label"
                                        sx={{
                                            display: "block",
                                            mb: 1,
                                            fontWeight: 500,
                                            color: "#374151",
                                            fontSize: "0.9rem",
                                        }}
                                    >
                                        {input.label}
                                    </Typography>

                                    {input.type === "dropdown" ? (
                                        <TextField
                                            select
                                            fullWidth
                                            value={watch(input.name) ?? ""}
                                            {...register(input.name)}
                                            variant="outlined"
                                            size="medium"
                                            sx={{
                                                "& .MuiOutlinedInput-root": {
                                                    borderRadius: 2,
                                                    backgroundColor: "#fafafa",
                                                    "&:hover": {
                                                        backgroundColor: "#f5f5f5",
                                                    },
                                                    "&.Mui-focused": {
                                                        backgroundColor: "#ffffff",
                                                    },
                                                },
                                            }}
                                        >
                                            {input.name == 'company' ?
                                                companyList?.map((option: any, idx: number) => (
                                                    <MenuItem key={idx} value={option.key}>
                                                        {option.value}
                                                    </MenuItem>
                                                ))
                                                :
                                                input.name == 'industry_name' ?
                                                    typeList?.map((option: any, idx: number) => (
                                                        <MenuItem key={idx} value={option.key}>
                                                            {option.value}
                                                        </MenuItem>
                                                    ))
                                                    :
                                                    input.dropdownData?.map((option: any, idx: number) => (
                                                        <MenuItem key={idx} value={option.key}>
                                                            {option.value}
                                                        </MenuItem>
                                                    ))
                                            }
                                        </TextField>
                                    ) : (
                                        <TextField
                                            type={input.type}
                                            placeholder={input.placeholder}
                                            {...register(input.name)}
                                            fullWidth
                                            variant="outlined"
                                            size="medium"
                                            sx={{
                                                "& .MuiOutlinedInput-root": {
                                                    borderRadius: 2,
                                                    backgroundColor: "#fafafa",
                                                    "&:hover": {
                                                        backgroundColor: "#f5f5f5",
                                                    },
                                                    "&.Mui-focused": {
                                                        backgroundColor: "#ffffff",
                                                    },
                                                },
                                            }}
                                        />
                                    )}
                                </Box>)
                        })}

                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "flex-end",
                                gap: 2,
                                pt: 2,
                                borderTop: "1px solid #f0f0f0",
                                mt: 1,
                            }}
                        >
                            <Button onClick={onClose} variant="outlined">取消</Button>
                            <Button type="submit" variant="contained">儲存</Button>
                        </Box>
                    </form>
                </Box>
            </Box>
        </>
    );
}
