<script lang="ts" setup>
import { AxiosError } from 'axios';
import { useToast } from 'vue-toastification';
import { Answer, Question } from '~~/composables/useApi';
import { useAuth } from '~~/stores/auth';

definePageMeta({
  middleware: ['auth'],
});

const route = useRoute();
const toast = useToast();
const auth = useAuth();

const api = useApi();

const qna = ref<{ question: Question; answers: Answer[] }>(null);
try {
  qna.value = await api.questions.show(route.params.questionId as string);
} catch (e) {
  if (e instanceof AxiosError) {
    toast.error('알 수 없는 네트워크 에러가 발생했습니다.');

    await navigateTo('/');
  } else {
    toast.error('알 수 없는 에러가 발생했습니다.');

    console.error(e);
  }
}
const question = qna.value.question;
question.answers = qna.value.answers;

function isAlreadyLiked(answer: Answer) {
  return answer.recommendations.findIndex(r => r.from === auth.user._id) !== -1;
}

function getLikeCount(answer: Answer) {
  return answer.recommendations.length;
}

function isMine(answer: Answer) {
  return answer.writer === auth.user.email;
}

async function like(answer: Answer) {
  if (isAlreadyLiked(answer)) {
    toast.error('이미 추천했습니다!');
    return;
  } else if (isMine(answer)) {
    toast.error('자신의 답변은 추천할 수 없습니다!');
    return;
  }

  try {
    await api.answers.like(answer._id);

    answer.recommendations.push({ from: auth.user._id, answer: answer._id });

    toast.success('이 답변을 추천했습니다!');
  } catch (e) {
    if (e instanceof AxiosError) {
      toast.error('알 수 없는 네트워크 에러가 발생했습니다.');
    } else {
      toast.error('알 수 없는 에러가 발생했습니다.');

      console.error(e);
    }
  }
}
</script>

<template>
  <div class="py-8 px-4 md:px-12">
    <section class="rounded border py-5 px-5 md:px-10 max-w-4xl mx-auto break-all">
      <article>
        <div class="text-center">
          <div class="mb-6 text-center">
            <div>
              <NuxtLink :to="`/qna/department/${question.course.parent.name}`" class="text-sm text-indigo-500 mb-1">{{ question.course.parent.name }}</NuxtLink>
            </div>
            <div>
              <NuxtLink :to="`/qna/course/${question.course.name}`" class="text-xl">{{ question.course.name }}</NuxtLink>
            </div>
          </div>
          <h1 class="text-3xl mb-3">{{ question.title }}</h1>
        </div>
        <hr class="my-6" />
        <div>
          <MarkdownViewer :content="question.content" />
        </div>
      </article>
      <div class="flex justify-center my-12">
        <NuxtLink class="btn btn-primary block w-full" :to="`/qna/course/${encodeURIComponent(question.course.name)}/${question._id}/answers/create`"
          >답변 작성</NuxtLink
        >
      </div>
      <div v-for="answer in question.answers" :key="answer._id">
        <hr class="my-6" />
        <article>
          <div class="flex items-center mb-6">
            <div class="inline-flex items-center text-slate-500">
              <img class="w-8" :src="isAlreadyLiked(answer) ? `/img/heart-filled.svg` : `/img/heart.svg`" alt="좋아요" />
              <span class="ml-1" :class="{ 'text-red-500': isAlreadyLiked(answer) }">{{ getLikeCount(answer) }}</span>
            </div>
            <span class="rounded-full bg-slate-500 text-white text-sm py-2 px-6 ml-8">답변</span>
          </div>
          <div>
            <MarkdownViewer :content="answer.content" />
          </div>
          <div class="flex justify-center mt-12">
            <button class="rounded-full border-2 border-indigo-500 bg-white text-indigo-500 font-medium py-2 px-12" @click="like(answer)">좋아요!</button>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>
