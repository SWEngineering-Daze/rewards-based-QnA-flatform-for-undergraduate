<script lang="ts" setup>
import { Menu, MenuButton, MenuItems } from '@headlessui/vue';
import { useAuth } from '@/stores/auth';
import { useSidebar } from '@/stores/sidebar';

const sidebar = useSidebar();
const auth = useAuth();
const { expPercent, level, point } = usePointStatus();

function logout() {
  auth.logout();
  location.reload();
}

function format(n: number) {
  return Intl.NumberFormat('ko-KR').format(n);
}
</script>

<template>
  <header class="flex items-center shadow bg-white py-2 px-4 z-20">
    <button class="inline-block md:hidden mr-2" @click="sidebar.open()">
      <img class="w-8" src="@/assets/img/menu.svg" alt="메뉴" />
    </button>
    <NuxtLink to="/" class="inline-flex items-center">
      <img class="w-8" src="@/assets/img/graduation.svg" alt="쉿! 교수님 몰래 들어오세요" />
      <span class="text-sm font-medium ml-2">
        <span class="hidden sm:inline">쉿! 교수님 몰래 들어오세요</span>
        <span class="sm:hidden">쉿!</span>
      </span>
    </NuxtLink>
    <div class="flex items-center ml-auto">
      <nav class="flex items-center">
        <NuxtLink class="header-link" to="/store">
          <span class="hidden sm:inline-block">포인트 상점</span>
          <img class="inline-block sm:hidden w-6" src="@/assets/img/store.svg" alt="포인트 상점" />
        </NuxtLink>
      </nav>
      <span class="divider"></span>

      <!-- dropdown -->
      <template v-if="auth.loggedIn">
        <ClientOnly>
          <Menu as="div" class="relative">
            <MenuButton class="inline-flex items-center">
              <span class="hidden sm:inline text-sm font-medium">{{ auth.user.email }}</span>
              <img class="inline sm:hidden w-6" src="@/assets/img/user.svg" alt="사용자" />
              <img class="w-6" src="@/assets/img/dropdown.svg" alt="더보기" />
            </MenuButton>
            <transition
              enter-active-class="transition duration-100 ease-out"
              enter-from-class="transform scale-95 opacity-0"
              enter-to-class="transform scale-100 opacity-100"
              leave-active-class="transition duration-75 ease-in"
              leave-from-class="transform scale-100 opacity-100"
              leave-to-class="transform scale-95 opacity-0"
            >
              <MenuItems
                class="absolute right-0 mt-2 w-36 origin-top-right divide-y tracking-wider text-sm divide-gray-200 rounded-md bg-white shadow ring-1 ring-black ring-opacity-10 focus:outline-none"
              >
                <div class="p-3">
                  <div class="flex item-center mb-2">
                    <span>Lv.{{ level }}</span>
                    <span class="ml-auto">{{ Math.floor(expPercent) }}%</span>
                  </div>
                  <div class="flex items-center text-cyan-500">
                    <img class="w-6" src="@/assets/img/point.svg" alt="잔여 포인트" />
                    <span class="ml-auto">{{ format(point) }}P</span>
                  </div>
                  <NuxtLink class="btn btn-indigo block mt-3" to="/profile">내정보</NuxtLink>
                </div>
                <div class="p-3">
                  <button class="text-red-500" @click="logout()">로그아웃</button>
                </div>
              </MenuItems>
            </transition>
          </Menu>
        </ClientOnly>

        <NuxtLink class="btn btn-indigo ml-6 hidden sm:inline-block" to="/profile">내정보</NuxtLink>
      </template>
      <template v-else>
        <NuxtLink class="btn btn-link hidden sm:inline-block" to="/auth/register">회원가입</NuxtLink>
        <NuxtLink class="btn btn-indigo" to="/auth/login">로그인</NuxtLink>
      </template>
    </div>
  </header>
</template>

<style lang="postcss" scoped>
header {
  min-height: 52px;
}

.header-link {
  @apply inline-flex items-center text-sm font-medium text-gray-500;
}
.divider {
  @apply bg-gray-200 mx-5 sm:mx-9;
  width: 1px;
  height: 28px;
}

.btn {
  @apply rounded-full py-2 px-8 text-sm;
}

.btn-indigo {
  @apply bg-indigo-500 text-white;
}
</style>
