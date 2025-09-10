import axios from "axios";
import Router from "next/router";

let accessToken = null;
let refreshToken = null;

export const tokenStore = {
  get access() { return accessToken; },
  get refresh() { return refreshToken; },
  setTokens: ({ access, refresh }) => { accessToken = access || null; refreshToken = refresh || null; },
  clear: () => { accessToken = null; refreshToken = null; },
};

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  if (tokenStore.access) config.headers.Authorization = `Bearer ${tokenStore.access}`;
  return config;
});

let isRefreshing = false;
let pending = [];

function onRefreshed(newToken) {
  pending.forEach((cb) => cb(newToken));
  pending = [];
}

api.interceptors.response.use(
  (r) => r,
  async (error) => {
    const original = error.config || {};
    if (error.response?.status === 401 && !original._retry && tokenStore.refresh) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          pending.push((newToken) => {
            original.headers = original.headers || {};
            original.headers.Authorization = `Bearer ${newToken}`;
            resolve(api(original));
          });
        });
      }
      original._retry = true;
      isRefreshing = true;
      try {
        const { data } = await axios.post("/api/auth/refresh", { refreshToken: tokenStore.refresh });
        tokenStore.setTokens({ access: data.accessToken, refresh: tokenStore.refresh });
        onRefreshed(data.accessToken);
        original.headers = original.headers || {};
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(original);
      } catch (_e) {
        tokenStore.clear();
        Router.push("/login");
        return Promise.reject(_e);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export default api;