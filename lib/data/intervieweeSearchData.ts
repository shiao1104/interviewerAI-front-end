import { InputFieldTypes } from "../types/inputFieldTypes";
import { companyType } from "./testData";

export const intervieweeSearchData: InputFieldTypes[] = [
  {
    label: "ID",
    name: "position",
    type: "text",
  },
  {
    label: "姓名",
    name: "industry",
    type: "text",
  },
  {
    label: "應徵職位",
    name: "location",
    type: "dropdown",
    dropdownData: companyType,
  },
  {
    label: "面試狀態",
    name: "founded",
    type: "dropdown",
    dropdownData: companyType,
  },
];
