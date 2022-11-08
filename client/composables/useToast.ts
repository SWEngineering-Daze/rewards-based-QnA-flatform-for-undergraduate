import * as pkg from 'vue-toastification';
const { useToast: useToastOriginal } = pkg;

export const useToast = () => {
  const toast = useToastOriginal();

  return toast;
};
