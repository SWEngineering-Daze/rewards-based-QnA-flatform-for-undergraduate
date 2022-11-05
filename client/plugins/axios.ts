import axios from 'axios';
import type { AxiosInstance } from 'axios';

export default defineNuxtPlugin(nuxtApp => {
  const instance = axios.create({
    baseURL: 'https://api.sw.bisue.shop',
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
