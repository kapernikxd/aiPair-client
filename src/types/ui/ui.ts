export type Notification = { id: number; message: string; variant?: 'info' | 'success' | 'error' };

export type SnackbarType = 'success' | 'warning' | 'error' | 'info';

export interface SnackBarParams {
  visible: boolean;
  message: string;
  type: SnackbarType;
}