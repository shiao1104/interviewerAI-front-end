import { InputFieldTypes } from "../types/inputFieldTypes";
import { questionLevelData } from "./questionLevelData";

export const createQuestionData: InputFieldTypes[] = [
  {
    label: "問題類型",
    name: "question_type",
    type: "dropdown",
    placeholder: "請選擇問題類型",
  },
  {
    label: "問題難易度",
    name: "difficulty",
    type: "dropdown",
    placeholder: "請選擇問題難易度",
    dropdownData: questionLevelData,
  },
  {
    label: "回答時間上限",
    name: "time_allowed",
    type: "number",
    placeholder: "請輸入回答時間上限（秒）",
  },
  {
    label: "問題內容",
    name: "question",
    type: "text",
    placeholder: "請輸入問題內容",
  },
];
