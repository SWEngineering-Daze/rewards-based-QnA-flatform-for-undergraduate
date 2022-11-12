<script lang="ts" setup>
import Viewer from '@toast-ui/editor/dist/toastui-editor-viewer';
import '@toast-ui/editor/dist/toastui-editor-viewer.css';

const props = defineProps<{
  content: string;
}>();

const editor = ref<Viewer>(null);
const el = ref<HTMLElement>(null);

onMounted(() => {
  nextTick(() => {
    editor.value = new Viewer({
      el: el.value,
      initialValue: props.content,
    });
  });
});
</script>

<template>
  <div ref="el"></div>
</template>
