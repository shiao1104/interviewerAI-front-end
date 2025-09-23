import { InputFieldTypes } from "@/lib/types/inputFieldTypes";

export const companyCreateData: InputFieldTypes[] = [
  {
    name: "company_name",
    label: "公司名稱",
    type: "text",
    placeholder: "請輸入公司名稱，例如：XX科技有限公司",
  },
  {
    name: "industry_name",
    label: "產業類別",
    type: "dropdown",
    placeholder: "請輸入公司名稱，例如：XX科技有限公司",
    dropdownData: [
      { key: 1, value: "男" },
      { key: 2, value: "女" },
    ],
  },
];
