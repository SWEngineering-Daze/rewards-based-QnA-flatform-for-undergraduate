<script lang="ts" setup>
import { Popover, PopoverButton, PopoverPanel, Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue';
import { useToast } from 'vue-toastification';
import { useSidebar } from '@/stores/sidebar';

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

const sidebar = useSidebar();
const toast = useToast();

const { data: menu } = await useAsyncData('sidebar', async () => {
  const api = useApi();

  const departments = await api.category.departments();
  const courses = await api.category.courses();

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
      href: `/qna/department/${department.name}`,
      childs: [],
    });
  }
  for (const course of courses) {
    const department = menu.find(m => m.childs.findIndex(d => d.name === course.parent.name) !== -1)?.childs.find(d => d.name === course.parent.name);
    department.childs.push({
      name: course.name,
      href: `/qna/course/${encodeURIComponent(course.name)}`,
    });
  }

  return menu;
});

const courseQuery = ref('');
const courseSearchResult = ref<CourseMenu[]>([]);

function searchCourse() {
  if (courseQuery.value.length < 2) {
    toast.error('두 글자 이상 입력해주세요!');
    return;
  }

  const courses = computed(() =>
    menu.value
      .map(c => c.childs)
      .reduce((prevDArr, curDArr) => prevDArr.concat(...curDArr), [])
      .map(d => d.childs)
      .reduce((prevCArr, curCArr) => prevCArr.concat(curCArr), [])
  );

  courseSearchResult.value = courses.value.filter(c => c.name.includes(courseQuery.value));
}

function flushSearchCourse() {
  courseSearchResult.value = [];
}
</script>

<template>
  <div class="relative">
    <nav class="sidebar absolute left-0 top md:static p-6 z-10" :class="{ opened: sidebar.opened }">
      <button class="absolute top-0 right-0 p-5 md:hidden" @click="sidebar.close()">
        <img class="w-6" src="@/assets/img/close.svg" />
      </button>

      <div class="mb-5 relative">
        <input v-model="courseQuery" type="text" placeholder="과목 검색" @keyup.enter="searchCourse()" />
        <template v-if="courseSearchResult.length > 0">
          <div
            class="absolute top-full left-0 bg-white rounded border shadow p-3 whitespace-nowrap max-w-xs overflow-y-scroll z-10"
            @focusout="flushSearchCourse()"
          >
            <NuxtLink
              v-for="course in courseSearchResult"
              :key="course.name"
              class="block mb-2 last:mb-0 text-sm text-black transition-all text-opacity-75 hover:text-opacity-100"
              :to="course.href"
              @click="
                sidebar.close();
                flushSearchCourse();
              "
              >{{ course.name }}</NuxtLink
            >
          </div>
        </template>
      </div>

      <div v-for="college in menu" :key="college.name" class="mb-4 last:mb-0">
        <ClientOnly>
          <Disclosure v-slot="{ open, close }">
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
                  <Popover v-slot="{ open: dropdownOpened, close: closeDropdown }" class="inline-block relative">
                    <PopoverButton class="text-black transition-all outline-none pr-5" :class="{ 'text-opacity-75 hover:text-opacity-100': !dropdownOpened }">
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
                        class="absolute top-0 left-full bg-white rounded border shadow p-3 whitespace-nowrap max-w-xs overflow-y-scroll z-10"
                        style="max-height: 27rem"
                      >
                        <NuxtLink
                          class="block mb-2 last:mb-0 text-sm text-black transition-all text-opacity-75 hover:text-opacity-100 font-bold"
                          :to="department.href"
                          @click="
                            close();
                            closeDropdown();
                            sidebar.close();
                          "
                        >
                          전체보기
                        </NuxtLink>
                        <NuxtLink
                          v-for="course in department.childs"
                          :key="course.name"
                          class="block mb-2 last:mb-0 text-sm text-black transition-all text-opacity-75 hover:text-opacity-100"
                          :to="course.href"
                          @click="
                            close();
                            closeDropdown();
                            sidebar.close();
                          "
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
