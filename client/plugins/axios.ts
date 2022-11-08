import axios from 'axios';
import type { AxiosInstance } from 'axios';
import { useAuth } from '@/stores/auth';

export default defineNuxtPlugin(nuxtApp => {
  const auth = useAuth();

  const instance = axios.create({
    baseURL: 'https://api.sw.bisue.shop',
  });

  instance.interceptors.request.use(config => {
    if (auth.token) {
      config.headers.Authorization = `bearer ${auth.token}`;
    }

    return config;
  });

  nuxtApp.provide('axios', instance);
});

declare module '#app' {
  interface NuxtApp {
    $axios: AxiosInstance;
  }
}
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
  }
}
