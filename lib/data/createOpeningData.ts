import { InputFieldTypes } from "../types/inputFieldTypes";

export const createOpeningData: InputFieldTypes[] = [
  {
    name: "opening_name",
    label: "職缺名稱",
    type: "text",
    placeholder: "請輸入職缺名稱，例如：後端工程師",
  },
  {
    name: "workplace_location",
    label: "工作地點",
    type: "text",
    placeholder: "請輸入工作地點，例如：台北市松山區",
  },
  {
    name: "employment_type",
    label: "工作類型",
    type: "dropdown",
    placeholder: "請選擇工作類型",
    dropdownData: [
      { key: "全職", value: "全職" },
      { key: "兼職", value: "兼職" },
      { key: "約聘", value: "約聘" },
      { key: "實習", value: "實習" },
    ],
  },
  {
    name: "opening_info",
    label: "職缺描述",
    type: "textarea",
    placeholder: "請詳細描述職缺內容，例如：負責API開發及資料庫設計",
  },
];
