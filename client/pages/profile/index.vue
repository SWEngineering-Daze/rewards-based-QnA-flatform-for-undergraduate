<script lang="ts" setup>
import { QuestionPaginator, AnswerPaginator } from '@/composables/useApi';
import { useAuth } from '@/stores/auth';

definePageMeta({
  middleware: ['auth'],
});

const api = useApi();
const auth = useAuth();
const { level, maxExp, curExp, expPercent, point } = usePointStatus();

const myQuestionPaginator = ref<QuestionPaginator>();
const myAnswerPaginator = ref<AnswerPaginator>();
try {
  myQuestionPaginator.value = await api.questions.me(1, 5);
  myAnswerPaginator.value = await api.answers.me(1, 5);
} catch (e) {
  console.error(e);
}

function format(n: number) {
  return Intl.NumberFormat('ko-KR').format(n);
}
</script>

<template>
  <div class="py-8 px-4 md:px-12">
    <div class="tracking-widest mb-12">
      <h1 class="font-bold text-4xl">내 정보</h1>
    </div>

    <div class="flex items-center mb-24">
      <!-- placeholder -->
      <img class="rounded-full w-64 h-64 mr-10" src="@/assets/img/dgu_logo.jpg" />
      <div class="text-xl">
        <div class="font-bold">LV. {{ level }} - {{ expPercent.toFixed(2) }}% ({{ curExp }}/{{ maxExp }})</div>
        <div>{{ auth.user.email }}</div>
      </div>
      <div class="ml-auto">
        <span class="text-5xl font-bold text-cyan-500">{{ format(point) }} P</span>
      </div>
    </div>

    <div class="mb-16">
      <div class="text-2xl font-bold mb-3">내 질문</div>
      <div class="rounded bg-50 border border-gray-200 py-4 px-6">
        <div v-for="question in myQuestionPaginator.questionList" :key="question._id" class="flex items-center my-2">
          <div class="subject-col">
            <NuxtLink
              class="block text-indigo-500 font-medium text-opacity-75 transition-all hover:text-opacity-100 text-sm"
              :to="`/qna/course/${encodeURIComponent(question.course.name)}`"
              >{{ question.course.name }}</NuxtLink
            >
          </div>
          <div class="title-col">
            <NuxtLink
              class="block text-indigo-500 font-light text-opacity-75 transition-all hover:text-opacity-100"
              :to="`/qna/course/${encodeURIComponent(question.course.name)}/${question._id}`"
              >{{ question.title }} [{{ question.countAnswer ?? 'x' }}]</NuxtLink
            >
          </div>
          <div class="created-col">
            <span class="ml-auto text-gray-500 text-sm">{{ $dayjs(question.createdAt).fromNow() }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="mb-16">
      <div class="text-2xl font-bold mb-3">내 답변</div>
      <div class="rounded bg-50 border border-gray-200 py-4 px-6">
        <div v-for="answer in myAnswerPaginator.answerList" :key="answer._id">
          <!-- question -->
          <div class="flex items-center my-2">
            <div class="subject-col">
              <NuxtLink
                class="block text-indigo-500 font-medium text-opacity-75 transition-all hover:text-opacity-100 text-sm"
                :to="`/qna/course/${encodeURIComponent(answer.question?.course?.name)}`"
                >{{ answer.question.course.name }}</NuxtLink
              >
            </div>
            <div class="title-col">
              <NuxtLink
                class="block text-indigo-500 font-light text-opacity-75 transition-all hover:text-opacity-100"
                :to="`/qna/course/${encodeURIComponent(answer.question?.course?.name)}/${answer?.question?._id}`"
                >{{ answer.question.title }} [{{ answer.question?.countAnswer ?? 'x' }}]</NuxtLink
              >
            </div>
            <div class="created-col">
              <span class="ml-auto text-gray-500 text-sm">{{ $dayjs(answer.question?.createdAt).fromNow() }}</span>
            </div>
          </div>
          <!-- answer -->
          <div class="p-3 rounded bg-gray-100 text-gray-600">
            {{ answer.content }}
          </div>
        </div>
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

<style lang="postcss" scoped>
.single-line {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}

.subject-col {
  @apply w-44 flex-shrink-0 single-line;
}
.title-col {
  @apply flex-grow single-line;
}
.created-col {
  @apply ml-5 flex-shrink-0;
}
</style>
