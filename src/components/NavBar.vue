<!-- NavBar.vue -->
<template>
  <header class="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
    <div class="container mx-auto px-4 py-3">
      <div class="flex items-center justify-between">
        <!-- Logo -->
        <div class="flex items-center">
          <div class="mr-6 flex items-center font-bold">
            <div class="flex items-center gap-2">
              <div class="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
                <span class="text-primary-foreground font-bold">LC</span>
              </div>
              <span class="font-bold">Life Coach</span>
            </div>
          </div>

          <!-- Desktop Navigation -->
          <nav class="hidden md:flex">
            <ul class="flex space-x-6">
              <li v-for="item in menuItems" :key="item.name">
                <router-link 
                  :to="item.url" 
                  class="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  {{ item.name }}
                </router-link>
              </li>
            </ul>
          </nav>
        </div>

        <!-- Right side actions -->
        <div class="flex items-center space-x-4">
          <!-- Notifications -->
          <button class="hidden md:flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground">
            <i class="ri-notification-line h-5 w-5"></i>
          </button>
          
          <!-- User profile -->
          <div class="relative flex items-center">
            <button 
              class="flex items-center space-x-2 rounded-full hover:bg-muted px-2 py-1"
              @click="toggleUserMenu"
            >
              <div class="h-8 w-8 overflow-hidden rounded-full bg-muted">
                <img 
                  v-if="userAvatar" 
                  :src="userAvatar" 
                  :alt="userName" 
                  class="h-full w-full object-cover"
                />
                <div v-else class="flex h-full w-full items-center justify-center bg-primary/10 text-primary">
                  <i class="ri-user-line h-4 w-4"></i>
                </div>
              </div>
              <span class="hidden md:inline-block text-sm font-medium">
                {{ userName }}
              </span>
              <i class="hidden md:inline-block ri-arrow-down-s-line h-4 w-4 text-muted-foreground"></i>
            </button>

            <!-- User menu dropdown -->
            <div 
              v-if="isUserMenuOpen"
              class="absolute right-0 top-full mt-2 w-48 rounded-md bg-background shadow-lg ring-1 ring-black ring-opacity-5"
            >
              <div class="py-1">
                <router-link 
                  v-for="item in userMenuItems" 
                  :key="item.name"
                  :to="item.url"
                  class="block px-4 py-2 text-sm text-foreground hover:bg-muted"
                >
                  {{ item.name }}
                </router-link>
              </div>
            </div>
          </div>

          <!-- Mobile menu button -->
          <button 
            class="md:hidden flex h-9 w-9 items-center justify-center rounded-md hover:bg-muted"
            @click="toggleMobileMenu"
          >
            <i class="ri-menu-line h-5 w-5"></i>
          </button>
        </div>
      </div>

      <!-- Mobile Navigation -->
      <div v-if="isMobileMenuOpen" class="md:hidden py-4 border-t border-border mt-3">
        <ul class="flex flex-col space-y-4">
          <li v-for="item in menuItems" :key="item.name">
            <router-link 
              :to="item.url" 
              class="block text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              {{ item.name }}
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// Props
interface Props {
  userName: string
  userAvatar: string
}

const props = defineProps<Props>()
const { userName = '用户', userAvatar = '' } = props

// Menu items
const menuItems = [
  { name: '对话', url: '/chat' },
  { name: '成长记录', url: '/growth' },
  { name: '洞察', url: '/insights' }
]

const userMenuItems = [
  { name: '个人资料', url: '/profile' },
  { name: '设置', url: '/settings' },
  { name: '退出', url: '/logout' }
]

// Mobile menu state
const isMobileMenuOpen = ref(false)
const isUserMenuOpen = ref(false)

// Toggle functions
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
  isUserMenuOpen.value = false
}

const toggleUserMenu = () => {
  isUserMenuOpen.value = !isUserMenuOpen.value
  isMobileMenuOpen.value = false
}

// Close menus when clicking outside
const closeMenus = () => {
  isMobileMenuOpen.value = false
  isUserMenuOpen.value = false
}

// Add click outside listener
onMounted(() => {
  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement
    if (!target.closest('.navbar')) {
      closeMenus()
    }
  })
})

onUnmounted(() => {
  document.removeEventListener('click', closeMenus)
})
</script> 