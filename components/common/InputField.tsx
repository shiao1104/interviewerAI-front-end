import { InputFieldTypes } from "@/lib/types/inputFieldTypes";
import { MenuItem, TextField, Typography } from "@mui/material";

export default function InputField({
  name,
  label,
  type,
  placeholder,
  dropdownData,
  formProps,
  textClassName,
}: InputFieldTypes) {
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
            required
            placeholder={label}
            type={type}
            sx={{
              backgroundColor: "#fff",
              borderRadius: "5px",
              "& .MuiOutlinedInput-input": {
                padding: "10px 14px",
              },
            }}
            {...register(name)}
          />
        );
      case "date":
        return (
          <>
            {textClassName && (
              <Typography className={textClassName} variant="subtitle1">
                {label}
              </Typography>
            )}
            <TextField
              fullWidth
              required
              placeholder={placeholder}
              type={type}
              defaultValue={today}
              sx={{
                backgroundColor: "#fff",
                borderRadius: "5px",
                "& .MuiOutlinedInput-input": {
                  padding: "10px 14px",
                },
              }}
              {...register(name)}
            />
          </>
        );
      case "dropdown":
        return (
          <TextField
            select
            fullWidth
            required
            displayEmpty
            defaultValue=""
            SelectProps={{
              displayEmpty: true,
              renderValue: (selected) => {
                if (selected === "") {
                  return (
                    <em style={{ color: "#757575" }}>{placeholder || label}</em>
                  );
                }
                return selected;
              },
            }}
            sx={{
              backgroundColor: "#fff",
              minWidth: "150px",
              borderRadius: "5px",
              "& .MuiOutlinedInput-input": {
                padding: "10px 14px",
              },
              "& .MuiSelect-select.MuiSelect-select": {
                color: (selected: string) =>
                  selected === "" ? "#757575" : "inherit",
              },
            }}
            {...register(name)}
          >
            <MenuItem disabled value="">
              <em>{placeholder || label}</em>
            </MenuItem>
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
