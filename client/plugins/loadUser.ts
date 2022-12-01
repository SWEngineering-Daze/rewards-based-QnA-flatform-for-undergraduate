import { AxiosError } from 'axios';
import { useAuth } from '@/stores/auth';

export default defineNuxtPlugin(async () => {
  const auth = useAuth();

  auth.loadUser();
  if (!auth.token && auth.user) {
    auth.logout();
  }
  if (auth.token) {
    try {
      await auth.fetch();
    } catch (e) {
      if (e instanceof AxiosError) {
        if (e.response.data.error === 'Invalid Token') {
          auth.logout();

          await navigateTo('/auth/login');
        } else {
          throw e;
        }
      } else {
        throw e;
      }
    }
  }
});
