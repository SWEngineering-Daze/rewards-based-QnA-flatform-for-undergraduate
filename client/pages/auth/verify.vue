<script lang="ts" setup>
const { $axios } = useNuxtApp();
const route = useRoute();
const router = useRouter();

const token = route.query.token as string;

async function requestVerify() {
  try {
    const { data } = await $axios.post('/auth/verifyUser', {
      signupToken: token,
    });

    alert('성공!' + data);
    console.log(data);
    router.replace('/auth/login');
  } catch (e) {
    alert('오류!' + e.response);
    console.log(e, e.response);
    router.replace('/');
  }
}

onMounted(() => {
  requestVerify();
});
</script>

<template>
  <div>
    {{ token }}
  </div>
</template>
