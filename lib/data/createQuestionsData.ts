import { InputFieldTypes } from "../types/inputFieldTypes";
import { companyType } from "./testData";

export const createQuestionData: InputFieldTypes[] = [
  {
    label: "適用職位",
    name: "applicablePositions",
    type: "multiselect",
    placeholder: "請選擇適用職位",
    dropdownData: companyType,
  },
  {
    label: "問題類型",
    name: "questionType",
    type: "dropdown",
    placeholder: "請選擇問題類型",
    dropdownData: companyType,
  },
  {
    label: "問題內容",
    name: "questionContent",
    type: "text",
    placeholder: "請輸入問題內容",
  },
  {
    label: "回答時間上限",
    name: "timeLimit",
    type: "number",
    placeholder: "請輸入回答時間上限（秒）",
  },
  {
    label: "問題難易度",
    name: "timeLimit",
    type: "dropdown",
    placeholder: "請選擇問題難易度",
    dropdownData: companyType,
  },
  {
    label: "使用語言",
    name: "language",
    type: "dropdown",
    placeholder: "請選擇使用語言",
    dropdownData: companyType,
  },
  {
    label: "啟用狀態",
    name: "status",
    type: "switch",
    placeholder: "請選擇啟用狀態"
  },
];
