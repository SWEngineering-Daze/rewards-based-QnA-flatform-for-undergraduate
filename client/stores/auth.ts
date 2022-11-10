import { defineStore } from 'pinia';
import { Credentials, User } from '@/composables/useApi';

export const useAuth = defineStore('auth', () => {
  const savedToken = useCookie('auth.token');
  const savedUser = useCookie<User>('auth.user');

  const token = ref<string>(null);
  const user = ref<User>(null);

  const loggedIn = computed(() => {
    return user.value !== null;
  });

  const fetch = async () => {
    const api = useApi();

    const { data } = await api.auth.me();

    user.value = data;

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

    const { data } = await api.auth.login(credentials);

    token.value = data.token;

    await fetch();
  };

  return { user, token, loggedIn, login, fetch, logout, loadUser };
});
