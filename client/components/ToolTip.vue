<script lang="ts" setup>
const opened = ref(false);

function open() {
  opened.value = true;
}

function close() {
  opened.value = false;
}
</script>

<template>
  <div class="tooltip" @mouseenter="open" @mouseleave="close">
    <IconQuestion class="w-6 h-6" />
    <div v-show="opened" class="tooltip-box">
      <IconInfo class="w-6 h-6 mr-4"></IconInfo>
      <div class="tracking-wide text-left">
        <slot>도움말</slot>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.tooltip {
  @apply inline-block relative;
}

.tooltip-box {
  @apply absolute bottom-full left-full;
  @apply rounded border border-gray-300 py-3 px-4;
  @apply flex items-center whitespace-nowrap text-gray-500 text-sm;
}
</style>
