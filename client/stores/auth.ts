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
  const token = ref<string>(null);
  const user = ref<User>(null);

  const loggedIn = computed(() => {
    return user.value !== null;
  });

  async function fetch() {
    const { $axios } = useNuxtApp();

    const { data } = await $axios.get('/auth/me');

    user.value = data;
    localStorage.setItem('auth.user', JSON.stringify(user.value));
  }

  async function logout() {
    token.value = null;
    localStorage.removeItem('auth.token');

    user.value = null;
    localStorage.removeItem('auth.user');
  }

  function loadUser() {
    const loadedToken = localStorage.getItem('auth.token');
    if (loadedToken) {
      token.value = JSON.parse(loadedToken);
    }

    const loadedUser = localStorage.getItem('auth.user');
    if (loadedUser) {
      user.value = JSON.parse(loadedUser);
    }
  }

  async function login(credentials: Credentials) {
    const { $axios } = useNuxtApp();

    const { data } = await $axios.post('/auth/login', credentials);

    token.value = data.token;
    localStorage.setItem('auth.token', JSON.stringify(token.value));

    await fetch();
  }

  return { user, token, loggedIn, login, fetch, logout, loadUser };
});
