<script lang="ts" setup>
const { type, category } = useCategory();

const title = ref('');
const content = ref('');

function submit() {
  alert(`submit with '${title.value}' and '${content.value}'`);
}
</script>

<template>
  <div class="py-8 px-4 md:px-12">
    <form class="max-w-5xl w-full mx-auto" @submit.prevent="submit">
      <div class="mb-8 text-center">
        <div class="text-indigo-500 mb-1">{{ category.parent.name }}</div>
        <div class="text-2xl">{{ category.name }}</div>
      </div>
      <h1 class="text-3xl font-bold text-center mb-6">질문 작성</h1>
      <div class="group">
        <div class="text-lg font-medium mb-1">제목</div>
        <input v-model="title" class="flex-1" type="text" name="email" placeholder="example" />
      </div>
      <div class="group">
        <div class="text-lg font-medium mb-1">내용</div>
        <textarea v-model="content" name="content" rows="30"></textarea>
      </div>
      <div class="flex">
        <NuxtLink class="btn btn-link flex-1" :to="`/qna/${type}/${category.id}`">취소</NuxtLink>
        <button class="btn btn-primary flex-1" type="submit">작성</button>
      </div>
    </form>
  </div>
</template>
