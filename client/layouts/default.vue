<template>
  <div class="min-h-screen flex flex-col">
    <TheHeader />
    <div class="flex-1 flex">
      <nav class="sidebar hidden lg:block"></nav>
      <div class="flex-1">
        <slot></slot>
      </div>
    </div>
    <TheFooter />
  </div>
</template>

<style lang="postcss" scoped>
.sidebar {
  @apply bg-gray-200;
  min-width: 300px;
}
</style>
