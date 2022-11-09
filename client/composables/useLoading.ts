export const useLoading = () => {
  const loading = ref(false);

  function startLoading() {
    loading.value = true;
  }

  function finishLoading() {
    loading.value = false;
  }

  return { startLoading, finishLoading, loading: computed(() => loading.value) };
};
