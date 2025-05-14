import { companyType } from "./testData";
import { OptionsProps } from "@/components/common/InsertOptions";
import { InputFieldTypes } from "../types/inputFieldTypes";

export const editCompanyInput: InputFieldTypes[] = [
  {
    label: "公司名稱",
    name: "name",
    type: "text",
    placeholder: "請輸入公司名稱",
  },
  {
    label: "行業別",
    name: "industry",
    type: "dropdown",
    placeholder: "請選擇行業別",
    dropdownData: companyType,
  },
  {
    label: "公司地點",
    name: "location",
    type: "text",
    placeholder: "請輸入公司地點",
  },
  {
    label: "公司規模",
    name: "size",
    type: "number",
    placeholder: "請輸入公司人數",
  },
  {
    label: "成立年份",
    name: "founded",
    type: "date",
    placeholder: "請輸入成立年份",
  },
  {
    label: "公司網站",
    name: "website",
    type: "text",
    placeholder: "請輸入公司網站",
  },
  {
    label: "公司簡介",
    name: "description",
    type: "textarea",
    placeholder: "請描述公司的背景、業務範圍及目標等",
  },
  {
    label: "公司文化",
    name: "culture",
    type: "textarea",
    placeholder: "請描述公司的文化理念、價值觀等",
  },
];

export const editInsertOptions: OptionsProps[] = [
  {
    label: "員工福利",
    name: "benefits",
    type: "options",
    placeholder: '例如：五險一金、彈性工作時間',
  },
  {
    label: "主要專案",
    name: "projects",
    type: "options",
    placeholder: '例如：智能客服系統、跨境電商平台',
  },
];
