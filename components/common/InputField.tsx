import { InputFieldTypes } from "@/lib/types/inputFieldTypes";
import Textarea from "@mui/joy/Textarea";
import { 
  Box, 
  Chip,
  FormControl,
  ListItemText,
  MenuItem, 
  OutlinedInput,
  Select,
  Switch,
  TextField, 
  Typography 
} from "@mui/material";
import { Controller } from "react-hook-form";

export default function InputField({
  name,
  label,
  type,
  placeholder,
  dropdownData,
  formProps,
  textClassName,
}: InputFieldTypes) {
  const { register, control } = formProps;
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
                borderRadius: "5px",
                "& .MuiOutlinedInput-input": {
                  padding: "10px 14px",
                },
              }}
              {...register(name)}
            />
          </>
        );
      case "switch":
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {label && (
              <Typography variant="subtitle1" sx={{ mr: 1 }}>
                {label}
              </Typography>
            )}
            <Switch {...register(name)} />
          </Box>
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
      case "multiselect":
        return (
          <Controller
            name={name}
            control={control}
            defaultValue={[]}
            render={({ field }) => (
              <FormControl fullWidth>
                <Select
                  multiple
                  displayEmpty
                  value={field.value || []}
                  onChange={field.onChange}
                  input={<OutlinedInput />}
                  renderValue={(selected) => {
                    if (selected.length === 0) {
                      return <em style={{ color: "#757575" }}>{placeholder || label}</em>;
                    }
                    return (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value: number) => (
                          <Chip key={value} label={value} size="small" />
                        ))}
                      </Box>
                    );
                  }}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 224,
                        width: 250,
                      },
                    },
                  }}
                  sx={{
                    minWidth: "150px",
                    borderRadius: "5px",
                    "& .MuiOutlinedInput-input": {
                      padding: "10px 14px",
                    },
                  }}
                >
                  <MenuItem disabled value="">
                    <em>{placeholder || label}</em>
                  </MenuItem>
                  {dropdownData?.map((option) => (
                    <MenuItem key={option.key} value={option.value}>
                      <ListItemText primary={option.value} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
        );
      case "textarea":
        return (
          <Box>
            <Typography className={textClassName} variant="subtitle1">
              {label}
            </Typography>
            <Textarea
              fullWidth
              minRows={3}
              {...register(name)}
              placeholder={label}
            />
          </Box>
        );
      default:
        return null;
    }
  };

  return <>{renderField()}</>;
}