import { InputFieldTypes } from "@/lib/types/inputFieldTypes";

export const permissionSearchData: InputFieldTypes[] = [
  {
    label: "姓名",
    name: "username",
    type: "text",
  },
  {
    label: "權限",
    name: "auth",
    type: "dropdown",
    placeholder: '請選擇權限類別',
    dropdownData: [
      {
        'key': 0,
        'value': '公司端'
      },
      {
        'key': 1,
        'value': '管理者'
      }
    ]
  }
];
