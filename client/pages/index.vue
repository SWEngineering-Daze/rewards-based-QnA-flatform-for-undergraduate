<script lang="ts" setup>
import { AxiosError } from 'axios';
import { useToast } from 'vue-toastification';
import { Question } from '~~/composables/useApi';

definePageMeta({
  middleware: ['auth'],
});

const api = useApi();
const toast = useToast();

const todayScholarship = ref(0);
try {
  todayScholarship.value = await api.point.todayPoint().then(r => r.value);
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

async function getQuestionsPreview(type: 'best' | 'new' | 'old') {
  try {
    if (type === 'best') {
      return await api.questions.best();
    } else if (type === 'new') {
      return await api.questions.new();
    } else {
      return await api.questions.old();
    }
  } catch (e) {
    if (e instanceof AxiosError) {
      if (process.client) {
        toast.error('게시글들을 불러오지 못했습니다!');
      } else {
        throw createError({ statusCode: e.status, message: '오늘의 장학금을 불러오지 못했습니다!' });
      }
    } else {
      throw e;
    }
  }
}
const bestQuestions = ref<Question[]>(await getQuestionsPreview('best'));
const newQuestions = ref<Question[]>(await getQuestionsPreview('new'));
const oldQuestions = ref<Question[]>(await getQuestionsPreview('old'));

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
      <div class="flex items-center mb-3">
        <div class="text-2xl font-bold mr-2">장학글</div>
        <ToolTip>
          어제 하루 동안 가장 많은 추천을 받은<br />
          답변이 달린 질문들입니다.
        </ToolTip>
      </div>
      <div class="rounded bg-50 border border-gray-200 py-4 px-6">
        <template v-if="bestQuestions.length > 0">
          <div v-for="question in bestQuestions" :key="question._id" class="flex items-center my-2">
            <div class="subject-col">
              <NuxtLink
                class="block text-black font-medium text-opacity-75 transition-all hover:text-opacity-100 text-sm"
                :to="`/qna/course/${encodeURIComponent(question.course.name)}`"
                >{{ question.course.name }}</NuxtLink
              >
            </div>
            <div class="title-col">
              <NuxtLink
                class="flex items-center text-black font-light text-opacity-75 transition-all hover:text-opacity-100"
                :to="`/qna/course/${encodeURIComponent(question.course.name)}/${question._id}`"
              >
                {{ question.title }} [{{ question.cntAnswers ?? 'x' }}]
                <!-- <span class="ml-3 text-red-500 text-sm font-bold">+{{ question.countYesterdayRecommendations }}</span> -->
              </NuxtLink>
            </div>
            <div class="recommendations-col">
              <span class="ml-auto text-red-500 text-sm font-bold">+{{ question.countYesterdayRecommendations }}</span>
            </div>
            <div class="created-col">
              <span class="ml-auto text-gray-500 text-sm">{{ $dayjs(question.createdAt).fromNow() }}</span>
            </div>
          </div>
        </template>
        <template v-else>
          <EmptyMessage>장학글이 없습니다!</EmptyMessage>
        </template>
      </div>
    </div>
    <div class="mb-16">
      <div class="flex items-center mb-3">
        <div class="text-2xl font-bold mr-2">입학글</div>
        <ToolTip> 가장 최근에 올라온 질문들입니다. </ToolTip>
      </div>
      <div class="rounded bg-50 border border-gray-200 py-4 px-6">
        <template v-if="newQuestions.length > 0">
          <div v-for="question in newQuestions" :key="question._id" class="flex items-center my-2">
            <div class="subject-col">
              <NuxtLink
                class="block text-black font-medium text-opacity-75 transition-all hover:text-opacity-100 text-sm"
                :to="`/qna/course/${encodeURIComponent(question.course.name)}`"
                >{{ question.course.name }}</NuxtLink
              >
            </div>
            <div class="title-col">
              <NuxtLink
                class="block text-black font-light text-opacity-75 transition-all hover:text-opacity-100"
                :to="`/qna/course/${encodeURIComponent(question.course.name)}/${question._id}`"
                >{{ question.title }} [{{ question.answers.length ?? 'x' }}]</NuxtLink
              >
            </div>
            <div class="created-col">
              <span class="ml-auto text-gray-500 text-sm">{{ $dayjs(question.createdAt).fromNow() }}</span>
            </div>
          </div>
        </template>
        <template v-else>
          <EmptyMessage>입학글이 없습니다!</EmptyMessage>
        </template>
      </div>
    </div>
    <div class="mb-16">
      <div class="flex items-center mb-3">
        <div class="text-2xl font-bold mr-2">휴학글</div>
        <ToolTip>
          최근 이틀 내에 올라온 <br />
          아직 답변이 없는 질문들입니다.
        </ToolTip>
      </div>
      <div class="rounded bg-50 border border-gray-200 py-4 px-6">
        <template v-if="oldQuestions.length > 0">
          <div v-for="question in oldQuestions" :key="question._id" class="flex items-center my-2">
            <div class="subject-col">
              <NuxtLink
                class="block text-black font-medium text-opacity-75 transition-all hover:text-opacity-100 text-sm"
                :to="`/qna/course/${encodeURIComponent(question.course.name)}`"
                >{{ question.course.name }}</NuxtLink
              >
            </div>
            <div class="title-col">
              <NuxtLink
                class="block text-black font-light text-opacity-75 transition-all hover:text-opacity-100"
                :to="`/qna/course/${encodeURIComponent(question.course.name)}/${question._id}`"
                >{{ question.title }} [{{ question.answers.length ?? 'x' }}]</NuxtLink
              >
            </div>
            <div class="created-col">
              <span class="ml-auto text-gray-500 text-sm">{{ $dayjs(question.createdAt).fromNow() }}</span>
            </div>
          </div>
        </template>
        <template v-else>
          <EmptyMessage>휴학글이 없습니다!</EmptyMessage>
        </template>
      </div>
    </div>
  </div>
</template>

<style lang="postcss">
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
  @apply flex-grow single-line flex items-center;
}
.recommendations-col {
  @apply ml-5 flex-shrink-0;
}
.created-col {
  @apply ml-5 flex-shrink-0 text-right;
  width: 60px;
}
</style>
