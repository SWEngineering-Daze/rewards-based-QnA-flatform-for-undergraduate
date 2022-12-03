<script lang="ts" setup>
import { useToast } from 'vue-toastification';
import { AxiosError } from 'axios';
import { QuestionPaginator, AnswerPaginator, Coupon } from '@/composables/useApi';
import { useAuth } from '@/stores/auth';

definePageMeta({
  middleware: ['auth'],
});

const api = useApi();
const auth = useAuth();
const toast = useToast();
const { level, maxExp, curExp, expPercent, point } = usePointStatus();

const myQuestionPaginator = ref<QuestionPaginator>();
const myAnswerPaginator = ref<AnswerPaginator>();
try {
  myQuestionPaginator.value = await api.questions.me(1, 5);
  myAnswerPaginator.value = await api.answers.me(1, 5);
} catch (e) {
  if (e instanceof AxiosError) {
    toast.error('알 수 없는 네트워크 에러가 발생했습니다!');
  } else {
    toast.error('알 수 없는 에러가 발생했습니다!');

    console.error(e);
  }
}

const selectedCoupon = ref<Coupon>(null);
const opened = ref(false);

async function fetchHistory() {
  try {
    const histories = await api.histories.index();

    return histories;
  } catch (e) {
    if (e instanceof AxiosError) {
      toast.error('알 수 없는 네트워크 에러가 발생했습니다!');
    } else {
      toast.error('알 수 없는 에러가 발생했습니다!');

      console.error(e);
    }
  }
}

async function fetchCoupons() {
  try {
    const coupons = await api.coupons.index();

    return coupons;
  } catch (e) {
    if (e instanceof AxiosError) {
      toast.error('알 수 없는 네트워크 에러가 발생했습니다!');
    } else {
      toast.error('알 수 없는 에러가 발생했습니다!');

      console.error(e);
    }
  }
}

const histories = await fetchHistory();
const coupons = await fetchCoupons();

async function open(coupon: Coupon) {
  selectedCoupon.value = await api.coupons.show(coupon._id);

  opened.value = true;
}

function close() {
  opened.value = false;
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
      <img class="rounded-full w-64 h-64 mr-10" src="@/assets/img/dgu_logo.jpg" alt="동국대" />
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
        <template v-if="myQuestionPaginator.questionList.length > 0">
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
        </template>
        <template v-else>
          <EmptyMessage>
            아직 아무 질문이 없습니다! <br />
            첫 번째 질문을 해보세요!
          </EmptyMessage>
        </template>
      </div>
    </div>

    <div class="mb-16">
      <div class="text-2xl font-bold mb-3">내 답변</div>
      <div class="rounded bg-50 border border-gray-200 py-4 px-6">
        <template v-if="myAnswerPaginator.answerList.length > 0">
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
        </template>
        <template v-else>
          <EmptyMessage>
            아직 아무 답변이 없습니다! <br />
            첫 번째 답변을 해보세요!
          </EmptyMessage>
        </template>
      </div>
    </div>

    <div class="mb-16">
      <div class="text-2xl font-bold mb-3">포인트 이력</div>
      <div class="rounded bg-50 border border-gray-200 py-4 px-6">
        <template v-if="histories.length > 0">
          <div v-for="history in histories" :key="history._id" class="flex items-center tracking-wider">
            <span class="font-bold">{{ $dayjs(history.createdAt).format('MM-DD') }}</span>
            <span class="mx-3"></span>
            <span>{{ history.content }}</span>
            <span class="mx-3"></span>
            <span class="font-bold ml-auto" :class="{ 'text-red-500': history.amount < 0, 'text-blue-500': history.amount > 0 }"
              >{{ format(history.amount) }}P</span
            >
          </div>
        </template>
        <template v-else>
          <EmptyMessage>
            아직 포인트 이력이 없습니다! <br />
            답변을 하고 추천을 받아 포인트를 받으세요!
          </EmptyMessage>
        </template>
      </div>
    </div>

    <div class="mb-16">
      <div class="text-2xl font-bold mb-3">쿠폰 목록</div>
      <div class="rounded bg-50 border border-gray-200 py-4 px-6">
        <template v-if="coupons.length > 0">
          <div v-for="coupon in coupons" :key="coupon._id" class="flex items-center tracking-wider">
            <span class="font-bold">{{ $dayjs(coupon.createdAt).format('MM-DD') }}</span>
            <span class="mx-3"></span>
            <span>{{ coupon.partnerName }} - {{ coupon.item.name }}</span>
            <span class="mx-3"></span>
            <button class="font-bold text-blue-500 ml-auto" @click="open(coupon)">{{ coupon.serialNumber }}</button>
          </div>
        </template>
        <template v-else>
          <EmptyMessage>
            아직 아무 쿠폰이 없습니다! <br />
            포인트를 얻어 상품을 구매해보세요!
          </EmptyMessage>
        </template>
      </div>
    </div>

    <ClientOnly>
      <BaseModal :opened="opened" @close="close">
        <div class="text-2xl font-bold mb-8">상품 쿠폰</div>
        <div class="flex flex-col items-center mb-12">
          <img class="mb-2" :src="selectedCoupon.item.url" :alt="selectedCoupon.item.name" />
          <div class="text-gray-800 mb-2">{{ selectedCoupon.partnerName }}</div>
          <div class="text-3xl font-bold mb-6">{{ selectedCoupon.item.name }}</div>
          <div class="text-2xl font-bold">{{ format(selectedCoupon.item.price) }}P</div>
        </div>
        <hr class="mb-8" />
        <div class="text-center mb-8">
          <div class="text-lg mb-2">쿠폰번호</div>
          <div class="text-3xl font-bold text-indigo-500">{{ selectedCoupon.serialNumber }}</div>
        </div>
        <button class="bg-white py-2 border border-gray-500 text-gray-500 rounded-full block w-full" @click="close">닫기</button>
      </BaseModal>
    </ClientOnly>
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
