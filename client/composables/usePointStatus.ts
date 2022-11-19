import { useAuth } from '@/stores/auth';

function calcAccExp(level: number) {
  return 5 * level * (level - 1);
}

export const usePointStatus = () => {
  const auth = useAuth();

  const level = computed(() => auth.user.level);

  const nextMinAccExp = computed(() => calcAccExp(level.value + 1));
  const curMinAccExp = computed(() => calcAccExp(level.value));

  const maxExp = computed(() => nextMinAccExp.value - curMinAccExp.value);
  const curExp = computed(() => auth.user.accumulatedExp - curMinAccExp.value);

  const expPercent = computed(() => (curExp.value / maxExp.value) * 100);

  const point = computed(() => auth.user.point);

  return { level, maxExp, curExp, expPercent, point };
};
