<!-- ErrorComponent.vue -->
<template>
  <div class="p-4 bg-red-50 border border-red-200 rounded-lg">
    <div class="flex items-center text-red-800">
      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span class="font-medium">组件加载失败</span>
    </div>
    <p class="mt-2 text-sm text-red-700">
      请刷新页面重试。如果问题持续存在，请联系支持团队。
    </p>
  </div>
</template>

<script setup lang="ts">
// No props or logic needed for this simple error component
</script> 