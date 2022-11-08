<script lang="ts" setup>
definePageMeta({
  middleware: ['auth'],
});

const route = useRoute();

const id = route.params.questionId;
</script>

<template>
  <div class="py-8 px-12">question's _id: {{ id }}</div>
</template>
