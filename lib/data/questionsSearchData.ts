import { InputFieldTypes } from "../types/inputFieldTypes";
import { levelData } from "./dropdownData";

export const questionsSearchData: InputFieldTypes[] = [
  {
    label: "問題內容",
    name: "location",
    type: "text",
  },
  {
    label: "難易度",
    name: "founded",
    type: "dropdown",
    dropdownData: levelData,
    placeholder: '請選擇難易度'
  },
];