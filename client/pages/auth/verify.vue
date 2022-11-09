<script lang="ts" setup>
import { AxiosError } from 'axios';
import { useToast } from 'vue-toastification';

definePageMeta({
  middleware: ['guest'],
});

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
    if (e instanceof AxiosError) {
      if (e.response?.data.error === '<ERROR_MESSAGE>') {
        toast.error('인증 중 에러가 발생했습니다.\n유효한 토큰인지 확인해주세요!');
      } else {
        toast.error('알 수 없는 네트워크 에러가 발생했습니다!');
      }
    } else {
      toast.error('알 수 없는 에러가 발생했습니다!');

      console.error(e);
    }

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
