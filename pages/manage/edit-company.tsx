import React, { useEffect, useState, useRef } from "react";
import { Add, Save } from "@mui/icons-material";
import Layout from "@/components/Layout/ManageLayout";
import InputField from "@/components/common/manage/InputField";
import {
  Box,
  Button,
  Paper,
  Typography,
  Grid,
  IconButton,
} from "@mui/material";
import KeyboardBackspace from "@mui/icons-material/KeyboardBackspace";
import EditIcon from "@mui/icons-material/Edit";
import { useRouter } from "next/router";
import { useFieldArray, useForm } from "react-hook-form";
import {
  editCompanyInput,
} from "@/lib/data/editCompanyInput";
import InsertOptions from "@/components/common/InsertOptions";
import CompanyAPI from "@/lib/api/CompanyAPI";
import { CompanyTypes } from "@/lib/types/companyTypes";
import axios from "axios";
import { DropdownTypes } from "@/lib/types/dropdownTypes";
import { toast } from "react-toastify";
import { useLoading } from "@/lib/hook/loading";

export default function EditCompanyInfo() {
  const formProps = useForm();
  const router = useRouter();
  const { showLoading, hideLoading } = useLoading();
  const [companyBenefits, setCompanyBenefits] = useState<string[]>([]);
  const [dropdownOptions, setDropdownOptions] = useState<{
    industry_id: DropdownTypes[];
  }>({
    industry_id: [],
  });

  const { fields, append, remove } = useFieldArray({
    control: formProps.control,
    name: "addresses"
  });


  const fetch = async () => {
    try {
      const response = await axios.all([
        // TODO: 這裡的 company_id 先寫死，之後要改成動態抓取
        CompanyAPI.getData(11),
        CompanyAPI.getIndustryList()
      ]);
      const data = response[0].data as unknown as CompanyTypes;

      const benefits = data.company_benefits ? data.company_benefits.split('、') : [];
      setCompanyBenefits(benefits);

      formProps.reset({
        company_id: data.company_id,
        company_name: data.company_name,
        telephone: data.telephone,
        company_website: data.company_website,
        company_description: data.company_description,
        industry_id: data.industry_id,
        address: data.address,
        addresses: data.addresses?.length ? data.addresses : [{ address: "" }],
        company_benefits: benefits
      });

      setDropdownOptions({
        industry_id: response[1].data || []
      });
    } catch (err) {
      toast.error("無法獲取公司資料，請稍後再試。");
    } finally {
      hideLoading();
    }
  };

  useEffect(() => {
    showLoading();
    fetch();
  }, []);

  const handleBenefitsChange = (newBenefits: string[]) => {
    setCompanyBenefits(newBenefits);
    formProps.setValue('company_benefits', newBenefits);
  };

  const handleSubmit = formProps.handleSubmit(async (data) => {
    showLoading();

    const dataList = {
      ...data,
      company_benefits: companyBenefits.join('、'),
      industry: data.industry_id
    } as any;

    try {
      const response = await CompanyAPI.update(dataList, data.company_id);
      toast.success(response.message, {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      router.push('/manage');
    } catch (err: any) {
      toast.error(err.message, {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } finally {
      hideLoading();
    }
  });

  const handleAddAddress = () => {
    append({ address: "" });
  };

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
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            公司基本資訊
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            請填寫公司的基本資訊，這些資訊將顯示在公司主頁上
          </Typography>

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
                  dropdownData={
                    dropdownOptions[
                    item.name as keyof typeof dropdownOptions
                    ] || []
                  }
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
              gap: "1rem",
            }}
          >
            <InputField
              name={"address"}
              label={"總公司地點"}
              type={"text"}
              placeholder={"輸入總公司地址"}
              formProps={formProps}
            />
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
                分公司地點（可新增多筆）
              </Typography>

              <IconButton onClick={handleAddAddress}>
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
                    name={`addresses.${index}.address`}
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

          <Box sx={{ display: 'flex', justifyContent: 'end', mt: '3rem' }}>
            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={handleSubmit}
              sx={{ height: "40px" }}
            >
              儲存更新
            </Button>
          </Box>
        </Paper>
      </Box>
    </Layout>
  );
}