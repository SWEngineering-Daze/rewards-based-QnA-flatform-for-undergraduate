<script lang="ts" setup>
import { AxiosError } from 'axios';
import { useToast } from 'vue-toastification';
import { Answer, Question } from '@/composables/useApi';
import { useAuth } from '@/stores/auth';

definePageMeta({
  middleware: ['auth'],
});

const route = useRoute();
const router = useRouter();
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

async function removeQuestion(id: string) {
  if (!confirm('정말 질문을 삭제하시겠습니까?')) return;

  try {
    await api.questions.remove(id);

    toast.success('질문을 삭제했습니다!');
    router.replace(`/qna/course/${question.course.name}`);
  } catch (e) {
    if (e instanceof AxiosError) {
      toast.error('알 수 없는 네트워크 에러가 발생했습니다.');
    } else {
      toast.error('알 수 없는 에러가 발생했습니다.');

      console.error(e);
    }
  }
}

async function removeAnswer(id: string) {
  if (!confirm('정말 답변을 삭제하시겠습니까?')) return;

  try {
    await api.answers.remove(id);

    toast.success('답변을 삭제했습니다!');
    const idx = question.answers.findIndex(ans => ans._id === id);
    question.answers.splice(idx, 1);
  } catch (e) {
    if (e instanceof AxiosError) {
      toast.error('알 수 없는 네트워크 에러가 발생했습니다.');
    } else {
      toast.error('알 수 없는 에러가 발생했습니다.');

      console.error(e);
    }
  }
}

async function downloadFile(id: string, name: string) {
  try {
    const file = await api.files.download(id);

    const url = window.URL.createObjectURL(new Blob([file]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', name); // or any other extension
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (e) {
    if (e instanceof AxiosError) {
      if (e.response?.status === 404) {
        toast.error('파일을 찾을 수 없습니다!');
      } else {
        toast.error('알 수 없는 네트워크 에러가 발생했습니다.');
      }
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
        <template v-if="auth.user.email === question.writer">
          <div class="flex justify-end mb-6">
            <button class="btn text-red-500" @click="removeQuestion(question._id)">삭제</button>
            <NuxtLink class="btn text-blue-500">수정</NuxtLink>
          </div>
        </template>
        <template v-if="question.fileIds.length > 0">
          <div class="flex flex-col mb-6">
            <a
              v-for="(fileId, idx) in question.fileIds"
              :key="fileId"
              class="inline-flex items-center mb-1 last:mb-0 group"
              href="#"
              @click.prevent="downloadFile(fileId, question.fileNames[idx])"
            >
              <img class="w-8" src="@/assets/img/attach.svg" />
              <span class="ml-1 mr-5 font-medium text-sm text-black text-opacity-75 group-hover:text-opacity-100">{{ question.fileNames[idx] }}</span>
            </a>
          </div>
        </template>
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
          <template v-if="auth.user.email === answer.writer">
            <div class="flex justify-end mb-6">
              <button class="btn text-red-500" @click="removeAnswer(answer._id)">삭제</button>
              <NuxtLink class="btn text-blue-500">수정</NuxtLink>
            </div>
          </template>
          <template v-if="answer.fileIds.length > 0">
            <div class="flex flex-col mb-6">
              <a
                v-for="(fileId, idx) in answer.fileIds"
                :key="fileId"
                class="inline-flex items-center mb-1 last:mb-0 group"
                href="#"
                @click.prevent="downloadFile(fileId, answer.fileNames[idx])"
              >
                <img class="w-8" src="@/assets/img/attach.svg" />
                <span class="ml-1 mr-5 font-medium text-sm text-black text-opacity-75 group-hover:text-opacity-100">{{ answer.fileNames[idx] }}</span>
              </a>
            </div>
          </template>
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
