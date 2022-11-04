<script lang="ts" setup>
const email = ref('');
const emailSuffix = ref('@dongguk.edu');
const password = ref('');
const passwordConfirmation = ref('');

function submit() {
  alert(`submit with '${email.value + emailSuffix.value}' and '${password.value}' and '${passwordConfirmation.value}'`);
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
        <button class="btn btn-primary flex-1" type="submit">회원가입</button>
      </div>
    </form>
  </div>
</template>
