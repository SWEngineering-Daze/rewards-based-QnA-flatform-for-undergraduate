import { defineStore } from 'pinia';
import { Credentials, User } from '@/composables/useApi';

export const useAuth = defineStore('auth', () => {
  const savedToken = useCookie('auth.token', { maxAge: 60 * 60 * 8 });
  const savedUser = useCookie<User>('auth.user', { maxAge: 60 * 60 * 8 });

  const token = ref<string>(null);
  const user = ref<User>(null);

  const loggedIn = computed(() => {
    return user.value !== null;
  });

  const fetch = async () => {
    const api = useApi();

    user.value = await api.auth.me();

    savedUser.value = user.value;
    savedToken.value = token.value;
  };

  const logout = () => {
    token.value = null;
    savedToken.value = null;

    user.value = null;
    savedUser.value = null;
  };

  const loadUser = () => {
    if (savedToken.value) {
      token.value = savedToken.value;
    }

    if (savedUser.value) {
      user.value = savedUser.value;
    }
  };

  const login = async (credentials: Credentials) => {
    const api = useApi();

    const data = await api.auth.login(credentials);

    token.value = data.token;

    await fetch();
  };

  return { user, token, loggedIn, login, fetch, logout, loadUser };
});
