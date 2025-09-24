import { makeAutoObservable, runInAction } from 'mobx';
import AuthService from "@/services/auth/AuthService";
import { LoginParams, RegistrationParams, ParamsVerificateEmail, NewPasswordParams } from "@/helpers/types/auth";
import $api from '@/helpers/http';
import { storageHelper } from "@/helpers/utils/storageHelper";

export type AuthProvider = 'google' | 'apple' | 'demo';

export type AuthUser = {
  id: string;
  email: string;
  isActivated: boolean;
  fullName: string;
};

class AuthStore {

  isAuth: boolean = false;
  user: AuthUser | null = null;
  isLoading = false;
  accessToken: string | null = null;

  lastProvider: AuthProvider | null = null

  constructor() {
    makeAutoObservable(this);
  }

  get isAuthenticated() {
    return this.user !== null;
  }

  setLoading(value: boolean) {
    this.isLoading = value;
  }

  setAuth(value: boolean) {
    this.isAuth = value;
  }

  async loginByGoogle(credential: string, expoPushToken?: string) {
    try {
      const { data } = await AuthService.loginByGoogle(credential);

      runInAction(() => {
        this.user = data.user;
        this.isAuth = true;
        this.accessToken = data.accessToken
      });

      await storageHelper.setRefreshToken(data.refreshToken);
      await storageHelper.setAccessToken(data.accessToken);

      $api.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;

      return data
    } catch (e: any) {
      throw e;
    }
  }

  async loginByApple(identityToken: string, expoPushToken?: string) {
    try {
      const { data } = await AuthService.loginByApple(identityToken);

      runInAction(() => {
        this.user = data.user;
        this.isAuth = true;
        this.accessToken = data.accessToken;
      });

      await storageHelper.setRefreshToken(data.refreshToken);
      await storageHelper.setAccessToken(data.accessToken);

      $api.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;

      return data;
    } catch (e: any) {
      throw e;
    }
  }

  async login(props: LoginParams, expoPushToken?: string) {
    try {
      this.setLoading(true);
      const { data } = await AuthService.login(props);

      runInAction(() => {
        this.user = data.user;
        this.isAuth = true;
        this.accessToken = data.accessToken
      });

      await storageHelper.setRefreshToken(data.refreshToken);
      await storageHelper.setAccessToken(data.accessToken);

      $api.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;

      this.setLoading(false);

      return data
    } catch (e: any) {
      // Преобразуем ошибки в формат react-hook-form
      if (e.response?.data?.errors) {
        const formattedErrors = e.response.data.errors.reduce(
          (acc: Record<string, string>, error: { field: string; message: string }) => {
            acc[error.field] = error.message;
            return acc;
          },
          {}
        );
        throw formattedErrors; // Бросаем обработанные ошибки
      }
      throw e;
    }
  }

  async logout() {
    await AuthService.logout();

    runInAction(() => {
      this.user = null;
      this.isAuth = false;
      this.accessToken = null;
    });
    await storageHelper.removeRefreshToken();
    await storageHelper.removeAccessToken();

  }

  async registration(props: RegistrationParams, expoPushToken?: string) {
    try {
      this.setLoading(true);
      const { data } = await AuthService.registration(props);

      runInAction(() => {
        this.user = data.user;
        this.isAuth = true;
        this.accessToken = data.accessToken
      });

      await storageHelper.setAccessToken(data.accessToken);
      await storageHelper.setRefreshToken(data.refreshToken);

      $api.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;

      this.setLoading(false);
    } catch (e: any) {
      // Преобразуем ошибки в формат react-hook-form
      if (e.response?.data?.errors) {
        const formattedErrors = e.response.data.errors.reduce(
          (acc: Record<string, string>, error: { field: string; message: string }) => {
            acc[error.field] = error.message;
            return acc;
          },
          {}
        );
        throw formattedErrors; // Бросаем обработанные ошибки
      }
      throw e;
    }
  }

  async otp(props: ParamsVerificateEmail) {
    try {
      this.setLoading(true);
      const { data } = await AuthService.verificateEmail(props);

      runInAction(() => {
        this.user = data.user;
        this.isAuth = true;
      })

      return data

    } catch (e: any) {
      // Преобразуем ошибки в формат react-hook-form
      if (e.response?.data?.errors) {
        const formattedErrors = e.response.data.errors.reduce(
          (acc: Record<string, string>, error: { field: string; message: string }) => {
            acc[error.field] = error.message;
            return acc;
          },
          {}
        );
        throw formattedErrors; // Бросаем обработанные ошибки
      }
      throw e;
    }
  }

  async activateEmail(email: string) {
    try {
      const { data } = await AuthService.activateEmail(email);
      return data;

    } catch (e: any) {
      // Преобразуем ошибки в формат react-hook-form
      if (e.response?.data?.errors) {
        const formattedErrors = e.response.data.errors.reduce(
          (acc: Record<string, string>, error: { field: string; message: string }) => {
            acc[error.field] = error.message;
            return acc;
          },
          {}
        );
        throw formattedErrors; // Бросаем обработанные ошибки
      }
      throw e;
    }
  }

  //флоу когда сбрасываем пароль
  async resetPassword(props: ParamsVerificateEmail) {
    try {
      this.setLoading(true);
      const { data } = await AuthService.resetPassword(props);
      return data

    } catch (e: any) {
      // Преобразуем ошибки в формат react-hook-form
      if (e.response?.data?.errors) {
        const formattedErrors = e.response.data.errors.reduce(
          (acc: Record<string, string>, error: { field: string; message: string }) => {
            acc[error.field] = error.message;
            return acc;
          },
          {}
        );
        throw formattedErrors; // Бросаем обработанные ошибки
      }
      throw e;
    }
  }

  async newPassword(props: NewPasswordParams) {
    try {
      const { data } = await AuthService.newPassword(props);
      return data;

    } catch (e: any) {
      // Преобразуем ошибки в формат react-hook-form
      if (e.response?.data?.errors) {
        const formattedErrors = e.response.data.errors.reduce(
          (acc: Record<string, string>, error: { field: string; message: string }) => {
            acc[error.field] = error.message;
            return acc;
          },
          {}
        );
        throw formattedErrors; // Бросаем обработанные ошибки
      }
      throw e;
    }
  }

  async refreshAccessToken() {
    try {
      const refreshToken = await storageHelper.getRefreshToken();
      if (!refreshToken) {
        throw new Error();
      }
      const { data } = await AuthService.refreshAccessTokenRequest(refreshToken);
      runInAction(() => {
        this.user = data.user;
        this.accessToken = data.accessToken;
        this.isAuth = true;
      });

      // Persist обновленные токены для последующих запросов
      await storageHelper.setAccessToken(data.accessToken);
      await storageHelper.setRefreshToken(data.refreshToken);

      // Обновляем заголовок авторизации для axios
      $api.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;

      return data;
    } catch (e: any) {
      await storageHelper.removeRefreshToken();
      await storageHelper.removeAccessToken();
      console.log(e)
    }
  }
}

export default new AuthStore();
