import { Props } from "@/components/common/InputField";
import { companyType } from "./testData";

export const questionsSearchData: Props[] = [
  {
    label: "針對職位",
    name: "name",
    type: "dropdown",
    placeholder: "請輸入公司名稱",
    dropdownData: companyType,
  },
  {
    label: "問題類型",
    name: "industry",
    type: "dropdown",
    placeholder: "請選擇行業別",
    dropdownData: companyType,
  },
  {
    label: "問題內容",
    name: "location",
    type: "text",
    placeholder: "請輸入公司地點",
  },
  {
    label: "作答時間",
    name: "size",
    type: "number",
    placeholder: "請輸入公司人數",
  },
  {
    label: "難易度",
    name: "founded",
    type: "dropdown",
    placeholder: "請輸入成立年份",
    dropdownData: companyType,
  },
];
