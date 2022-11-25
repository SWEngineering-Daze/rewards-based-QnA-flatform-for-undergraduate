<script lang="ts" setup>
import { AxiosError } from 'axios';
import { useToast } from 'vue-toastification';
import { Answer, Question } from '@/composables/useApi';

definePageMeta({
  middleware: ['auth'],
});

const api = useApi();
const toast = useToast();
const route = useRoute();
const router = useRouter();
const { loading, startLoading, finishLoading } = useLoading();

const questionId = computed(() => route.params.questionId as string);
const answerId = computed(() => route.params.answerId as string);

const content = ref('');
const filesToDelete = ref<string[]>([]);
const files = ref<File[]>([]);

const question = ref<Question>(null);
const answer = ref<Answer>(null);
try {
  const qna = await api.questions.show(questionId.value);
  question.value = qna.question;
  answer.value = qna.answers.find(ans => ans._id === answerId.value);
  content.value = answer.value.content;
} catch (e) {
  if (e instanceof AxiosError) {
    toast.error('알 수 없는 네트워크 에러가 발생했습니다.');

    await navigateTo('/');
  } else {
    toast.error('알 수 없는 에러가 발생했습니다.');

    console.error(e);
  }
}

async function submit() {
  if (content.value === '') {
    toast.error('내용을 작성해주세요!');
    return;
  }

  try {
    startLoading();

    await api.answers.update(answer.value._id, { content: content.value, filesToDelete: filesToDelete.value }, files.value);

    toast.success(`성공적으로 답변을 작성했습니다!`);
    router.replace(`/qna/course/${encodeURIComponent(question.value.course.name)}/${question.value._id}`);
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

function addFile(file: File) {
  files.value.push(file);
}

function addDeletedFile(fileId: string) {
  const idx = answer.value.fileIds.findIndex(f => f === fileId);
  answer.value.fileIds.splice(idx, 1);
  answer.value.fileNames.splice(idx, 1);
  filesToDelete.value.push(fileId);
}

function deleteFile(idx: number) {
  files.value.splice(idx, 1);
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
        <div class="py-3 px-4 rounded border">
          <MarkdownViewer :content="question.content" />
        </div>
      </div>
      <div class="group">
        <div class="text-lg font-medium mb-1">답변</div>
        <MarkdownEditor v-model="content" name="content" />
      </div>
      <div class="group">
        <div class="text-lg font-medium mb-3">첨부파일</div>
        <div v-for="(fileId, idx) in answer.fileIds" :key="fileId">
          <span class="inline-flex items-center">
            <img class="w-8" src="@/assets/img/attach.svg" />
            <span class="ml-1 mr-5">{{ answer.fileNames[idx] }}</span>
            <button type="button" @click="addDeletedFile(fileId)">
              <img class="w-8" src="@/assets/img/delete.svg" />
            </button>
          </span>
        </div>
        <div v-for="(file, idx) in files" :key="idx.toString() + file.name + file.type + file.size">
          <span class="inline-flex items-center">
            <img class="w-8" src="@/assets/img/attach.svg" />
            <span class="ml-1 mr-5">{{ file.name }}</span>
            <button type="button" @click="deleteFile(idx)">
              <img class="w-8" src="@/assets/img/delete.svg" />
            </button>
          </span>
        </div>
        <BaseFileSelector @attach="addFile">새 파일 추가</BaseFileSelector>
      </div>
      <div class="flex">
        <NuxtLink class="btn btn-link flex-1" :to="`/qna/course/${encodeURIComponent(question.course.name)}/${question._id}`">취소</NuxtLink>
        <BaseButton class="flex-1" type="submit" :loading="loading">작성</BaseButton>
      </div>
    </form>
  </div>
</template>
