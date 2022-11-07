<script lang="ts" setup>
import { useToast } from 'vue-toastification';

const { $axios } = useNuxtApp();
const route = useRoute();
const router = useRouter();
const toast = useToast();

const token = route.query.token as string;

async function requestVerify() {
  try {
    await $axios.post('/auth/verifyUser', {
      signupToken: token,
    });

    toast.success('인증이 완료되었습니다.\n해당 이메일로 로그인 해주세요!');
    router.replace('/auth/login');
  } catch (e) {
    toast.error('인증 중 에러가 발생했습니다.\n유효한 토큰인지 확인해주세요!');

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
