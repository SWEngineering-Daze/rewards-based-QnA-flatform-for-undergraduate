<script lang="ts" setup>
const { type, category } = await useCategory();
const { $axios } = useNuxtApp();

const { data: questions } = await $axios.get(`/questions/${type}/${category.name}`);
</script>

<template>
  <div class="py-8 px-12">
    <div class="tracking-widest mb-12">
      <template v-if="type === 'department'">
        <h2 class="font-light text-blue-500 mb-2">{{ category.parent.name }}</h2>
      </template>
      <template v-else>
        <NuxtLink class="block font-light text-blue-500 mb-2" :to="`/qna/department/${category.parent.name}`">{{ category.parent.name }}</NuxtLink>
      </template>
      <h1 class="font-bold text-4xl">{{ category.name }}</h1>
    </div>

    <div class="text-xs text-gray-500 mb-4">총 {{ questions.length }}개</div>

    <template v-if="questions.length > 0">
      <div>
        <div class="flex items-center border-t border-b py-3 text-indigo-500 font-bold">
          <span class="subject-col">과목</span>
          <span class="title-col">제목</span>
          <span class="created-col">날짜</span>
        </div>
        <div v-for="question in questions" :key="question._id" class="flex items-center my-2">
          <div class="subject-col">
            <NuxtLink
              class="block text-indigo-500 text-opacity-75 transition-all hover:text-opacity-100 text-sm"
              :to="`/qna/course/${question.courseID.name}`"
              >{{ question.courseID.name }}</NuxtLink
            >
          </div>
          <div class="title-col">
            <NuxtLink
              class="block text-indigo-500 text-opacity-75 transition-all hover:text-opacity-100"
              :to="`/qna/${type}/${category.name}/${question._id}`"
              >{{ question.title }}</NuxtLink
            >
          </div>
          <div class="created-col">
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

    <div class="flex justify-end my-8">
      <NuxtLink class="inline-block text-indigo-500 btn btn-primary" :to="`/qna/${type}/${category.name}/create`">작성하기</NuxtLink>
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
  @apply w-44 flex-shrink-0;
}
.title-col {
  @apply flex-grow single-line;
}
.created-col {
  @apply ml-5 flex-shrink-0;
}
</style>
