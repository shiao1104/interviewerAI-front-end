import { InputFieldTypes } from "../types/inputFieldTypes";
import { companyType } from "./testData";

export const createJobData: InputFieldTypes[] = [
  {
    name: "position",
    label: "職位名稱",
    type: "text",
    placeholder: "請輸入職位名稱，例如：前端工程師",
  },
  {
    name: "salaryRange",
    label: "薪資範圍",
    type: "text",
    placeholder: "請輸入薪資範圍，例如：月薪 40,000~55,000 元",
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
    name: "educationRequirement",
    label: "學歷要求",
    type: "dropdown",
    placeholder: "請選擇學歷要求",
    dropdownData: companyType,
  },
  {
    name: "departmentRequirement",
    label: "科系限制",
    type: "text",
    placeholder: "請輸入科系限制，例如：資訊相關科系",
  },
  {
    name: "experienceRequirement",
    label: "工作經驗",
    type: "text",
    placeholder: "請輸入經驗需求，例如：需1年以上相關經驗",
  },
  {
    name: "languageRequirement",
    label: "語文條件",
    type: "text",
    placeholder: "請輸入語文條件，例如：英文中等以上",
  },
  {
    name: "workNature",
    label: "工作性質",
    type: "dropdown",
    placeholder: "請選擇工作性質",
    dropdownData: companyType,
  },
  {
    name: "workHours",
    label: "上班時段",
    type: "multiselect",
    placeholder: "請選擇上班時段",
    dropdownData: companyType,
  },
  {
    name: "leavePolicy",
    label: "休假制度",
    type: "dropdown",
    placeholder: "請選擇休假制度",
    dropdownData: companyType,
  },
  {
    name: "jobDescription",
    label: "職務描述",
    type: "textarea",
    placeholder: "請詳細描述職務內容與要求",
  },
  {
    name: "contactInfo",
    label: "聯絡方式 / 投遞方式",
    type: "text",
    placeholder: "請輸入聯絡方式，例如：hr@innotech.com.tw",
  },
];
