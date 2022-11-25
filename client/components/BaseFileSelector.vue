<script lang="ts" setup>
const emits = defineEmits(['attach']);

function onFileChange(event: Event) {
  const files = (event.target as HTMLInputElement).files;

  if (files.length > 0) {
    for (let i = 0; i < files.length; i++) {
      emits('attach', files[i]);
    }
  }

  (event.target as HTMLInputElement).value = '';
}
</script>

<template>
  <div class="flex">
    <label>
      <div class="flex items-center">
        <div class="btn btn-primary-outline cursor-pointer">
          <slot>파일 첨부</slot>
        </div>
      </div>
      <input class="hidden" type="file" multiple @change="onFileChange" />
    </label>
  </div>
</template>
