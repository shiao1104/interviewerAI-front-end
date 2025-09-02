import { InputFieldTypes } from "../types/inputFieldTypes";
import { companyType } from "./testData";

export const intervieweeInput: InputFieldTypes[] = [
  {
    label: "姓名",
    name: "name",
    type: "text",
    placeholder: "請輸入面試者姓名",
  },
  {
    label: "聯絡電話",
    name: "phone_number",
    type: "text",
    placeholder: "請輸入聯絡電話",
  },
  {
    label: "電子郵件",
    name: "email",
    type: "text",
    placeholder: "請輸入電子郵件",
  },
  {
    label: "應徵職位",
    name: "opening",
    type: "dropdown",
    placeholder: "請輸入應徵職位",
    dropdownData: companyType,
  },
  {
    label: "履歷上傳",
    name: "resume",
    type: "file",
    placeholder: "請上傳履歷 (PDF 或 DOCX)",
  },
  {
    label: "備註",
    name: "remark",
    type: "textarea",
    placeholder: "其他需要補充的資訊",
  },
  {
    label: "面試日期",
    name: "interview_date",
    type: "date",
    placeholder: "請選擇面試日期",
  },
  {
    label: "面試時間",
    name: "interview_time",
    type: "time",
    placeholder: "請選擇面試日期",
  },
];
