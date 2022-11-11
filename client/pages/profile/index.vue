<script lang="ts" setup>
import { useAuth } from '~~/stores/auth';

definePageMeta({
  middleware: ['auth'],
});

const auth = useAuth();
</script>

<template>
  <div class="py-8 px-4 md:px-12">
    <div class="tracking-widest mb-12">
      <h1 class="font-bold text-4xl">내 정보</h1>
    </div>

    <div class="flex items-center mb-24">
      <!-- placeholder -->
      <div class="rounded-full w-64 h-64 bg-gray-200 mr-10"></div>
      <div class="text-xl">
        <div class="font-bold">LV. ??</div>
        <div>???????</div>
        <div>{{ auth.user.email }}</div>
      </div>
      <div class="ml-auto">
        <span class="text-5xl font-bold text-cyan-500">???? P</span>
      </div>
    </div>

    <div class="mb-16">
      <div class="text-2xl font-bold mb-3">내 질문</div>
      <div class="rounded bg-50 border border-gray-200 py-4 px-6">
        <br />
        <br />
        <br />
        <br />
        <br />
      </div>
    </div>

    <div class="mb-16">
      <div class="text-2xl font-bold mb-3">내 답변</div>
      <div class="rounded bg-50 border border-gray-200 py-4 px-6">
        <br />
        <br />
        <br />
        <br />
        <br />
      </div>
    </div>

    <div class="mb-16">
      <div class="text-2xl font-bold mb-3">포인트 이력</div>
      <div class="rounded bg-50 border border-gray-200 py-4 px-6">
        <br />
        <br />
        <br />
        <br />
        <br />
      </div>
    </div>

    <div class="mb-16">
      <div class="text-2xl font-bold mb-3">쿠폰 목록</div>
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
