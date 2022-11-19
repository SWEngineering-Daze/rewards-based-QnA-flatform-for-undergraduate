<script lang="ts" setup>
const props = defineProps<{
  modelValue: string;
}>();
const emit = defineEmits(['update:modelValue']);

const { $editor } = useNuxtApp();

const editor = ref<any>(null);
const el = ref<HTMLElement>(null);

onMounted(() => {
  nextTick(() => {
    editor.value = new $editor({
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
