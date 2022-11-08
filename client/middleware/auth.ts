import { useToast } from 'vue-toastification';
import { useAuth } from '@/stores/auth';

export default defineNuxtRouteMiddleware(() => {
  const auth = useAuth();

  if (!auth.loggedIn) {
    if (process.client) {
      const toast = useToast();

      toast.error('로그인이 필요합니다!');
    }
    return navigateTo('/auth/login');
  }
});
