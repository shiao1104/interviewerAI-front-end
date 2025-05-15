import { Typography, Box, Button } from "@mui/material";
import { UploadFile } from "@mui/icons-material";

type FileUploadProps = {
  name: string;
  label: string;
  textClassName?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: any;
  setValue: (name: string, value: FileList) => void;
  watch: (name: string) => FileList | undefined;
};

export default function FileUploadField({
  name,
  label,
  textClassName,
  setValue,
  watch,
}: FileUploadProps) {
  const file = watch(name)?.[0];

  return (
    <Box>
      <Typography className={textClassName} variant="subtitle1" sx={{ mb: 1 }}>
        {label}
      </Typography>
      <input
        type="file"
        id={name}
        hidden
        onChange={(e) => {
          const files = e.target.files;
          if (files) setValue(name, files);
        }}
      />
      <label htmlFor={name}>
        <Button
          variant="outlined"
          component="span"
          startIcon={<UploadFile />}
          sx={{
            textTransform: "none",
            borderRadius: "6px",
            padding: "8px 16px",
            fontSize: "0.9rem",
          }}
        >
          {file ? file.name : "選擇檔案"}
        </Button>
      </label>
    </Box>
  );
}
