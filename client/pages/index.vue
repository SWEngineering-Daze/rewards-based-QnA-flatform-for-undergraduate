<script lang="ts" setup>
definePageMeta({
  middleware: ['auth'],
});

const numberFormatter = Intl.NumberFormat('ko-KR');

const todayScholarship = 456000;
</script>

<template>
  <div class="py-12 px-8">
    <NuxtLink to="/profile">profile test</NuxtLink>

    <div class="text-center my-8 mb-24">
      <div class="text-2xl font-medium mb-3">오늘의 장학금</div>
      <div class="text-5xl text-indigo-500 font-bold">{{ numberFormatter.format(todayScholarship) }} P</div>
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
