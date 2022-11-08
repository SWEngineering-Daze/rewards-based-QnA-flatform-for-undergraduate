import { useAuth } from '@/stores/auth';
import { useToast } from 'vue-toastification';

export default defineNuxtRouteMiddleware((to, from) => {
  const auth = useAuth();

  if (auth.loggedIn) {
    if (process.client) {
      const toast = useToast();

      toast.error('로그인된 상태로는 이동할 수 없습니다!');
    }

    return navigateTo('/');
  }
});
