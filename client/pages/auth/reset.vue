<script lang="ts" setup>
import { AxiosError } from 'axios';
import { useToast } from 'vue-toastification';

definePageMeta({
  middleware: ['guest'],
});

const api = useApi();
const route = useRoute();
const router = useRouter();
const toast = useToast();

const token = route.query.token as string;

const password = ref('');
const passwordConfirmation = ref('');

const { loading, startLoading, finishLoading } = useLoading();

async function submit() {
  if (password.value === '' || passwordConfirmation.value === '') {
    toast.error('비밀번호를 입력해주세요!');
    return;
  } else if (password.value !== passwordConfirmation.value) {
    toast.error('비밀번호 확인이 일치하지 않습니다.\n다시 입력해주세요!');
    passwordConfirmation.value = '';
    return;
  }

  const data = {
    userToken: token,
    password: password.value,
  };

  try {
    startLoading();

    await api.auth.find.reset(data);

    toast.success(`비밀번호가 재설정되었습니다!\n로그인 해 주세요.`);
    router.replace('/auth/login');
  } catch (e) {
    if (e instanceof AxiosError) {
      toast.error('알 수 없는 네트워크 에러가 발생했습니다!');
    } else {
      toast.error('알 수 없는 에러가 발생했습니다!');

      console.error(e);
    }
  } finally {
    finishLoading();
  }
}
</script>

<template>
  <div class="py-12 px-4">
    <form class="max-w-md w-full mx-auto" @submit.prevent="submit">
      <h1 class="text-3xl font-bold text-center mb-6">비밀번호 재설정</h1>
      <div class="group">
        <div class="text-lg font-medium mb-1">비밀번호</div>
        <input v-model="password" type="password" name="password" />
      </div>
      <div class="group">
        <div class="text-lg font-medium mb-1">비밀번호 확인</div>
        <input v-model="passwordConfirmation" type="password" name="passwordConfirmation" />
      </div>
      <div class="flex">
        <BaseButton class="flex-1" type="submit" :loading="loading">변경</BaseButton>
      </div>
    </form>
  </div>
</template>
