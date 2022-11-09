<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    loading: boolean;
  }>(),
  {
    loading: false,
  }
);
</script>

<template>
  <button class="btn btn-primary" :disabled="props.loading">
    <template v-if="props.loading">
      <!-- spinner -->
      <div class="flex justify-center items-center">
        <LoadingSpinner class="w-5" />
      </div>
    </template>
    <template v-else>
      <slot></slot>
    </template>
  </button>
</template>
