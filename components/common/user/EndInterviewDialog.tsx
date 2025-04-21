import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

interface EndInterviewDialogProps {
  open: boolean;
  isComplete: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function EndInterviewDialog({
  open,
  isComplete,
  onClose,
  onConfirm,
}: EndInterviewDialogProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{isComplete ? "面試完成" : "確認退出"}</DialogTitle>
      <DialogContent>
        <Typography sx={{color: isComplete ? '#000': 'red'}}>
          {isComplete
            ? "恭喜你完成了所有問題！是否要退出並查看結果？"
            : "確定要退出面試嗎？退出後不得再進入。"}
        </Typography>
      </DialogContent>
      <DialogActions>
        {isComplete ? '' : <Button onClick={onClose}>取消</Button>}
        <Button
          variant="contained"
          color={isComplete ? "primary" : "error"}
          onClick={onConfirm}
        >
          確認
        </Button>
      </DialogActions>
    </Dialog>
  );
}