import { Add } from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { useReducer, useEffect } from "react";

export type OptionsProps = {
  name: string;
  label: string;
  type: string;
  placeholder?: string;
  initialOptions?: string[];
  onChange?: (options: string[]) => void;
};

type ComponentState = {
  options: string[];
  optionInput: string;
  dialogOpen: boolean;
};

type ComponentAction =
  | { type: "OPEN_DIALOG" }
  | { type: "CLOSE_DIALOG" }
  | { type: "SET_INPUT"; payload: string }
  | { type: "ADD_OPTION" }
  | { type: "DELETE_OPTION"; payload: number }
  | { type: "SET_OPTIONS"; payload: string[] };

const componentReducer = (
  state: ComponentState,
  action: ComponentAction
): ComponentState => {
  switch (action.type) {
    case "OPEN_DIALOG":
      return {
        ...state,
        dialogOpen: true,
        optionInput: "",
      };
    case "CLOSE_DIALOG":
      return {
        ...state,
        dialogOpen: false,
        optionInput: "",
      };
    case "SET_INPUT":
      return {
        ...state,
        optionInput: action.payload,
      };
    case "ADD_OPTION":
      if (!state.optionInput.trim()) return state;

      const newOptions = [...state.options, state.optionInput.trim()];
      return {
        ...state,
        options: newOptions,
        optionInput: "",
        dialogOpen: false,
      };
    case "DELETE_OPTION": {
      const newOptions = [...state.options];
      newOptions.splice(action.payload, 1);
      return {
        ...state,
        options: newOptions,
      };
    }
    case "SET_OPTIONS":
      return {
        ...state,
        options: action.payload,
      };
    default:
      return state;
  }
};

export default function InsertOptions({
  label,
  placeholder,
  initialOptions = [],
  onChange,
}: OptionsProps) {
  const initialState: ComponentState = {
    options: initialOptions || [],
    optionInput: "",
    dialogOpen: false,
  };

  const [state, dispatch] = useReducer(componentReducer, initialState);

  const { options, optionInput, dialogOpen } = state;

  // 監聽 initialOptions 的變化，同步更新 state
  useEffect(() => {
    if (initialOptions && initialOptions.length > 0) {
      dispatch({ type: "SET_OPTIONS", payload: initialOptions });
    }
  }, [initialOptions]);

  // 當 options 變化時，通知父組件
  useEffect(() => {
    if (onChange) {
      onChange(options);
    }
  }, [options, onChange]);

  const handleAddOption = () => {
    if (optionInput.trim()) {
      dispatch({ type: "ADD_OPTION" });
    }
  };

  const handleDeleteOption = (index: number) => {
    dispatch({ type: "DELETE_OPTION", payload: index });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddOption();
    }
  };
  
  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
          mb: 2,
        }}
      >
        <Typography variant="subtitle1">{label}</Typography>
        <Button
          size="small"
          startIcon={<Add />}
          onClick={() => dispatch({ type: "OPEN_DIALOG" })}
        >
          添加
        </Button>
      </Box>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        {options.length > 0 ? (
          options.map((option: string, index: number) => (
            <Chip
              key={index}
              label={option}
              color="primary"
              variant="outlined"
              onDelete={() => handleDeleteOption(index)}
            />
          ))
        ) : (
          <Typography variant="body2" color="text.secondary">
            尚未添加{label}
          </Typography>
        )}
      </Box>

      <Dialog
        open={dialogOpen}
        onClose={() => dispatch({ type: "CLOSE_DIALOG" })}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>添加{label}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label={label}
            placeholder={placeholder}
            fullWidth
            variant="outlined"
            value={optionInput}
            onChange={(e) =>
              dispatch({ type: "SET_INPUT", payload: e.target.value })
            }
            onKeyPress={handleKeyPress}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => dispatch({ type: "CLOSE_DIALOG" })}>
            取消
          </Button>
          <Button
            onClick={handleAddOption}
            variant="contained"
            disabled={!optionInput.trim()}
          >
            確定
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}