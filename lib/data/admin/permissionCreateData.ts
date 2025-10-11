import { InputFieldTypes } from "@/lib/types/inputFieldTypes";

export const permissionCreateData: InputFieldTypes[] = [
  {
    name: "username",
    label: "姓名",
    type: "text",
  },
  {
    name: "email",
    label: "Email",
    type: "text",
  },
  {
    name: "auth",
    label: "權限",
    type: "dropdown",
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
  },
  {
    name: "company",
    label: "公司名稱",
    type: "dropdown",
  },
];
