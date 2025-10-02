import { InputFieldTypes } from "../types/inputFieldTypes";
import { companyType, interviewStateData } from "./testData";

export const intervieweeSearchData: InputFieldTypes[] = [
  {
    label: "姓名",
    name: "name",
    type: "text",
  },
  // {
  //   label: "應徵職位",
  //   name: "type",
  //   type: "dropdown",
  //   dropdownData: companyType,
  // },
  {
    label: "面試結果",
    name: "interview_result",
    type: "dropdown",
    dropdownData: interviewStateData,
  },
];
