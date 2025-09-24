const REFRESH_TOKEN_KEY = 'REFRESH_TOKEN';
const ACCESS_TOKEN_KEY = 'ACCESS_TOKEN';

const isBrowser = () => typeof window !== 'undefined';

export const storageHelper = {
    setRefreshToken(token: string) {
        if (!isBrowser()) return;
        localStorage.setItem(REFRESH_TOKEN_KEY, token);
    },
    getRefreshToken(): string | null {
        if (!isBrowser()) return null;
        return localStorage.getItem(REFRESH_TOKEN_KEY);
    },
    removeRefreshToken() {
        if (!isBrowser()) return;
        localStorage.removeItem(REFRESH_TOKEN_KEY);
    },
    setAccessToken(token: string) {
        if (!isBrowser()) return;
        localStorage.setItem(ACCESS_TOKEN_KEY, token);
    },
    getAccessToken(): string | null {
        if (!isBrowser()) return null;
        return localStorage.getItem(ACCESS_TOKEN_KEY);
    },
    removeAccessToken() {
        if (!isBrowser()) return;
        localStorage.removeItem(ACCESS_TOKEN_KEY);
    },
};
