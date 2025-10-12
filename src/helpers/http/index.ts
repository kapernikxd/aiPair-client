import axios from "axios";
import { storageHelper } from "../utils/storageHelper";
// import AuthStore from "@/stores/AuthStore";


export const isDev = process.env.NODE_ENV === "development";

export const EMAIL = "aipairpro@yandex.com";

export const BASE_URL = isDev ? "http://localhost:5001/" : "https://aipair.pro/"

export const TELEGRAM_URL = 'https://t.me/pllacesupport';
export const DOMAIN = "https://aipair.pro"
export const API_URL = `${BASE_URL}api/`;

// Создаем экземпляр Axios
const $api = axios.create({
  baseURL: API_URL,
});

// **Interceptor для запросов**
$api.interceptors.request.use(
  async (config) => {
    const accessToken = await storageHelper.getAccessToken(); // Получаем accessToken из AsyncStorage
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    } else {
      delete config.headers.Authorization;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// **Interceptor для ответов**
$api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    console.log("error", error)

    if (error.response?.status === 401 && !originalRequest._isRetry) {
      originalRequest._isRetry = true;
      try {
        const refreshToken = await storageHelper.getRefreshToken();
        if (!refreshToken) throw new Error("Refresh token not found");

        const response = await axios.post(
          `${API_URL}auth/refresh`,
          { refreshToken },
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;

        await storageHelper.setAccessToken(newAccessToken);
        await storageHelper.setRefreshToken(newRefreshToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return $api.request(originalRequest);
      } catch (error) {
        await storageHelper.removeAccessToken();
        await storageHelper.removeRefreshToken();

        // AuthStore.setAuth(false);
        // AuthStore.user = null;
        // AuthStore.accessToken = null;

        console.log("НЕ АВТОРИЗОВАН", error);
      }
    }

    return Promise.reject(error);
  }
);

export default $api;
