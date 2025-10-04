import { makeAutoObservable } from 'mobx';
import { BaseStore } from './BaseStore';
import type { RootStore } from './RootStore';

export type Notification = { id: number; message: string; variant?: 'info' | 'success' | 'error' };

export type SnackbarType = 'success' | 'warning' | 'error' | 'info';

export interface SnackBarParams {
  visible: boolean;
  message: string;
  type: SnackbarType;
}

export class UiStore extends BaseStore {
  private root: RootStore;
  isAuthPopupOpen = false;
  isMobileBannerVisible = false;
  isEditProfileDialogOpen = false;
  isSidebarOpen = true;
  isMobileSidebarOpen = false;
  notifications: Notification[] = [];
  private sidebarHydrated = false;

  snackBar: SnackBarParams = {
    visible: false,
    message: '',
    type: 'success',
  };

  constructor(root: RootStore) {
    super();
    this.root = root;
    makeAutoObservable(this);
  }

  // Методы для работы со Snackbar
  showSnackbar(message: string, type: SnackbarType) {
    this.snackBar.message = message;
    this.snackBar.type = type;
    this.snackBar.visible = true;
    this.notify();
  }

  hideSnackbar() {
    this.snackBar.visible = false;
    this.notify();
  }

  openAuthPopup() {
    this.isAuthPopupOpen = true;
    this.notify();
  }

  closeAuthPopup() {
    this.isAuthPopupOpen = false;
    this.notify();
  }

  toggleAuthPopup() {
    this.isAuthPopupOpen = !this.isAuthPopupOpen;
    this.notify();
  }

  dismissMobileBanner() {
    if (!this.isMobileBannerVisible) return;
    this.isMobileBannerVisible = false;
    this.notify();
  }

  showMobileBanner() {
    this.isMobileBannerVisible = true;
    this.notify();
  }

  openEditProfileDialog() {
    this.isEditProfileDialogOpen = true;
    this.notify();
  }

  closeEditProfileDialog() {
    this.isEditProfileDialogOpen = false;
    this.notify();
  }

  setSidebarOpen(value: boolean) {
    this.isSidebarOpen = value;
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('sidebar-open', value ? '1' : '0');
    }
    this.notify();
  }

  toggleSidebar() {
    this.setSidebarOpen(!this.isSidebarOpen);
  }

  hydrateSidebarFromStorage() {
    if (this.sidebarHydrated) return;
    this.sidebarHydrated = true;
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem('sidebar-open');
    if (stored === '1' || stored === '0') {
      this.isSidebarOpen = stored === '1';
      this.notify();
    }
  }

  openMobileSidebar() {
    this.isMobileSidebarOpen = true;
    this.notify();
  }

  closeMobileSidebar() {
    this.isMobileSidebarOpen = false;
    this.notify();
  }

  pushNotification(notification: Notification) {
    this.notifications = [...this.notifications, notification];
    this.notify();
  }

  removeNotification(id: number) {
    this.notifications = this.notifications.filter((n) => n.id !== id);
    this.notify();
  }
}
