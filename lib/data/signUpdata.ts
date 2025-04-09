export interface FormField {
  label: string;
  type: string;
  name: string;
  autoFocus?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  validation: any;
}

// Form input values
export interface IFormInputs {
  name: string;
  email: string;
  password: string;
  "confirm-password": string;
  termsAgreed: boolean | string;
}

// Form fields configuration
export const formFields: FormField[] = [
  {
    label: "姓名",
    type: "text",
    name: "name",
    autoFocus: true,
    validation: {
      required: "請輸入您的姓名",
    },
  },
  {
    label: "Email",
    type: "email",
    name: "email",
    validation: {
      required: "請輸入Email",
      pattern: {
        value: /\S+@\S+\.\S+/,
        message: "請輸入正確Email格式之帳號",
      },
    },
  },
  {
    label: "密碼",
    type: "password",
    name: "password",
    validation: {
      required: "請輸入密碼",
      minLength: {
        value: 6,
        message: "請輸入6位數以上長度之密碼",
      },
    },
  },
  {
    label: "再次輸入密碼",
    type: "password",
    name: "confirm-password",
    validation: {
      required: "請再次輸入密碼",
      validate: (value: string, formValues: IFormInputs) =>
        value === formValues.password || "兩次輸入的密碼不一致",
    },
  },
  {
    label: "手機號碼",
    type: "tel",
    name: "phoneNumber",
    validation: {
      required: "請輸入您的手機號碼",
      pattern: {
        value: /^09\d{8}$/,
        message: "請輸入正確的台灣手機號碼格式（例如：0912345678）",
      },
    },
  },
  {
    label: "出生日期",
    type: "date",
    name: "birthDate",
    validation: {
      required: "請選擇您的出生日期",
    },
  },
  {
    label: "通訊地址",
    type: "text",
    name: "address",
    validation: {
      required: "請輸入您的通訊地址",
    },
  },
];

export const loginFields: FormField[] = [
    {
      label: "Email",
      type: "email",
      name: "email",
      validation: {
        required: "請輸入Email",
        pattern: {
          value: /\S+@\S+\.\S+/,
          message: "請輸入正確Email格式之帳號",
        },
      },
    },
    {
      label: "密碼",
      type: "password",
      name: "password",
      validation: {
        required: "請輸入密碼",
        minLength: {
          value: 6,
          message: "請輸入6位數以上長度之密碼",
        },
      },
    }
  ];
