import { makeAutoObservable, runInAction } from 'mobx';
import { isAxiosError } from 'axios';
import AuthService from "@/services/auth/AuthService";
import { LoginParams, RegistrationParams, ParamsVerificateEmail, NewPasswordParams } from "@/helpers/types/auth";
import $api from '@/helpers/http';
import { storageHelper } from "@/helpers/utils/storageHelper";
import { BaseStore } from './BaseStore';
import type { RootStore } from './RootStore';

export type AuthProvider = 'google' | 'apple' | 'demo';

type AuthUserLike = {
  id: string;
  email: string;
  isActivated?: boolean;
  fullName?: string;
  name?: string;
};

export type AuthUser = {
  id: string;
  email: string;
  isActivated: boolean;
  fullName: string;
  name: string;
};

export class AuthStore extends BaseStore {

  private root?: RootStore;

  isAuth = false;
  user: AuthUser | null = null;
  isLoading = false;
  accessToken: string | null = null;

  lastProvider: AuthProvider | null = null;
  hasAttemptedAutoLogin = false;

  constructor(root?: RootStore) {
    super();
    this.root = root;
    makeAutoObservable(this);
  }

  private normalizeUser(user: AuthUserLike): AuthUser {
    const fullName = user.fullName ?? user.name ?? '';
    const name = user.name ?? fullName;
    return {
      id: user.id,
      email: user.email,
      isActivated: user.isActivated ?? true,
      fullName,
      name,
    };
  }

  get isAuthenticated() {
    return this.user !== null;
  }

  getMyId = () => this.user?.id ?? ''

  setLoading(value: boolean) {
    this.isLoading = value;
    this.notify();
  }

  setAuth(value: boolean) {
    this.isAuth = value;
    this.notify();
  }

  startAuth(provider: AuthProvider) {
    this.lastProvider = provider;
    this.notify();
  }

  completeAuth(user: AuthUserLike) {
    const normalizedUser = this.normalizeUser(user);
    runInAction(() => {
      this.user = normalizedUser;
      this.isAuth = true;
      this.lastProvider = this.lastProvider ?? 'demo';
    });
    this.notify();
  }

  cancelAuth() {
    this.lastProvider = null;
    this.notify();
  }

