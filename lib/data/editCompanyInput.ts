import { companyType } from "./testData";
import { OptionsProps } from "@/components/common/InsertOptions";
import { InputFieldTypes } from "../types/inputFieldTypes";

export const editCompanyInput: InputFieldTypes[] = [
  {
    label: "公司名稱",
    name: "company_name",
    type: "text",
    placeholder: "請輸入公司名稱",
  },
  {
    label: "行業別",
    name: "industry_id",
    type: "dropdown",
    placeholder: "請選擇行業別",
    dropdownData: companyType,
  },
  {
    label: "連絡電話",
    name: "telephone",
    type: "text",
    placeholder: "請輸入連絡電話",
  },
  {
    label: "公司網站",
    name: "company_website",
    type: "text",
    placeholder: "請輸入公司網站",
  },
  {
    label: "公司簡介",
    name: "company_description",
    type: "textarea",
    placeholder: "請描述公司的背景、業務範圍及目標等",
  },
];

export const editInsertOptions: OptionsProps[] = [
  {
    label: "員工福利",
    name: "company_benefits",
    type: "options",
    placeholder: '例如：五險一金、彈性工作時間',
  },
];
