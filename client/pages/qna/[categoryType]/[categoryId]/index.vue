<script lang="ts" setup>
import { AxiosError } from 'axios';
import { useToast } from 'vue-toastification';
import { QuestionPaginator } from '@/composables/useApi';
import { encodeUrlSlash } from '@/utils/urlSlashEncode';

definePageMeta({
  middleware: ['auth'],
});

const { type, category } = await useCategory();
const { loading, startLoading, finishLoading } = useLoading();
const api = useApi();
const route = useRoute();
const toast = useToast();

const page = computed(() => {
  return Number.parseInt((route.query.page as string) ?? '1');
});

const query = computed(() => {
  return (route.query.q as string) ?? null;
});
const searchInput = ref(query.value);

async function search() {
  await navigateTo(`/qna/${type}/${category.name}?q=${searchInput.value}`);
}

async function fetchQuestionPaginator() {
  try {
    startLoading();

    questionPaginator.value = await api.questions.index(type, encodeUrlSlash(category.name), page.value, query.value);
  } catch (e) {
    if (e instanceof AxiosError) {
      toast.error('알 수 없는 네트워크 에러가 발생했습니다.');

      await navigateTo('/');
    } else {
      toast.error('알 수 없는 에러가 발생했습니다.');

      console.error(e);
    }
  } finally {
    finishLoading();
  }
}

const questionPaginator = ref<QuestionPaginator>(null);
await fetchQuestionPaginator();

const questions = computed(() => questionPaginator.value.questionList);
const totalQuestions = computed(() => questionPaginator.value.cntQuestions);

const perPage = 10; // from server
const totalPages = computed(() => Math.ceil(totalQuestions.value / perPage));
const pagingNumbers = ref<number[]>([]);
function calcPagingNumbers() {
  pagingNumbers.value = [];
  for (let i = page.value - 2; i <= page.value + 2; i++) {
    if (i >= 1 && i <= totalPages.value) {
      pagingNumbers.value.push(i);
    }
  }
}
calcPagingNumbers();

watch(
  () => route.query,
  async () => {
    await fetchQuestionPaginator();
    await calcPagingNumbers();
  }
);
</script>

<template>
  <div class="py-8 px-4 md:px-12">
    <div class="tracking-widest mb-12">
      <template v-if="type === 'department'">
        <h2 class="font-light text-blue-500 mb-2">{{ category.parent.name }}</h2>
      </template>
      <template v-else>
        <div class="mb-2">
          <NuxtLink class="font-light text-blue-500" :to="`/qna/department/${category.parent.name}`">{{ category.parent.name }}</NuxtLink>
        </div>
      </template>
      <div class="flex items-center">
        <h1 class="font-bold text-4xl">{{ category.name }}</h1>
        <button class="ml-3 transition-transform hover:rotate-45" @click="fetchQuestionPaginator()">
          <img class="w-6" src="@/assets/img/refresh.svg" alt="새로고침" />
        </button>
      </div>
    </div>

    <template v-if="query">
      <div class="mb-12">
        <span class="font-bold">'{{ query }}'</span> 에 대한 검색 결과입니다.
      </div>
    </template>

    <div class="text-xs text-gray-500 mb-4">총 {{ totalQuestions }}개</div>

    <template v-if="loading">
      <div class="flex flex-col items-center text-center text-slate-500 tracking-wider">
        <!-- spinner -->
        <LoadingSpinner class="w-12" />
      </div>
    </template>
    <template v-else-if="questions.length > 0">
      <div class="hidden sm:block">
        <div class="flex items-center border-t border-b py-3 text-indigo-500 font-bold">
          <span class="subject-col">과목</span>
          <span class="title-col">제목</span>
          <span class="created-col">날짜</span>
        </div>
        <div v-for="question in questions" :key="question._id" class="flex items-center my-2">
          <div class="subject-col">
            <NuxtLink
              class="block text-indigo-500 text-opacity-75 transition-all hover:text-opacity-100 text-sm"
              :to="`/qna/course/${encodeURIComponent(question.course.name)}`"
              >{{ question.course.name }}</NuxtLink
            >
          </div>
          <div class="title-col">
            <NuxtLink
              class="block text-indigo-500 text-opacity-75 transition-all hover:text-opacity-100"
              :to="`/qna/${type}/${encodeURIComponent(category.name)}/${question._id}`"
              >{{ question.title }} [{{ question.answers.length ?? 'x' }}]</NuxtLink
            >
          </div>
          <div class="created-col">
            <span class="ml-auto text-gray-500 text-sm">{{ $dayjs(question.createdAt).fromNow() }}</span>
          </div>
        </div>
      </div>
      <div class="block sm:hidden rounded border">
        <div v-for="question in questions" :key="question._id" class="mb-2 last:mb-0 rounded border-b last:border-none py-2 px-4">
          <div class="mb-1">
            <NuxtLink
              class="inline-block text-indigo-500 text-opacity-75 transition-all hover:text-opacity-100 text-sm"
              :to="`/qna/course/${encodeURIComponent(question.course.name)}`"
              >{{ question.course.name }}</NuxtLink
            >
          </div>
          <div class="title-col">
            <NuxtLink
              class="block text-black text-opacity-75 transition-all hover:text-opacity-100"
              :to="`/qna/${type}/${encodeURIComponent(category.name)}/${question._id}`"
              >{{ question.title }}</NuxtLink
            >
          </div>
          <div class="flex justify-end">
            <span class="ml-auto text-gray-500 text-sm">{{ $dayjs(question.createdAt).fromNow() }}</span>
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="flex flex-col items-center text-center text-slate-500 tracking-wider">
        <img class="w-12 mb-3" src="@/assets/img/sad.svg" />
        아직 아무 질문이 없습니다! <br />
        첫 번째 질문을 해보세요!
      </div>
    </template>

    <div class="flex justify-center my-12">
      <input v-model="searchInput" class="max-w-xs text-sm text-gray-700" type="text" placeholder="검색어를 입력하세요." @keypress.enter="search" />
    </div>

    <template v-if="pagingNumbers.length > 0">
      <div class="flex justify-center my-8">
        <NuxtLink
          v-for="p in pagingNumbers"
          :key="p"
          :to="page === p ? undefined : `/qna/${type}/${encodeURIComponent(category.name)}?page=${p}`"
          class="pagination-link"
          :class="{ active: page === p }"
          >{{ p }}</NuxtLink
        >
      </div>
    </template>

    <template v-if="type === 'course'">
      <div class="flex justify-end my-8">
        <NuxtLink class="inline-block text-indigo-500 btn btn-primary" :to="`/qna/${type}/${encodeURIComponent(category.name)}/create`">작성하기</NuxtLink>
      </div>
    </template>
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

.pagination-link {
  @apply inline-block py-2 px-5 text-white bg-indigo-500 bg-opacity-75 hover:bg-opacity-90 transition-all;
}
.pagination-link.active {
  @apply bg-opacity-100;
}
</style>
