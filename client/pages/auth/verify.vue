<script lang="ts" setup>
const { $axios } = useNuxtApp();
const route = useRoute();
const router = useRouter();

const token = route.query.token as string;

async function requestVerify() {
  try {
    await $axios.post('/auth/verifyUser', {
      signupToken: token,
    });

    router.replace('/auth/login');
  } catch (e) {
    console.log(e, e.response);
    router.replace('/');
  }
}

onMounted(() => {
  requestVerify();
});
</script>

<template>
  <div></div>
</template>
