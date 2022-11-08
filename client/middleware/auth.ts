import { useAuth } from '@/stores/auth';
import { useToast } from 'vue-toastification';

export default defineNuxtRouteMiddleware((to, from) => {
  const auth = useAuth();

  if (!auth.loggedIn) {
    if (process.client) {
      const toast = useToast();

      toast.error('로그인이 필요합니다!');
    }
    return navigateTo('/auth/login');
  }
});
