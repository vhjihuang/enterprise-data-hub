<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-50">
    <div class="text-center">
      <h1 class="text-6xl font-bold text-gray-900 mb-4">404</h1>
      <h2 class="text-2xl font-semibold text-gray-700 mb-4">页面未找到</h2>
      <p class="text-gray-500 mb-8">抱歉，您访问的页面不存在。</p>
      <router-link
        to="/"
        class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        返回首页
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
// 404 页面组件
</script>

<style scoped>
/* 404 页面样式 */
</style>