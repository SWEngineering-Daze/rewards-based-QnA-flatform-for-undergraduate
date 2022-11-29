<script lang="ts" setup>
interface ShopItem {
  name: string;
  url: string;
  price: number;
}

interface Partner {
  name: string;
  url: string;
  items: ShopItem[];
}

definePageMeta({
  middleware: ['auth'],
});

const dummyMenus: Partner[] = [
  {
    name: '스타벅스',
    url: '/img/starbucks.svg',
    items: [
      {
        name: '아이스아메리카노 T',
        url: '/img/ice.jpg',
        price: 4500,
      },
      {
        name: '아이스아메리카노 T',
        url: '/img/ice.jpg',
        price: 4500,
      },
      {
        name: '아이스아메리카노 T',
        url: '/img/ice.jpg',
        price: 4500,
      },
      {
        name: '아이스아메리카노 T',
        url: '/img/ice.jpg',
        price: 4500,
      },
    ],
  },
  {
    name: '버거킹',
    url: '/img/burgerking.svg',
    items: [
      {
        name: '기네스콰트로치즈와퍼세트',
        url: '/img/set.png',
        price: 9800,
      },
      {
        name: '기네스콰트로치즈와퍼세트',
        url: '/img/set.png',
        price: 9800,
      },
      {
        name: '기네스콰트로치즈와퍼세트',
        url: '/img/set.png',
        price: 9800,
      },
      {
        name: '기네스콰트로치즈와퍼세트',
        url: '/img/set.png',
        price: 9800,
      },
    ],
  },
];

function format(n: number) {
  return Intl.NumberFormat('ko-KR').format(n);
}
</script>

<template>
  <div class="py-8 px-4 md:px-12">
    <h1 class="font-bold tracking-widest text-3xl mb-12">포인트 상점</h1>

    <div v-for="partner in dummyMenus" :key="partner.name" class="mb-12">
      <div class="flex items-center mb-8">
        <img class="w-12 h-12 mr-4" :src="partner.url" />
        <span class="text-2xl font-bold">{{ partner.name }}</span>
      </div>
      <div class="flex flex-wrap">
        <div v-for="item in partner.items" :key="item.name" class="mr-7 mb-5 group cursor-pointer transition-all">
          <img class="w-44 h-44 object-contain block" :src="item.url" />
          <!-- <div class="w-36 h-36 bg-gray-200"></div> -->
          <div class="w-44 p-1 break-all">
            <div class="overflow-hidden whitespace-nowrap text-ellipsis text-black text-opacity-75 transition-all group-hover:text-opacity-100">
              {{ item.name }}
            </div>
            <div class="font-bold text-2xl text-black text-opacity-75 transition-all group-hover:text-opacity-100">{{ format(item.price) }}P</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
