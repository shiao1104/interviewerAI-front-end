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
  },
  {
    name: "",
    label: "",
    type: "",
  },
];
