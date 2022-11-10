import { useToast } from 'vue-toastification';
import type { Department, Course } from '@/composables/useApi';

let departments: Department[] = null;
let courses: Course[] = null;

function getCategory(data: { type: string; name: string }) {
  if (data.type === 'department') {
    return departments.find(d => d.name === data.name);
  } else {
    return courses.find(c => c.name === data.name);
  }
}

export const useCategory = async () => {
  const api = useApi();
  const toast = useToast();
  const route = useRoute();
  const router = useRouter();

  if (!departments) {
    const fetchedDepartments = await api.category.departments();
    departments = fetchedDepartments;
  }
  if (!courses) {
    const fetchedCourses = await api.category.courses();
    courses = fetchedCourses;
  }

  const type = route.params.categoryType as 'department' | 'course';
  const name = route.params.categoryId as string;

  const category = getCategory({ type, name });

  if (category) {
    return {
      type,
      departments,
      courses,
      category,
    };
  } else {
    toast.error(`${type} ${name}은\n유효하지 않은 URL입니다!`);
    router.replace('/');
  }
};
