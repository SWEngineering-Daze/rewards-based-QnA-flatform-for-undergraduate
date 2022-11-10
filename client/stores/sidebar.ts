import { defineStore } from 'pinia';

export const useSidebar = defineStore('sidebar', () => {
  const opened = ref(false);

  const open = () => {
    opened.value = true;
  };

  const close = () => {
    opened.value = false;
  };

  const toggle = () => {
    opened.value = !opened.value;
  };

  return { opened: computed(() => opened.value), open, close, toggle };
});
