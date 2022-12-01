<script lang="ts" setup>
import { AxiosError } from 'axios';
import { useToast } from 'vue-toastification';

definePageMeta({
  middleware: ['auth'],
});

const api = useApi();
const { type, category } = await useCategory();
const toast = useToast();
const router = useRouter();
const { loading, startLoading, finishLoading } = useLoading();

const title = ref('');
const content = ref('');
const files = ref<File[]>([]);

if (type !== 'course') {
  toast.error('유효하지 않은 접근입니다!');
  router.replace('/');
}

async function submit() {
  if (title.value === '' || content.value === '') {
    toast.error('제목과 내용을 모두 작성해주세요!');
    return;
  }

  try {
    startLoading();

    await api.questions.write(
      {
        title: title.value,
        content: content.value,
        courseName: category.name,
      },
      files.value
    );

    toast.success(`성공적으로 질문을 작성했습니다!`);
    router.replace(`/qna/${type}/${encodeURIComponent(category.name)}`);
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

function deleteFile(idx: number) {
  files.value.splice(idx, 1);
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
        <MarkdownEditor v-model="content" name="content" />
        <!-- <textarea v-model="content" name="content" rows="30"></textarea> -->
      </div>
      <div class="group">
        <div class="text-lg font-medium mb-3">첨부파일</div>
        <div v-for="(file, idx) in files" :key="idx.toString() + file.name + file.type + file.size">
          <span class="inline-flex items-center">
            <img class="w-8" src="@/assets/img/attach.svg" alt="첨부파일" />
            <span class="ml-1 mr-5">{{ file.name }}</span>
            <button type="button" @click="deleteFile(idx)">
              <img class="w-8" src="@/assets/img/delete.svg" alt="삭제" />
            </button>
          </span>
        </div>
        <BaseFileSelector class="mt-4" @attach="addFile" />
      </div>
      <div class="flex">
        <NuxtLink class="btn btn-link flex-1" :to="`/qna/${type}/${encodeURIComponent(category.name)}`">취소</NuxtLink>
        <BaseButton class="flex-1" type="submit" :loading="loading">작성</BaseButton>
      </div>
    </form>
  </div>
</template>
