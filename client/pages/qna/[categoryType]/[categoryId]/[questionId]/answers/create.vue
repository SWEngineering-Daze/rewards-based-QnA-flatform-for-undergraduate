<script lang="ts" setup>
import { AxiosError } from 'axios';
import { useToast } from 'vue-toastification';

definePageMeta({
  middleware: ['auth'],
});

const api = useApi();
const toast = useToast();
const route = useRoute();
const router = useRouter();
const { loading, startLoading, finishLoading } = useLoading();

const content = ref('');

const { data: question } = await useAsyncData(`answer-create-${route.params.questionId}`, async () => {
  try {
    const qna = await api.questions.show(route.params.questionId as string);

    return qna.question;
  } catch (e) {
    if (e instanceof AxiosError) {
      toast.error('알 수 없는 네트워크 에러가 발생했습니다.');

      await navigateTo('/');
    } else {
      toast.error('알 수 없는 에러가 발생했습니다.');

      console.error(e);
    }
  }
});

async function submit() {
  if (content.value === '') {
    toast.error('내용을 작성해주세요!');
    return;
  }
  try {
    startLoading();

    await api.answers.write(question.value._id, { content: content.value });

    toast.success(`성공적으로 답변을 작성했습니다!"`);
    router.replace(`/qna/course/${question.value.course.name}/${question.value._id}`);
  } catch (e) {
    if (e instanceof AxiosError) {
      toast.error('알 수 없는 네트워크 에러가 발생했습니다!');
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
  <div class="py-8 px-4 md:px-12">
    <form class="max-w-4xl w-full mx-auto" @submit.prevent="submit">
      <div class="mb-8 text-center">
        <div class="text-sm text-indigo-500 mb-1">{{ question.course.parent.name }}</div>
        <div class="text-xl">{{ question.course.name }}</div>
      </div>
      <h1 class="text-3xl text-center mb-6">{{ question.title }}</h1>
      <div class="my-6">
        <div class="text-lg font-medium mb-1">질문 내용</div>
        <div class="py-3 px-4 rounded border">{{ question.content }}</div>
      </div>
      <div class="group">
        <div class="text-lg font-medium mb-1">답변</div>
        <textarea v-model="content" name="content" rows="30"></textarea>
      </div>
      <div class="flex">
        <NuxtLink class="btn btn-link flex-1" :to="`/qna/course/${question.course.name}/${question._id}`">취소</NuxtLink>
        <BaseButton class="flex-1" type="submit" :loading="loading">작성</BaseButton>
      </div>
    </form>
  </div>
</template>
