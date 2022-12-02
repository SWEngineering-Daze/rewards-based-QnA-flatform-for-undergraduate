<script lang="ts" setup>
import { AxiosError } from 'axios';
import { useToast } from 'vue-toastification';
import { Coupon, ShopItem, ShopPartner } from '~~/composables/useApi';
import { useAuth } from '~~/stores/auth';

definePageMeta({
  middleware: ['auth'],
});

const api = useApi();
const toast = useToast();
const { loading, startLoading, finishLoading } = useLoading();

const selectedItem = ref<ShopItem>(null);
const selectedPartner = ref<ShopPartner>(null);
const coupon = ref<Coupon>(null);
const opened = ref(false);

const dummyMenus: ShopPartner[] = await api.items.index();

function open(item: ShopItem, partner?: ShopPartner) {
  selectedItem.value = item;
  selectedPartner.value = partner;
  coupon.value = null;
  opened.value = true;
}

function close() {
  opened.value = false;
}

async function exchange(id: string) {
  try {
    startLoading();

    coupon.value = await api.items.exchange(id);

    toast.success('상품을 교환했습니다!');
    await useAuth().fetch();
  } catch (e) {
    if (e instanceof AxiosError) {
      if (e.response.data.message === 'User point is less than price') {
        toast.error('포인트가 부족합니다!');
      } else {
        toast.error('알 수 없는 네트워크 에러가 발생했습니다!');
      }
    } else {
      toast.error('알 수 없는 에러가 발생했습니다!');

      console.error(e);
    }
  } finally {
    finishLoading();
  }
}

function format(n: number) {
  return Intl.NumberFormat('ko-KR').format(n);
}
</script>

<template>
  <div class="py-8 px-4 md:px-12">
    <h1 class="font-bold tracking-widest text-3xl mb-12">포인트 상점</h1>

    <div v-for="partner in dummyMenus" :key="partner.name" class="mb-12">
      <div class="flex items-center mb-8">
        <img class="w-12 h-12 mr-4" :src="partner.url" alt="제휴사" />
        <span class="text-2xl font-bold">{{ partner.name }}</span>
      </div>
      <div class="flex flex-wrap">
        <button v-for="item in partner.items" :key="item.name" class="mr-7 mb-5 group cursor-pointer transition-all" @click="open(item, partner)">
          <img class="w-44 h-44 object-contain block" :src="item.url" alt="상품" />
          <!-- <div class="w-36 h-36 bg-gray-200"></div> -->
          <div class="w-44 p-1 break-all">
            <div class="overflow-hidden whitespace-nowrap text-ellipsis text-black text-opacity-75 transition-all group-hover:text-opacity-100">
              {{ item.name }}
            </div>
            <div class="font-bold text-2xl text-black text-opacity-75 transition-all group-hover:text-opacity-100">{{ format(item.price) }}P</div>
          </div>
        </button>
      </div>
    </div>

    <ClientOnly>
      <BaseModal :opened="opened" @close="close">
        <div class="text-2xl font-bold mb-8">상품 구매</div>
        <div class="flex flex-col items-center mb-12">
          <img class="mb-2" :src="selectedItem.url" :alt="selectedItem.name" />
          <div class="text-gray-800 mb-2">{{ selectedPartner.name }}</div>
          <div class="text-3xl font-bold mb-6">{{ selectedItem.name }}</div>
          <div class="text-2xl font-bold">{{ format(selectedItem.price) }}P</div>
        </div>
        <template v-if="coupon">
          <hr class="mb-8" />
          <div class="text-center mb-8">
            <div class="text-lg mb-2">쿠폰번호</div>
            <div class="text-3xl font-bold text-indigo-500">{{ coupon.serialNumber }}</div>
          </div>
          <button class="bg-white py-2 border border-gray-500 text-gray-500 rounded-full block w-full" @click="close">확인</button>
        </template>
        <template v-else>
          <template v-if="loading">
            <div class="flex justify-center">
              <LoadingSpinner class="w-12" />
            </div>
          </template>
          <template v-else>
            <button class="bg-indigo-500 py-2 text-white rounded-full block w-full mb-2" @click="exchange(selectedItem._id)">교환</button>
            <button class="bg-white py-2 border border-gray-500 text-gray-500 rounded-full block w-full" @click="close">취소</button>
          </template>
        </template>
      </BaseModal>
    </ClientOnly>
  </div>
</template>
