<script lang="ts" setup>
const props = defineProps<{
  content: string;
}>();

const { $editor } = useNuxtApp();

const editor = ref<any>(null);
const el = ref<HTMLElement>(null);

onMounted(() => {
  nextTick(() => {
    editor.value = $editor.factory({
      el: el.value,
      initialValue: props.content,
      viewer: true,
    });
  });
});
</script>

<template>
  <div ref="el"></div>
</template>
