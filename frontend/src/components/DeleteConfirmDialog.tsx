import type { ReactNode } from 'react';

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';

interface DeleteConfirmDialogProps {
  open: boolean;
  title: string;
  description: ReactNode;
  confirmDisabled?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteConfirmDialog({
  open,
  title,
  description,
  confirmDisabled = false,
  onClose,
  onConfirm,
}: DeleteConfirmDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-description"
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle id="delete-dialog-title">
        {title}
      </DialogTitle>

      <DialogContent>
        <Box
          id="delete-dialog-description"
          sx={{ color: 'text.secondary' }}
        >
          {description}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} autoFocus>
          Отмена
        </Button>

        <Button
          onClick={onConfirm}
          color="error"
          variant="contained"
          disabled={confirmDisabled}
        >
          Удалить
        </Button>
      </DialogActions>
    </Dialog>
  );
}