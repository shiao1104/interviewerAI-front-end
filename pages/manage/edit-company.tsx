import React, { useEffect, useState } from "react";
import { Add, Save } from "@mui/icons-material";
import Layout from "@/components/Layout/ManageLayout";
import InputField from "@/components/common/manage/InputField";
import { companyInfo } from "@/lib/data/testData";
import {
  Avatar,
  Box,
  Button,
  Paper,
  Typography,
  Grid,
  Divider,
  IconButton,
} from "@mui/material";
import KeyboardBackspace from "@mui/icons-material/KeyboardBackspace";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import EditIcon from "@mui/icons-material/Edit";
import { useRouter } from "next/router";
import { useFieldArray, useForm } from "react-hook-form";
import {
  editCompanyInput,
} from "@/lib/data/editCompanyInput";
import InsertOptions from "@/components/common/InsertOptions";
import CompanyAPI from "@/lib/api/CompanyAPI";
import { CompanyTypes } from "@/lib/types/companyTypes";

export default function EditCompanyInfo() {
  const formProps = useForm();
  const router = useRouter();
  const [formData] = useState<CompanyTypes>();
  const [companyBenefits, setCompanyBenefits] = useState<string[]>([]);

  const { fields, append, remove } = useFieldArray({
    control: formProps.control,
    name: "addresses"
  });

  useEffect(() => {
    const fetch = async () => {
      const response = await CompanyAPI.getData(1);
      const data = response.data as unknown as CompanyTypes;

      // 處理員工福利數據
      const benefits = data.company_benefits ? data.company_benefits.split('、') : [];
      setCompanyBenefits(benefits);

      formProps.reset({
        company_name: data.company_name,
        telephone: data.telephone,
        company_website: data.company_website,
        company_description: data.company_description,
        addresses: data.addresses,
        company_benefits: benefits // 設置為數組格式
      });
    }

    fetch();
  }, []);

  // 處理員工福利變更
  const handleBenefitsChange = (newBenefits: string[]) => {
    setCompanyBenefits(newBenefits);
    formProps.setValue('company_benefits', newBenefits);
  };

  const handleSubmit = formProps.handleSubmit((data) => {
    console.log("準備更新的數據:", {
      ...data,
      company_benefits: companyBenefits.join('、')
    });

    // 可以在這裡發送數據到 API
    // 例如: updateCompany({...data, company_benefits: companyBenefits.join('、')});

    alert("公司資訊更新成功！");

    // 更新後返回列表頁面
    router.push("/manage");
  });

  return (
    <Layout>
      <Box
        sx={{
          p: 3,
          margin: "2rem auto",
          maxWidth: "1000px",
          borderRadius: "16px",
        }}
      >
        <Button
          startIcon={<KeyboardBackspace />}
          onClick={() => router.push("/manage")}
        >
          返回列表
        </Button>

        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            variant="h4"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mt: "1rem",
            }}
          >
            <EditIcon color="primary" sx={{ fontSize: "35px" }} />
            編輯公司資訊
          </Typography>

          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={handleSubmit}
            sx={{ height: "40px" }}
          >
            儲存更新
          </Button>
        </Box>

        <Paper
          component="form"
          onSubmit={handleSubmit}
          elevation={2}
          sx={{
            mt: "2rem",
            p: 3,
            borderRadius: 2,
            backgroundColor: "#fff",
          }}
        >
          {/* 基本信息區塊 */}
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            公司基本資訊
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            請填寫公司的基本資訊，這些資訊將顯示在公司主頁上
          </Typography>

          {/* 公司標誌區塊 */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
            <Box sx={{ position: "relative", mr: 3 }}>
              {/* <Avatar
                src={formData.logo}
                alt={formData.name}
                sx={{ width: 100, height: 100 }}
              >
                {formData.name && formData.name[0]}
              </Avatar> */}
              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  backgroundColor: "white",
                  borderRadius: "50%",
                  padding: "4px",
                  border: "1px solid #e0e0e0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <PhotoCameraIcon fontSize="small" />
              </Box>
            </Box>
            <Box>
              <Typography variant="body2" gutterBottom>
                公司標誌
              </Typography>
              <Typography variant="caption" color="text.secondary">
                建議上傳尺寸為 400x400 像素的圖片
              </Typography>
            </Box>
          </Box>

          {/* 公司基本信息表單 */}
          <Grid
            container
            sx={{
              mb: '1rem',
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr"
              },
              gap: "1rem",
            }}
          >
            {editCompanyInput.slice(0, 4).map((item, index) => (
              <Grid key={index}>
                <InputField
                  name={item.name}
                  label={item.label}
                  type={item.type}
                  placeholder={item.placeholder}
                  dropdownData={item.dropdownData}
                  formProps={formProps}
                />
              </Grid>
            ))}
          </Grid>

          <Grid
            container
            sx={{
              mb: '1rem',
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: ".5rem",
            }}>
            <Grid sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography>
                公司地點（可新增多筆）
              </Typography>

              <IconButton onClick={() => append({ value: "" })}>
                <Add />
              </IconButton>
            </Grid>

            <Grid sx={{
              display: "grid", columnGap: '1rem',
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr"
              },
            }}>
              {fields.map((field, index) => (
                <Box key={field.id} sx={{
                  display: 'grid',
                  columnGap: '5px',
                  mb: 2,
                  gridTemplateColumns: "1fr auto",
                }}>
                  <InputField
                    name={`addresses.${index}`}
                    label={''}
                    type="text"
                    placeholder="輸入公司地址"
                    formProps={formProps}
                  />
                  <Button variant="outlined" color="error" onClick={() => remove(index)}>
                    移除
                  </Button>
                </Box>
              ))}
            </Grid>
          </Grid>

          <Grid
            container
            sx={{
              mb: '1rem',
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: "1rem",
            }}
          >
            {editCompanyInput.slice(4).map((item, index) => (
              <Grid key={index}>
                <InputField
                  name={item.name}
                  label={item.label}
                  type={item.type}
                  placeholder={item.placeholder}
                  dropdownData={item.dropdownData}
                  formProps={formProps}
                />
              </Grid>
            ))}
          </Grid>

          {/* 員工福利區塊 - 修復後的部分 */}
          {/* 員工福利區塊 - 直接渲染單個組件 */}
          <Box sx={{ mb: 2 }}>
            <InsertOptions
              name="company_benefits"
              label="員工福利"
              type="text"
              placeholder="請輸入員工福利"
              initialOptions={companyBenefits}
              onChange={handleBenefitsChange}
            />
          </Box>
        </Paper>
      </Box>
    </Layout>
  );
}