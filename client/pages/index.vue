<template>
  <div class="py-5 px-7 flex-1 tracking-widest">
    <div class="text-center my-16">
      <div class="font-medium text-xl">오늘의 장학금</div>
      <div class="text-indigo-500 font-bold text-4xl">456,000 원</div>
    </div>
    <div v-for="section in [1, 2, 3, 4, 5]" :key="section" class="mb-20">
      <div class="mb-5">
        <h1 class="font-bold text-2xl">있어보이는 제목</h1>
        <div class="text-gray-500 text-sm">더 있어보이는 서브 제목</div>
      </div>
      <!-- 더미 -->
      <div class="rounded border py-3 px-5">
        <div v-for="i in [1, 2, 3, 4, 5]" :key="i" class="flex">
          <div class="w-20">
            <span class="font-medium">학과 {{ i }}</span>
          </div>
          <div class="w-2/4">
            <span class="font-light">글 제목 글 제목 글 제목 글 제목 글 제목 글 제목 {{ i }}</span>
          </div>
          <div class="flex-1 flex justify-end">
            <span class="font-light text-gray-500">{{ i * 10 }}초 전</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
