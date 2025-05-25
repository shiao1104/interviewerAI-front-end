// import { InputFieldTypes } from "../types/inputFieldTypes";
// import { questionLevelData } from "./questionLevelData";

// export const createQuestionData: InputFieldTypes[] = [
//   {
//     label: "適用職位",
//     name: "applicablePositions",
//     type: "multiselect",
//     placeholder: "請選擇適用職位",
//   },
//   {
//     label: "問題類型",
//     name: "questionType",
//     type: "dropdown",
//     placeholder: "請選擇問題類型",
//   },
//   {
//     label: "問題內容",
//     name: "questionContent",
//     type: "text",
//     placeholder: "請輸入問題內容",
//   },
//   {
//     label: "回答時間上限",
//     name: "timeLimit",
//     type: "number",
//     placeholder: "請輸入回答時間上限（秒）",
//   },
//   {
//     label: "問題難易度",
//     name: "questionlevel",
//     type: "dropdown",
//     placeholder: "請選擇問題難易度",
//     dropdownData: questionLevelData,
//   },
//   {
//     label: "啟用狀態",
//     name: "status",
//     type: "switch",
//     placeholder: "請選擇啟用狀態"
//   },
// ];


import { InputFieldTypes } from "../types/inputFieldTypes";
import { questionLevelData } from "./questionLevelData";

export const createQuestionData: InputFieldTypes[] = [
  {
    label: "適用職位",
    name: "company_id", // ❗ 與後端欄位對應
    type: "dropdown",
    placeholder: "請選擇適用職位",
  },
  {
    label: "問題類型",
    name: "question_type_id", // ❗ 與後端欄位對應
    type: "dropdown",
    placeholder: "請選擇問題類型",
  },
  {
    label: "問題內容",
    name: "question", // ❗ 與後端欄位對應
    type: "text",
    placeholder: "請輸入問題內容",
  },
  {
    label: "回答時間上限",
    name: "time_allowed",
    type: "number",
    placeholder: "請輸入回答時間上限（秒）",
  },
  {
    label: "問題難易度",
    name: "difficulty",
    type: "dropdown",
    placeholder: "請選擇問題難易度",
    dropdownData: questionLevelData,
  },
  {
    label: "啟用狀態",
    name: "valid",
    type: "switch",
    placeholder: "請選擇啟用狀態"
  },
];
