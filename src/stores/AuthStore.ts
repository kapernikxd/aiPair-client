import { makeAutoObservable } from 'mobx';
import { BaseStore } from './BaseStore';
import type { RootStore } from './RootStore';

export type AuthProvider = 'google' | 'apple' | 'demo';

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
};

export class AuthStore extends BaseStore {
  private root: RootStore;
  user: AuthUser | null = null;
  lastProvider: AuthProvider | null = null;
  isLoading = false;

  constructor(root: RootStore) {
    super();
    this.root = root;
    makeAutoObservable(this);
  }

  get isAuthenticated() {
    return this.user !== null;
  }

  startAuth(provider: AuthProvider) {
    this.isLoading = true;
    this.lastProvider = provider;
    this.notify();
  }

  completeAuth(user: AuthUser) {
    this.user = user;
    this.isLoading = false;
    this.notify();
  }

  failAuth() {
    this.isLoading = false;
    this.notify();
  }

  signOut() {
    this.user = null;
    this.lastProvider = null;
    this.notify();
  }
}
