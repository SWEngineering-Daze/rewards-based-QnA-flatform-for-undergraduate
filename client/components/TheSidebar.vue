<script lang="ts" setup>
import { Popover, PopoverButton, PopoverPanel, Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue';

const isOpened = ref(false);

function close() {
  isOpened.value = false;
}

// function open() {
//   isOpened.value = true;
// }

// function toggle() {
//   isOpened.value = !isOpened.value;
// }

const data = [
  {
    name: '공과대학',
    childs: [
      {
        name: '컴퓨터공학과',
        childs: [
          {
            name: '소프트웨어공학개론',
            href: '/courses/1',
          },
          {
            name: '웹프로그래밍',
            href: '/courses/2',
          },
          {
            name: '시스템소프트웨어및실습',
            href: '/courses/3',
          },
          {
            name: '객체지향프로그래밍',
            href: '/courses/4',
          },
        ],
      },
      {
        name: '정보통신공학과',
        childs: [
          {
            name: '컴퓨터네트워크',
            href: '/courses/5',
          },
          {
            name: '데이터통신입문',
            href: '/courses/6',
          },
        ],
      },
    ],
  },
  {
    name: '예술대학',
    childs: [
      {
        name: '조소학과',
        childs: [
          {
            name: '조소학개론',
            href: '/courses/1',
          },
          {
            name: '조소와실습1',
            href: '/courses/2',
          },
          {
            name: '조소와실습2',
            href: '/courses/3',
          },
          {
            name: '조소와실습4',
            href: '/courses/4',
          },
        ],
      },
      {
        name: '서양화과',
        childs: [
          {
            name: '오우라후나트파1',
            href: '/courses/5',
          },
          {
            name: '오우라후나트파2',
            href: '/courses/6',
          },
        ],
      },
    ],
  },
];
</script>

<template>
  <div class="relative">
    <nav class="sidebar absolute left-0 top md:static p-6 z-10" :class="{ opened: isOpened }">
      <button class="absolute top-0 right-0 p-5 md:hidden" @click="close">
        <img class="w-6" src="@/assets/img/close.svg" />
      </button>

      <div v-for="college in data" :key="college.name" class="mb-4 last:mb-0">
        <ClientOnly>
          <Disclosure>
            <DisclosureButton class="inline-flex items-center text-xl font-bold mb-3">
              <img class="w-6" src="@/assets/img/dropdown.svg" />
              {{ college.name }}
            </DisclosureButton>
            <DisclosurePanel class="pl-12">
              <div v-for="department in college.childs" :key="department.name" class="relative mb-2 last:mb-0">
                <Popover class="inline-block relative">
                  <PopoverButton class="text-lg focus:outline-none pr-5">{{ department.name }}</PopoverButton>
                  <PopoverPanel
                    class="absolute top-0 right-0 translate-x-full bg-white rounded border shadow p-3 whitespace-nowrap max-w-xs max-h-60 overflow-y-scroll z-10"
                  >
                    <NuxtLink v-for="course in department.childs" :key="course.name" class="block mb-2 last:mb-0 text-sm" :to="course.href">
                      {{ course.name }}
                    </NuxtLink>
                  </PopoverPanel>
                </Popover>
              </div>
            </DisclosurePanel>
          </Disclosure>
        </ClientOnly>
      </div>
    </nav>
  </div>
</template>

<style lang="postcss" scoped>
.sidebar {
  @apply bg-gray-200 h-full transition-transform;
  min-width: 300px;
}

.sidebar:not(.opened) {
  transform: translateX(-100%);
}
@screen md {
  .sidebar:not(.opened) {
    transform: translateX(0);
  }
}
</style>
