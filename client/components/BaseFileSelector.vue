<script lang="ts" setup>
const emits = defineEmits(['attach']);

function onFileChange(event: Event) {
  const files = (event.target as HTMLInputElement).files;

  if (files.length > 0 && files[0]) {
    emits('attach', files[0]);
  }
}
</script>

<template>
  <div class="flex">
    <label>
      <div class="flex items-center">
        <div class="btn btn-primary-outline cursor-pointer">파일 첨부</div>
      </div>
      <input class="hidden" type="file" @change="onFileChange" />
    </label>
  </div>
</template>
