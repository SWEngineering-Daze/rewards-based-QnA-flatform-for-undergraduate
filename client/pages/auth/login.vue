<script lang="ts" setup>
const { $axios } = useNuxtApp();

const email = ref('');
const emailSuffix = ref('@dongguk.edu');
const password = ref('');

const loading = ref(false);

async function submit() {
  const credentials = {
    email: email.value + emailSuffix.value,
    password: password.value,
  };

  try {
    loading.value = true;

    const { data } = await $axios.post('/auth/login', credentials);

    alert(`token: ${data.token}`);
  } catch (e) {
    alert('에러!');

    console.error(e, e.response);
  } finally {
    loading.value = false;
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
        <button class="btn btn-primary flex-1" type="submit">로그인</button>
      </div>
    </form>
  </div>
</template>
