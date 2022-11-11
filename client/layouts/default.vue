<template>
  <div class="min-h-screen flex flex-col">
    <NuxtLoadingIndicator />
    <TheHeader />
    <div class="flex-1 flex">
      <TheSidebar />
      <div class="flex-1">
        <slot></slot>
      </div>
    </div>
    <TheFooter />
  </div>
</template>
