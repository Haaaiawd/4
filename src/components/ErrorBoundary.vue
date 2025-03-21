<template>
  <div>
    <div v-if="error" class="min-h-screen flex items-center justify-center bg-background">
      <div class="text-center">
        <h2 class="text-2xl font-bold mb-4 text-red-500">出错了</h2>
        <p class="text-muted-foreground mb-4">{{ error.message }}</p>
        <button 
          @click="handleError" 
          class="btn btn-primary px-4 py-2"
        >
          重试
        </button>
      </div>
    </div>
    <slot v-else></slot>
  </div>
</template>

<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const error = ref<Error | null>(null)

onErrorCaptured((err: Error) => {
  error.value = err
  return false
})

const handleError = () => {
  error.value = null
  router.go(0)
}
</script> 