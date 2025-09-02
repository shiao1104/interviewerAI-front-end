import { InputFieldTypes } from "../types/inputFieldTypes";

export const createOpeningData: InputFieldTypes[] = [
  {
    name: "opening_name",
    label: "職缺名稱",
    type: "text",
    placeholder: "請輸入職缺名稱，例如：後端工程師",
  },
  {
    name: "opening_info",
    label: "職缺描述",
    type: "textarea",
    placeholder: "請詳細描述職缺內容，例如：負責API開發及資料庫設計",
  },
];
