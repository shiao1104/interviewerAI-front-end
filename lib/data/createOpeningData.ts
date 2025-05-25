import { InputFieldTypes } from "../types/inputFieldTypes";
import { companyType } from "./testData";

export const createOpeningData: InputFieldTypes[] = [
  {
    name: "openingTitle",
    label: "職缺名稱",
    type: "text",
    placeholder: "請輸入職缺名稱，例如：前端工程師",
  },
  {
    name: "workLocation",
    label: "工作地點",
    type: "text",
    placeholder: "請輸入工作地點，例如：台北市信義區",
  },
  {
    name: "jobType",
    label: "工作類型",
    type: "dropdown",
    placeholder: "請選擇工作類型",
    dropdownData: companyType,
  },
  {
    name: "jobDescription",
    label: "職務描述",
    type: "textarea",
    placeholder: "請詳細描述職務內容與要求",
  },
  {
    name: "questionType",
    label: "題目類型",
    type: "dropdown",
    placeholder: "請選擇題目類型",
  },
  {
    name: "questionNumber",
    label: "題數",
    type: "number",
    placeholder: "請選擇預出題目數量",
  },
];
