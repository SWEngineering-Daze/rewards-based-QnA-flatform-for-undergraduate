import { useAuth } from '@/stores/auth';

export default defineNuxtPlugin(() => {
  const auth = useAuth();

  auth.loadUser();
});
