import { MenuItem, TextField, Typography } from "@mui/material";

export type DropdownOption = {
  key: number;
  value: string;
};

export type Props = {
  name: string;
  label: string;
  type: string;
  placeholder?: string;
  dropdownData?: DropdownOption[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formProps?: any;
  textClassName?: string;
};

export default function InputField({
  name,
  label,
  type,
  placeholder,
  dropdownData,
  formProps,
  textClassName,
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
          <>
            <Typography variant="subtitle1" className={textClassName}>
              {label}
            </Typography>
            <TextField
              fullWidth
              required
              placeholder={placeholder ? placeholder : `請輸入${label}`}
              type={type}
              {...register(name)}
            />
          </>
        );
      case "date":
        return (
          <>
            <Typography variant="subtitle1">{label}</Typography>
            <TextField
              fullWidth
              required
              placeholder={placeholder}
              type={type}
              defaultValue={today}
              {...register(name)}
            />
          </>
        );
      case "dropdown":
        return (
          <>
            <Typography variant="subtitle1" className={textClassName}>
              {label}
            </Typography>
            <TextField
              select
              fullWidth
              required
              {...register(name)}
            >
              {dropdownData?.map((option) => (
                <MenuItem key={option.key} value={option.value}>
                  {option.value}
                </MenuItem>
              ))}
            </TextField>
          </>
        );
      default:
        return null;
    }
  };

  return <>{renderField()}</>;
}
