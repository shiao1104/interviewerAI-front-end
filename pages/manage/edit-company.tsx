import React, { useEffect, useState, useRef } from "react";
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
import axios from "axios";
import { DropdownTypes } from "@/lib/types/dropdownTypes";
import { toast } from "react-toastify";

export default function EditCompanyInfo() {
  const formProps = useForm();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [companyBenefits, setCompanyBenefits] = useState<string[]>([]);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [dropdownOptions, setDropdownOptions] = useState<{
    industry_id: DropdownTypes[];
  }>({
    industry_id: [],
  });

  const { fields, append, remove } = useFieldArray({
    control: formProps.control,
    name: "addresses"
  });

  useEffect(() => {
    const fetch = async () => {
      const response = await axios.all([
        CompanyAPI.getData(11),
        CompanyAPI.getIndustryList()
      ]);
      const data = response[0].data as unknown as CompanyTypes;

      const benefits = data.company_benefits ? data.company_benefits.split('、') : [];
      setCompanyBenefits(benefits);

      // 設置現有的頭像預覽
      // if (data.company_avatar) {
      //   setAvatarPreview(data.company_avatar);
      // }

      // 處理新的addresses格式
      const processedAddresses = data.addresses || [];

      formProps.reset({
        company_id: data.company_id,
        company_name: data.company_name,
        telephone: data.telephone,
        company_website: data.company_website,
        company_description: data.company_description,
        industry_id: data.industry_id,
        addresses: processedAddresses,
        company_benefits: benefits
      });

      setDropdownOptions({
        industry_id: response[1].data || []
      });
    }

    fetch();
  }, []);

  const handleBenefitsChange = (newBenefits: string[]) => {
    setCompanyBenefits(newBenefits);
    formProps.setValue('company_benefits', newBenefits);
  };

  // 處理頭像上傳
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // 驗證文件類型
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('請上傳 JPG、PNG 或 GIF 格式的圖片');
        return;
      }

      // 驗證文件大小 (限制為 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('圖片大小不能超過 5MB');
        return;
      }

      setAvatarFile(file);

      // 創建預覽URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = formProps.handleSubmit(async (data) => {
    // 處理addresses數據，確保格式正確
    const processedAddresses = data.addresses?.map((addr: any) => {
      // 如果是新增的地址（沒有address_id）
      if (!addr.address_id) {
        return {
          address: addr.address || addr // 支援兩種可能的格式
        };
      }
      // 如果是既有的地址（有address_id）
      return {
        address_id: addr.address_id,
        address: addr.address
      };
    }) || [];

    const dataList = {
      ...data,
      company_benefits: companyBenefits.join('、'),
      addresses: processedAddresses
    } as any;

    const fetch = async () => {
      try {
        // 如果有新的頭像文件，先上傳頭像
        if (avatarFile) {
          const formData = new FormData();
          formData.append('avatar', avatarFile);
          formData.append('company_id', data.company_id);
        }

        const response = await CompanyAPI.update(dataList);
        router.push('/manage');
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
      }
    };
    fetch();
  });

  // 新增地址時使用新格式
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
          {/* 基本信息區塊 */}
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            公司基本資訊
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            請填寫公司的基本資訊，這些資訊將顯示在公司主頁上
          </Typography>

          {/* 公司頭像上傳區塊 */}
          <Box sx={{ mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
              公司標誌 / 大頭照
            </Typography>

            <Box sx={{ position: 'relative', mb: 2 }}>
              <Avatar
                src={avatarPreview}
                sx={{
                  width: 120,
                  height: 120,
                  cursor: 'pointer',
                  border: '2px dashed #ccc',
                  '&:hover': {
                    border: '2px dashed #1976d2',
                  }
                }}
                onClick={handleAvatarClick}
              >
                {!avatarPreview && <PhotoCameraIcon sx={{ fontSize: 40, color: 'grey.500' }} />}
              </Avatar>

              <IconButton
                sx={{
                  position: 'absolute',
                  bottom: -5,
                  right: -5,
                  backgroundColor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                  width: 35,
                  height: 35,
                }}
                onClick={handleAvatarClick}
              >
                <PhotoCameraIcon fontSize="small" />
              </IconButton>
            </Box>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarChange}
              accept="image/jpeg,image/jpg,image/png,image/gif"
              style={{ display: 'none' }}
            />

            <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center' }}>
              點擊上傳公司標誌或大頭照<br />
              支援 JPG、PNG、GIF 格式，檔案大小不超過 5MB
            </Typography>
          </Box>

          <Divider sx={{ mb: 3 }} />

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
              gap: ".5rem",
            }}>
            <Grid sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography>
                公司地點（可新增多筆）
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

          <Box sx={{display: 'flex', justifyContent: 'end', mt: '3rem'}}>
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