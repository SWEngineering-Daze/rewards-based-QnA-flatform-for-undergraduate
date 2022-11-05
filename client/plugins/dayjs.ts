import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime.js';
import 'dayjs/locale/ko';

export default defineNuxtPlugin(nuxtApp => {
  // eslint-disable-next-line import/no-named-as-default-member
  dayjs.locale('ko');
  // eslint-disable-next-line import/no-named-as-default-member
  dayjs.extend(relativeTime);

  nuxtApp.provide('dayjs', dayjs);
});

declare module '#app' {
  interface NuxtApp {
    $dayjs: dayjs.Dayjs;
  }
}
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $dayjs(date?: dayjs.ConfigType): dayjs.Dayjs;
  }
}
