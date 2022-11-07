<script lang="ts" setup>
import { Popover, PopoverButton, PopoverPanel, Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue';

const { $axios } = useNuxtApp();
const props = defineProps<{ opened: boolean }>();
defineEmits(['sidebarClose']);

interface CourseMenu {
  name: string;
  href: string;
}

interface DepartmentMenu {
  name: string;
  href: string;
  childs: CourseMenu[];
}

interface CollegeMenu {
  name: string;
  childs: DepartmentMenu[];
}

const { data: departments } = await $axios.get('/departments');
const { data: courses } = await $axios.get('/courses');

const menu: CollegeMenu[] = [];
for (const department of departments) {
  // college
  let college = menu.find(m => m.name === department.parent.name);
  if (!college) {
    menu.push({
      name: department.parent.name,
      childs: [],
    });
    college = menu.find(m => m.name === department.parent.name);
  }
  // department
  college.childs.push({
    name: department.name,
    href: `/qna/department/${department.id}`,
    childs: [],
  });
}
for (const course of courses) {
  const department = menu.find(m => m.childs.findIndex(d => d.name === course.parent.name) !== -1)?.childs.find(d => d.name === course.parent.name);
  department.childs.push({
    name: course.name,
    href: `/qna/course/${course.id}`,
  });
}
</script>

<template>
  <div class="relative">
    <nav class="sidebar absolute left-0 top md:static p-6 z-10 overflow-y-auto" :class="{ opened: props.opened }">
      <button class="absolute top-0 right-0 p-5 md:hidden" @click="$emit('sidebarClose')">
        <img class="w-6" src="@/assets/img/close.svg" />
      </button>

      <div v-for="college in menu" :key="college.name" class="mb-4 last:mb-0">
        <ClientOnly>
          <Disclosure v-slot="{ open }">
            <DisclosureButton
              class="inline-flex items-center text-xl text-black font-bold mb-3 transition-all"
              :class="{ 'text-opacity-75 hover:text-opacity-100': !open }"
            >
              <img class="w-6 transtiion-all" :class="{ 'rotate-180': open }" src="@/assets/img/dropdown.svg" />
              {{ college.name }}
            </DisclosureButton>
            <transition
              enter-active-class="transition duration-100 ease-out"
              enter-from-class="transform scale-95 opacity-0"
              enter-to-class="transform scale-100 opacity-100"
              leave-active-class="transition duration-75 ease-out"
              leave-from-class="transform scale-100 opacity-100"
              leave-to-class="transform scale-95 opacity-0"
            >
              <DisclosurePanel class="pl-12">
                <div v-for="department in college.childs" :key="department.name" class="relative mb-2 last:mb-0">
                  <Popover v-slot="{ open }" class="inline-block relative">
                    <PopoverButton class="text-black transition-all outline-none pr-5" :class="{ 'text-opacity-75 hover:text-opacity-100': !open }">
                      {{ department.name }}
                    </PopoverButton>
                    <transition
                      enter-active-class="transition duration-100 ease-out"
                      enter-from-class="transform scale-95 opacity-0"
                      enter-to-class="transform scale-100 opacity-100"
                      leave-active-class="transition duration-75 ease-in"
                      leave-from-class="transform scale-100 opacity-100"
                      leave-to-class="transform scale-95 opacity-0"
                    >
                      <PopoverPanel
                        class="absolute top-0 right-0 translate-x-full bg-white rounded border shadow p-3 whitespace-nowrap max-w-xs max-h-60 overflow-y-scroll z-10"
                      >
                        <NuxtLink
                          v-for="course in department.childs"
                          :key="course.name"
                          class="block mb-2 last:mb-0 text-sm text-black transition-all text-opacity-75 hover:text-opacity-100"
                          :to="course.href"
                        >
                          {{ course.name }}
                        </NuxtLink>
                      </PopoverPanel>
                    </transition>
                  </Popover>
                </div>
              </DisclosurePanel>
            </transition>
          </Disclosure>
        </ClientOnly>
      </div>
    </nav>
  </div>
</template>

<style lang="postcss" scoped>
.sidebar {
  @apply bg-gray-100 h-full transition-transform;
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
