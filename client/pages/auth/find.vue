<script lang="ts" setup>
import { useToast } from 'vue-toastification';
import { AxiosError } from 'axios';

definePageMeta({
  middleware: ['guest'],
});

const api = useApi();
const router = useRouter();
const toast = useToast();

const email = ref('');
const emailSuffix = ref('@dongguk.edu');

const { loading, startLoading, finishLoading } = useLoading();

async function submit() {
  if (email.value === '') {
    toast.error('이메일을 입력해주세요!');
    return;
  }

  const data = {
    email: email.value + emailSuffix.value,
  };

  try {
    startLoading();

    await api.auth.find.send(data);

    toast.success(`${email.value}로 이메일을 전송했습니다!`);
    router.replace('/auth/login');
  } catch (e) {
    if (e instanceof AxiosError) {
      if (e.response?.data.error === 'wrong email address') {
        toast.error('존재하지 않는 이메일 주소입니다!');
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
      <h1 class="text-3xl font-bold text-center mb-6">비밀번호 찾기</h1>
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
      <div class="flex">
        <NuxtLink class="btn btn-link flex-1" to="/auth/login">취소</NuxtLink>
        <BaseButton class="flex-1" type="submit" :loading="loading">전송</BaseButton>
      </div>
    </form>
  </div>
</template>
