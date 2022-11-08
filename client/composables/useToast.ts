import * as pkg from 'vue-toastification';
const { useToast: useToastOriginal } = pkg;

export const useToast = () => {
  console.log(useToastOriginal);
  const toast = useToastOriginal();

  return toast;
};
