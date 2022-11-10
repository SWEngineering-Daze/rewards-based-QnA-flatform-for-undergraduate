<script lang="ts" setup>
definePageMeta({
  middleware: ['auth'],
});

const route = useRoute();

const api = useApi();
const qna = await api.questions.show(route.params.questionId as string);
const question = qna.question;
question.answers = qna.answers;

function like() {
  alert('미구현');
}
</script>

<template>
  <div class="py-8 px-4 md:px-12">
    <section class="rounded border py-5 px-5 md:px-10 max-w-4xl mx-auto break-all">
      <article>
        <div class="text-center">
          <div class="mb-6 text-center">
            <div class="text-sm text-indigo-500 mb-1">{{ question.course.parent.name }}</div>
            <div class="text-xl">{{ question.course.name }}</div>
          </div>
          <h1 class="text-3xl mb-3">{{ question.title }}</h1>
        </div>
        <hr class="my-6" />
        <div class="whitespace-pre-line">{{ question.content }}</div>
      </article>
      <div class="flex justify-center my-12">
        <NuxtLink class="btn btn-primary block w-full" :to="`/qna/course/${question.course.name}/${question._id}/answers/create`">답변 작성</NuxtLink>
      </div>
      <div v-for="answer in question.answers" :key="answer._id">
        <hr class="my-6" />
        <article>
          <div class="flex items-center mb-6">
            <div class="inline-flex items-center text-slate-500">
              <img class="w-8" src="@/assets/img/heart.svg" alt="좋아요" />
              <span class="ml-1">0</span>
            </div>
            <span class="rounded-full bg-slate-500 text-white text-sm py-2 px-6 ml-8">답변</span>
          </div>
          <div>
            {{ answer.content }}
          </div>
          <div class="flex justify-center mt-12">
            <button class="rounded-full border-2 border-indigo-500 bg-white text-indigo-500 font-medium py-2 px-12" @click="like()">좋아요!</button>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>
