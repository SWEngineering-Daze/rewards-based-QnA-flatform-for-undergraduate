import { useToast } from 'vue-toastification';
import { useAuth } from '@/stores/auth';

export default defineNuxtRouteMiddleware(() => {
  const auth = useAuth();

  if (auth.loggedIn) {
    if (process.client) {
      const toast = useToast();

      toast.error('로그인된 상태로는 이동할 수 없습니다!');
    }
    return navigateTo('/');
  }
});
