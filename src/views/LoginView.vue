<template>
  <div class="min-h-screen flex items-center justify-center bg-background">
    <div class="w-full max-w-md">
      <!-- Logo -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center gap-2">
          <div class="h-12 w-12 rounded-xl bg-primary flex items-center justify-center">
            <span class="text-2xl font-bold text-primary-foreground">LC</span>
          </div>
          <span class="text-2xl font-bold">Life Coach</span>
        </div>
        <h2 class="mt-4 text-2xl font-semibold tracking-tight">欢迎回来</h2>
        <p class="text-sm text-muted-foreground">请登录您的账号继续使用</p>
      </div>

      <!-- 登录表单 -->
      <div class="bg-card p-6 rounded-lg shadow-sm border">
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div class="space-y-2">
            <label class="text-sm font-medium" for="email">邮箱</label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              class="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              :class="{ 'border-red-500': errors.email }"
            />
            <p v-if="errors.email" class="text-xs text-red-500">{{ errors.email }}</p>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium" for="password">密码</label>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              class="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              :class="{ 'border-red-500': errors.password }"
            />
            <p v-if="errors.password" class="text-xs text-red-500">{{ errors.password }}</p>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember"
                v-model="rememberMe"
                type="checkbox"
                class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label for="remember" class="ml-2 block text-sm text-muted-foreground">
                记住我
              </label>
            </div>
            <a href="#" class="text-sm text-primary hover:underline">
              忘记密码？
            </a>
          </div>

          <button
            type="submit"
            class="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            :disabled="isLoading"
          >
            {{ isLoading ? '登录中...' : '登录' }}
          </button>

          <p v-if="error" class="text-sm text-red-500 text-center">{{ error }}</p>
        </form>

        <div class="mt-6 text-center text-sm">
          <p class="text-muted-foreground">
            还没有账号？
            <router-link to="/register" class="text-primary hover:underline">
              立即注册
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '@/services/auth'

const router = useRouter()

// 表单数据
const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const isLoading = ref(false)
const error = ref('')
const errors = ref({
  email: '',
  password: ''
})

// 表单验证
function validateForm() {
  errors.value = {
    email: '',
    password: ''
  }

  if (!email.value) {
    errors.value.email = '请输入邮箱'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    errors.value.email = '请输入有效的邮箱地址'
  }

  if (!password.value) {
    errors.value.password = '请输入密码'
  } else if (password.value.length < 6) {
    errors.value.password = '密码长度不能小于6位'
  }

  return !errors.value.email && !errors.value.password
}

// 处理表单提交
async function handleSubmit() {
  if (!validateForm()) return

  try {
    isLoading.value = true
    error.value = ''

    await login(email.value, password.value)
    
    if (rememberMe.value) {
      localStorage.setItem('remembered_email', email.value)
    } else {
      localStorage.removeItem('remembered_email')
    }

    router.push('/')
  } catch (e: any) {
    error.value = e.message || '登录失败，请稍后重试'
  } finally {
    isLoading.value = false
  }
}

// 恢复记住的邮箱
onMounted(() => {
  const rememberedEmail = localStorage.getItem('remembered_email')
  if (rememberedEmail) {
    email.value = rememberedEmail
    rememberMe.value = true
  }
})
</script> 