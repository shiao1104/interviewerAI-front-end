import { Props } from "@/components/common/InputField";
import { companyType } from "./testData";

export const editCompanyInput: Props[] = [
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
    dropdownData: companyType
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
];
