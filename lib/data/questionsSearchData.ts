import { InputFieldTypes } from "../types/inputFieldTypes";
import { companyType } from "./testData";

export const questionsSearchData: InputFieldTypes[] = [
  {
    label: "針對職位",
    name: "position",
    type: "dropdown",
    dropdownData: companyType,
  },
  {
    label: "問題類型",
    name: "industry",
    type: "dropdown",
    dropdownData: companyType,
  },
  {
    label: "問題內容",
    name: "location",
    type: "text",
  },
  {
    label: "作答時間",
    name: "size",
    type: "number",
  },
  {
    label: "難易度",
    name: "founded",
    type: "dropdown",
    dropdownData: companyType,
  },
];