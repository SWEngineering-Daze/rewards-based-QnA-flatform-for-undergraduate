import { fakeAxiosCategory } from '@/fakeBackend';

export const useCategory = () => {
  const route = useRoute();

  const type = route.params.categoryType as 'department' | 'course';
  const id = Number.parseInt(route.params.categoryId as string);

  return {
    type,
    category: fakeAxiosCategory('/category', { type, id }),
  };
};
