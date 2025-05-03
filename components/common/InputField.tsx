import { MenuItem, TextField } from "@mui/material";

export type DropdownOption = {
  key: number;
  value: string;
};

export type Props = {
  name: string;
  label: string;
  type: string;
  placeholder?: string;
  dropdownData?: DropdownOption[]; // ← 改為陣列
  formProps?: any;
};

export default function InputField({
  name,
  label,
  type,
  placeholder,
  dropdownData,
  formProps,
}: Props) {
  const { register } = formProps;
  const today = new Date().toISOString().split("T")[0];

  const renderField = () => {
    switch (type) {
      case "text":
      case "password":
      case "email":
      case "number":
        return (
          <TextField
            fullWidth
            label={label}
            required
            placeholder={placeholder}
            type={type}
            {...register(name)}
          />
        );
      case "date":
        return (
          <TextField
            fullWidth
            label={label}
            required
            placeholder={placeholder}
            type={type}
            defaultValue={today}
            {...register(name)}
          />
        );
      case "dropdown":
        return (
            <TextField
              select
              fullWidth
              label={label}
              required
              defaultValue=""
              {...register(name)}
            >
              {dropdownData?.map((option) => (
                <MenuItem key={option.key} value={option.value}>
                  {option.value}
                </MenuItem>
              ))}
            </TextField>
          );
      default:
        return null;
    }
  };

  return <>{renderField()}</>;
}
