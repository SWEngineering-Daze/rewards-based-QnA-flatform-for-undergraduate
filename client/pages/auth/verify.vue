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
    alert('인증 중 에러가 발생했습니다.\n유효한 토큰인지 확인해주세요!');
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
