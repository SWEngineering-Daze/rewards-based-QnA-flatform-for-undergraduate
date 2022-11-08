<script lang="ts" setup>
definePageMeta({
  middleware: ['auth'],
});

const { $axios } = useNuxtApp();
const route = useRoute();

const id = route.params.questionId;

const {
  data: { question },
} = await $axios.get(`/questions/${id}`);
</script>

<template>
  <div class="py-8 px-12">
    <h1 class="text-2xl font-bold mb-3">{{ question.title }}</h1>
    <div>{{ question.content }}</div>
  </div>
</template>
