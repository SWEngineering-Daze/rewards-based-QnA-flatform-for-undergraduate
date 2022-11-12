<script lang="ts" setup>
import Editor from '@toast-ui/editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import '@toast-ui/editor/dist/i18n/ko-kr';

const props = defineProps<{
  modelValue: string;
}>();
const emit = defineEmits(['update:modelValue']);

const editor = ref<Editor>(null);
const el = ref<HTMLElement>(null);

onMounted(() => {
  nextTick(() => {
    editor.value = new Editor({
      el: el.value,
      height: '500px',
      initialValue: props.modelValue,
      initialEditType: 'wysiwyg',
      usageStatistics: false,
      language: 'ko',
      toolbarItems: [
        ['heading', 'bold', 'italic', 'strike'],
        ['hr', 'quote'],
        ['ul', 'ol', 'task', 'indent', 'outdent'],
        ['table', 'image', 'link'],
        ['code', 'codeblock'],
        ['scrollSync'],
      ],
    });

    editor.value.addHook('change', () => {
      emit('update:modelValue', editor.value.getMarkdown());
    });
  });
});
</script>

<template>
  <div ref="el"></div>
</template>
