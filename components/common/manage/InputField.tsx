import { InputFieldTypes } from "@/lib/types/inputFieldTypes";
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
  Typography,
  FormHelperText,
} from "@mui/material";
import Textarea from "@mui/joy/Textarea";
import FileUploadField from "../FileUploadField";
import { Controller } from "react-hook-form";

export default function InputField({
  name,
  label,
  type,
  placeholder,
  dropdownData,
  formProps,
  textClassName,
  rules,
}: InputFieldTypes) {
  const {
    register,
    control,
    formState: { errors },
  } = formProps;
  const today = new Date().toISOString().split("T")[0];
  const error = errors[name];

  const renderField = () => {
    switch (type) {
      case "text":
      case "password":
      case "email":
      case "number":
      case "time":
        return (
          <Box>
            <Typography className={textClassName} variant="subtitle1">
              {rules?.required && (
                <Typography component="span" color="error" fontSize="0.75rem">
                  *{" "}
                </Typography>
              )}
              {label}
            </Typography>
            <FormControl fullWidth error={!!error}>
              <TextField
                required={rules?.required}
                fullWidth
                error={!!error}
                helperText={error?.message as string}
                placeholder={placeholder ? placeholder : label}
                type={type}
                sx={{
                  borderRadius: "5px",
                  "& .MuiOutlinedInput-input": {
                    padding: "10px 14px",
                  },
                }}
                {...register(name, rules)}
              />
            </FormControl>
          </Box>
        );
      case "date":
        return (
          <>
            <Typography className={textClassName} variant="subtitle1">
              {label}
            </Typography>
            <TextField
              fullWidth
              required
              placeholder={placeholder ? placeholder : label}
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
      case "dropdown":
        return (
          <Box>
            <Typography className={textClassName} variant="subtitle1">
              {rules?.required && (
                <Typography component="span" color="error" fontSize="0.75rem">
                  *{" "}
                </Typography>
              )}
              {label}
            </Typography>
            <Controller
              name={name}
              control={control}
              defaultValue=""
              rules={rules}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth error={!!error}>
                  <TextField
                    select
                    fullWidth
                    error={!!error}
                    value={field.value}
                    onChange={field.onChange}
                    SelectProps={{
                      displayEmpty: true,
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      renderValue: (selected: any) => {
                        if (selected === "") {
                          return (
                            <em style={{ color: "#757575" }}>
                              {placeholder || label}
                            </em>
                          );
                        }
                        const matched = dropdownData?.find(
                          (item) => item.key === selected
                        );
                        return matched ? matched.value : selected;
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
                      <MenuItem key={option.key} value={option.key}>
                        {option.value}
                      </MenuItem>
                    ))}
                  </TextField>
                  {error && <FormHelperText>{error.message}</FormHelperText>}
                </FormControl>
              )}
            />
          </Box>
        );
      case "file":
        return (
          <Box>
            <FileUploadField
              name={name}
              label={label}
              textClassName="myLabel"
              register={formProps.register}
              setValue={formProps.setValue}
              watch={formProps.watch}
            />
          </Box>
        );
      case "textarea":
        return (
          <Box>
            <Typography className={textClassName} variant="subtitle1">
              {rules?.required && (
                <Typography component="span" color="error" fontSize="0.75rem">
                  *{" "}
                </Typography>
              )}
              {label}
            </Typography>
            <FormControl fullWidth error={!!error}>
              <Textarea
                fullWidth
                minRows={3}
                error={!!error}
                {...register(name, rules)}
                placeholder={placeholder ? placeholder : label}
              />
              {error && (
                <FormHelperText error>{error.message as string}</FormHelperText>
              )}
            </FormControl>
          </Box>
        );
      case "multiselect":
        return (
          <Box>
            <Typography className={textClassName} variant="subtitle1">
              {label}
            </Typography>
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
                        return (
                          <em style={{ color: "#757575" }}>
                            {placeholder || label}
                          </em>
                        );
                      }
                      return (
                        <Box
                          sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                        >
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
          </Box>
        );
      case "switch":
        return (
          <Box>
            {label && (
              <Typography variant="subtitle1" sx={{ mr: 1 }}>
                {label}
              </Typography>
            )}
            <Switch {...register(name)} />
          </Box>
        );
      default:
        return null;
    }
  };

  return <>{renderField()}</>;
}
