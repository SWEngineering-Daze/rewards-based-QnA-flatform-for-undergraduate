<script lang="ts" setup>
import { useToast } from 'vue-toastification';
import { AxiosError } from 'axios';
import { useAuth } from '@/stores/auth';

definePageMeta({
  middleware: ['guest'],
});

const auth = useAuth();
const router = useRouter();
const toast = useToast();

const email = ref('');
const emailSuffix = ref('@dongguk.edu');
const password = ref('');

const { loading, startLoading, finishLoading } = useLoading();

async function submit() {
  if (email.value === '' || password.value === '') {
    toast.error('이메일과 비밀번호 모두 입력해주세요!');
    return;
  }

  const credentials = {
    email: email.value + emailSuffix.value,
    password: password.value,
  };

  try {
    startLoading();

    await auth.login(credentials);

    toast.success(`로그인 되었습니다!`);
    router.replace('/');
  } catch (e) {
    if (e instanceof AxiosError) {
      if (e.response?.data.error === 'wrong email address') {
        toast.error('존재하지 않는 이메일 주소입니다!');
      } else if (e.response?.data.error === 'wrong password') {
        toast.error('비밀번호가 맞지 않습니다!');
        password.value = '';
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
      <h1 class="text-3xl font-bold text-center mb-6">로그인</h1>
      <div class="group">
        <div class="text-lg font-medium mb-1">학교 이메일</div>
        <div class="flex">
          <input v-model="email" class="flex-1 mr-1" type="text" name="email" placeholder="example" />
          <select v-model="emailSuffix" name="emailSuffix">
            <option value="@dongguk.edu">@dongguk.edu</option>
            <option value="@dgu.ac.kr">@dgu.ac.kr</option>
          </select>
        </div>
      </div>
      <div class="group">
        <div class="text-lg font-medium mb-1">비밀번호</div>
        <input v-model="password" type="password" name="password" />
      </div>
      <div class="flex">
        <NuxtLink class="btn btn-link flex-1" to="/auth/register">회원가입</NuxtLink>
        <BaseButton class="flex-1" type="submit" :loading="loading">로그인</BaseButton>
      </div>
    </form>
  </div>
</template>