  async loginByGoogle(credential: string) {
    try {
      const { data } = await AuthService.loginByGoogle(credential);

      const normalizedUser = this.normalizeUser(data.user);
      runInAction(() => {
        this.user = normalizedUser;
        this.isAuth = true;
        this.accessToken = data.accessToken;
        this.lastProvider = 'google';
      });

      this.notify();

      await storageHelper.setRefreshToken(data.refreshToken);
      await storageHelper.setAccessToken(data.accessToken);

      $api.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;

      void this.root?.onlineStore.connectSocket();

      return data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async loginByApple(identityToken: string) {
    try {
      const { data } = await AuthService.loginByApple(identityToken);

      const normalizedUser = this.normalizeUser(data.user);
      runInAction(() => {
        this.user = normalizedUser;
        this.isAuth = true;
        this.accessToken = data.accessToken;
        this.lastProvider = 'apple';
      });

      this.notify();

      await storageHelper.setRefreshToken(data.refreshToken);
      await storageHelper.setAccessToken(data.accessToken);

      $api.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;

      void this.root?.onlineStore.connectSocket();

      return data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async login(props: LoginParams) {
    try {
      this.setLoading(true);
      const { data } = await AuthService.login(props);

      const normalizedUser = this.normalizeUser(data.user);
      runInAction(() => {
        this.user = normalizedUser;
        this.isAuth = true;
        this.accessToken = data.accessToken;
        this.lastProvider = this.lastProvider ?? 'demo';
      });

      this.notify();

      await storageHelper.setRefreshToken(data.refreshToken);
      await storageHelper.setAccessToken(data.accessToken);

      $api.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;

      void this.root?.onlineStore.connectSocket();

      return data;
    } catch (error: unknown) {
      const formErrors = this.extractFormErrors(error);
      if (formErrors) {
        throw formErrors;
      }
      throw error;
    } finally {
      this.setLoading(false);
    }
  }

  async logout() {
    try {
      await AuthService.logout();
    } finally {
      this.root?.onlineStore.disconnectSocket();

      runInAction(() => {
        this.user = null;
        this.isAuth = false;
        this.accessToken = null;
        this.lastProvider = null;
      });
      this.notify();
      await storageHelper.removeRefreshToken();
      await storageHelper.removeAccessToken();
    }

  }

  async registration(props: RegistrationParams) {
    try {
      this.setLoading(true);
      const { data } = await AuthService.registration(props);

      const normalizedUser = this.normalizeUser(data.user);
      runInAction(() => {
        this.user = normalizedUser;
        this.isAuth = true;
        this.accessToken = data.accessToken;
        this.lastProvider = this.lastProvider ?? 'demo';
      });

      this.notify();

      await storageHelper.setAccessToken(data.accessToken);
      await storageHelper.setRefreshToken(data.refreshToken);

      $api.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;

      void this.root?.onlineStore.connectSocket();

    } catch (error: unknown) {
      const formErrors = this.extractFormErrors(error);
      if (formErrors) {
        throw formErrors;
      }
      throw error;
    } finally {
      this.setLoading(false);
    }
  }

  async otp(props: ParamsVerificateEmail) {
    try {
      this.setLoading(true);
      const { data } = await AuthService.verificateEmail(props);

      const normalizedUser = this.normalizeUser(data.user);
      runInAction(() => {
        this.user = normalizedUser;
        this.isAuth = true;
      });

      this.notify();

      return data;

    } catch (error: unknown) {
      const formErrors = this.extractFormErrors(error);
      if (formErrors) {
        throw formErrors;
      }
      throw error;
    } finally {
      this.setLoading(false);
    }
  }

  async activateEmail(email: string) {
    try {
      const { data } = await AuthService.activateEmail(email);
      return data;

    } catch (error: unknown) {
      const formErrors = this.extractFormErrors(error);
      if (formErrors) {
        throw formErrors;
      }
      throw error;
    }
  }

  //флоу когда сбрасываем пароль
  async resetPassword(props: ParamsVerificateEmail) {
    try {
      this.setLoading(true);
      const { data } = await AuthService.resetPassword(props);
      return data;

    } catch (error: unknown) {
      const formErrors = this.extractFormErrors(error);
      if (formErrors) {
        throw formErrors;
      }
      throw error;
    } finally {
      this.setLoading(false);
    }
  }

  async newPassword(props: NewPasswordParams) {
    try {
      const { data } = await AuthService.newPassword(props);
      return data;

    } catch (error: unknown) {
      const formErrors = this.extractFormErrors(error);
      if (formErrors) {
        throw formErrors;
      }
      throw error;
    }
  }

  async refreshAccessToken() {
    let didRefresh = false;
    try {
      const refreshToken = await storageHelper.getRefreshToken();
      if (!refreshToken) {
        return false;
      }
      const { data } = await AuthService.refreshAccessTokenRequest(refreshToken);
      const normalizedUser = this.normalizeUser(data.user);
      runInAction(() => {
        this.user = normalizedUser;
        this.accessToken = data.accessToken;
        this.isAuth = true;
        this.lastProvider = this.lastProvider ?? 'demo';
      });

      // Persist обновленные токены для последующих запросов
      await storageHelper.setAccessToken(data.accessToken);
      await storageHelper.setRefreshToken(data.refreshToken);

      // Обновляем заголовок авторизации для axios
      $api.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;

      void this.root?.onlineStore.connectSocket();

      didRefresh = true;
    } catch (error: unknown) {
      await storageHelper.removeRefreshToken();
      await storageHelper.removeAccessToken();
      this.root?.onlineStore.disconnectSocket();
      runInAction(() => {
        this.user = null;
        this.isAuth = false;
        this.accessToken = null;
        this.lastProvider = null;
      });
      console.log(error);
    } finally {
      runInAction(() => {
        this.hasAttemptedAutoLogin = true;
      });
      this.notify();
    }
    return didRefresh;
  }

  private extractFormErrors(error: unknown): Record<string, string> | null {
    if (isAxiosError<FormErrorResponse>(error)) {
      const errors = error.response?.data?.errors;
      if (Array.isArray(errors)) {
        return errors.reduce<Record<string, string>>((acc, item) => {
          acc[item.field] = item.message;
          return acc;
        }, {});
      }
    }

    return null;
  }
}

export default AuthStore;

type FieldError = {
  field: string;
  message: string;
};

type FormErrorResponse = {
  errors?: FieldError[];
};
