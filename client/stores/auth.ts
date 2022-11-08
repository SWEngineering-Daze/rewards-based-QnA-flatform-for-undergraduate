import { defineStore } from 'pinia';

export interface User {
  _id: string;
  email: string;
}

export interface Credentials {
  email: string;
  password: string;
}

export const useAuth = defineStore('auth', () => {
  const savedToken = useCookie('auth.token');
  const savedUser = useCookie<User>('auth.user');

  const token = ref<string>(null);
  const user = ref<User>(null);

  const loggedIn = computed(() => {
    return user.value !== null;
  });

  async function fetch() {
    const { $axios } = useNuxtApp();

    const { data } = await $axios.get('/auth/me');

    user.value = data;

    savedUser.value = user.value;
    savedToken.value = token.value;
  }

  function logout() {
    token.value = null;
    savedToken.value = null;

    user.value = null;
    savedUser.value = null;
  }

  function loadUser() {
    if (savedToken.value) {
      token.value = savedToken.value;
    }

    if (savedUser.value) {
      user.value = savedUser.value;
    }
  }

  async function login(credentials: Credentials) {
    const { $axios } = useNuxtApp();

    const { data } = await $axios.post('/auth/login', credentials);

    token.value = data.token;

    await fetch();
  }

  return { user, token, loggedIn, login, fetch, logout, loadUser };
});
