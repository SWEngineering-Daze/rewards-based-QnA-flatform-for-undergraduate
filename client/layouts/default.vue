<script lang="ts" setup>
const sidebarOpened = ref(false);
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <TheHeader @sidebar-toggle="sidebarOpened = !sidebarOpened" />
    <div class="flex-1 flex">
      <TheSidebar :opened="sidebarOpened" @sidebar-close="sidebarOpened = false" />
      <div class="flex-1">
        <slot></slot>
      </div>
    </div>
    <TheFooter />
  </div>
</template>
