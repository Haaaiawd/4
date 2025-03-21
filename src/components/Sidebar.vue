<template>
  <aside class="w-64 hidden lg:flex h-[calc(100vh-4rem)] flex-col border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div class="flex flex-1 flex-col space-y-4 p-4">
      <!-- 快捷操作区 -->
      <div class="space-y-2">
        <button class="flex w-full items-center justify-start space-x-2 rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90">
          <i class="ri-add-line"></i>
          <span>新对话</span>
        </button>
      </div>

      <!-- 导航菜单 -->
      <nav class="flex-1 space-y-2">
        <router-link
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          class="flex items-center space-x-2 rounded-lg px-4 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
          :class="{ 'bg-muted text-foreground': isActive(item.path) }"
        >
          <i :class="item.icon"></i>
          <span>{{ item.name }}</span>
        </router-link>
      </nav>

      <!-- 底部区域 -->
      <div class="space-y-2">
        <!-- 主题切换 -->
        <button class="flex w-full items-center justify-between rounded-lg px-4 py-2 text-muted-foreground hover:bg-muted hover:text-foreground">
          <div class="flex items-center space-x-2">
            <i class="ri-sun-line dark:ri-moon-line"></i>
            <span>主题模式</span>
          </div>
          <span class="text-xs">自动</span>
        </button>

        <!-- 帮助中心 -->
        <a href="#" class="flex w-full items-center space-x-2 rounded-lg px-4 py-2 text-muted-foreground hover:bg-muted hover:text-foreground">
          <i class="ri-question-line"></i>
          <span>帮助中心</span>
        </a>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()

const menuItems = [
  { name: '对话', path: '/chat', icon: 'ri-message-3-line' },
  { name: '成长记录', path: '/growth', icon: 'ri-line-chart-line' },
  { name: '洞察', path: '/insights', icon: 'ri-lightbulb-line' },
  { name: '目标', path: '/goals', icon: 'ri-flag-line' },
  { name: '设置', path: '/settings', icon: 'ri-settings-3-line' }
]

const isActive = (path: string) => route.path === path
</script> 