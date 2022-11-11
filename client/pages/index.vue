<script lang="ts" setup>
import { AxiosError } from 'axios';
import { useToast } from 'vue-toastification';

definePageMeta({
  middleware: ['auth'],
});

const api = useApi();
const toast = useToast();

const todayScholarship = ref(0);
try {
  todayScholarship.value = await api.point.todayPoint();
} catch (e) {
  if (e instanceof AxiosError) {
    if (process.client) {
      toast.error('오늘의 장학금을 불러오지 못했습니다!');
    } else {
      throw createError({ statusCode: e.status, message: '오늘의 장학금을 불러오지 못했습니다!' });
    }
  } else {
    throw e;
  }
}

function format(n: number) {
  return Intl.NumberFormat('ko-KR').format(n);
}
</script>

<template>
  <div class="py-12 px-8">
    <div class="text-center my-8 mb-24">
      <div class="text-2xl font-medium mb-3">오늘의 장학금</div>
      <div class="text-5xl text-indigo-500 font-bold">{{ format(todayScholarship) }} P</div>
    </div>
    <div class="mb-16">
      <div class="text-2xl font-bold mb-3">장학글</div>
      <div class="rounded bg-50 border border-gray-200 py-4 px-6">
        <br />
        <br />
        <br />
        <br />
        <br />
      </div>
    </div>
    <div class="mb-16">
      <div class="text-2xl font-bold mb-3">입학글</div>
      <div class="rounded bg-50 border border-gray-200 py-4 px-6">
        <br />
        <br />
        <br />
        <br />
        <br />
      </div>
    </div>
    <div class="mb-16">
      <div class="text-2xl font-bold mb-3">휴학글</div>
      <div class="rounded bg-50 border border-gray-200 py-4 px-6">
        <br />
        <br />
        <br />
        <br />
        <br />
      </div>
    </div>
  </div>
</template>
