import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import OutlinedInput from '@mui/material/OutlinedInput';
import Alert from '@mui/material/Alert';
import UserAPI from '@/lib/api/UserAPI';

interface ForgotPasswordProps {
  open: boolean;
  handleClose: () => void;
}

export default function ForgotPassword({ open, handleClose }: ForgotPasswordProps) {
  const [email, setEmail] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState(false);

  const handleClick = async () => {
    if (!email) {
      setError('請輸入Email地址');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await UserAPI.forgetPassword(email);
      setSuccess(true);
      setEmail('');

      setTimeout(() => {
        handleClose();
        setSuccess(false);
      }, 2000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '發送失敗，請稍後重試';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDialogClose = () => {
    setEmail('');
    setError('');
    setSuccess(false);
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleDialogClose}
      slotProps={{
        paper: {
          component: 'form',
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            handleClick();
          },
          sx: { backgroundImage: 'none' },
        },
      }}
    >
      <DialogTitle>重設密碼</DialogTitle>
      <DialogContent
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%', minWidth: 400 }}
      >
        <DialogContentText>
          請輸入您的Email，我們將會傳送更改密碼的連結給您
        </DialogContentText>

        {error && (
          <Alert severity="error" onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success">
            驗證連結已發送到您的信箱，請檢查Email
          </Alert>
        )}

        <OutlinedInput
          autoFocus
          required
          margin="dense"
          id="email"
          name="email"
          label="Email address"
          placeholder="Email"
          type="email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading || success}
          error={!!error}
        />
      </DialogContent>
      <DialogActions sx={{ pb: 3, px: 3 }}>
        <Button onClick={handleDialogClose} disabled={loading}>
          取消
        </Button>
        <Button
          variant="contained"
          onClick={handleClick}
          disabled={loading || success}
          sx={{
            color: 'primary.contrastText',
            '&.Mui-disabled': {
              color: '#fff',
            }
          }}
        >
          {loading ? '發送中...' : '繼續'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}