<script lang="ts" setup>
import { AxiosError } from 'axios';
import { useToast } from 'vue-toastification';

definePageMeta({
  middleware: ['guest'],
});

const { $axios } = useNuxtApp();
const router = useRouter();
const toast = useToast();

const email = ref('');
const emailSuffix = ref('@dongguk.edu');
const password = ref('');
const passwordConfirmation = ref('');

const { loading, startLoading, finishLoading } = useLoading();

async function submit() {
  if (email.value === '' || password.value === '' || passwordConfirmation.value === '') {
    toast.error('이메일과 비밀번호 모두 입력해주세요!');
    return;
  } else if (password.value !== passwordConfirmation.value) {
    toast.error('비밀번호 확인이 일치하지 않습니다.\n다시 입력해주세요!');
    passwordConfirmation.value = '';
    return;
  }

  const credentials = {
    email: email.value + emailSuffix.value,
    password: password.value,
  };

  try {
    startLoading();

    await $axios.post('/auth/signup', credentials);

    toast.success(`인증 링크가 이메일로 전송되었습니다!`);
    router.replace('/auth/login');
  } catch (e) {
    if (e instanceof AxiosError) {
      if (e.response?.data.error === 'existing email address') {
        toast.error('이미 가입한 이메일입니다!\n이메일을 다시 확인해주세요.');
      } else {
        toast.error('알 수 없는 네트워크 에러가 발생했습니다!');
      }
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
      <h1 class="text-3xl font-bold text-center mb-6">회원가입</h1>
      <div class="group">
        <div class="text-lg font-medium mb-1">학교 이메일</div>
        <div class="flex">
          <input v-model="email" class="flex-1 mr-1" type="text" name="email" placeholder="example" />
          <select v-model="emailSuffix" name="emailSuffix">
            <option value="@dongguk.edu">@dongguk.edu</option>
            <option value="@dgu.ac.kr">@dgu.ac.kr</option>
          </select>
        </div>
        <div class="text-sm text-gray-500 mt-1 ml-1">지정된 학교 이메일만 이용할 수 있습니다.</div>
      </div>
      <div class="group">
        <div class="text-lg font-medium mb-1">비밀번호</div>
        <input v-model="password" type="password" name="password" />
      </div>
      <div class="group">
        <div class="text-lg font-medium mb-1">비밀번호 확인</div>
        <input v-model="passwordConfirmation" type="password" name="passwordConfirmation" />
      </div>
      <div class="flex">
        <NuxtLink class="btn btn-link flex-1" to="/auth/login">로그인</NuxtLink>
        <BaseButton class="flex-1" type="submit" :loading="loading">회원가입</BaseButton>
      </div>
    </form>
  </div>
</template>
