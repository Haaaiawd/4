<!-- ChatWindow.vue -->
<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-4xl mx-auto">
      <!-- 页面标题 -->
      <div class="mb-6">
        <h1 class="text-2xl font-semibold text-foreground">与Life Coach对话</h1>
        <p class="text-muted-foreground">探索自我,发现潜能</p>
      </div>

      <!-- 聊天窗口 -->
      <div class="flex flex-col h-[600px] border rounded-lg bg-background overflow-hidden">
        <!-- Chat Header -->
        <div class="border-b p-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
              LC
            </div>
            <div>
              <h3 class="font-medium">Life Coach</h3>
              <p class="text-sm text-muted-foreground">{{ isLoading ? '正在输入...' : '在线' }}</p>
            </div>
          </div>
          <button 
            class="p-2 rounded-full hover:bg-muted text-muted-foreground"
            @click="handleNewChat"
            title="新对话"
          >
            <i class="ri-add-line"></i>
          </button>
        </div>

        <!-- Message List -->
        <div class="flex-1 overflow-y-auto p-4 message-list" ref="messageListRef">
          <div class="space-y-4">
            <template v-if="messages.length === 0">
              <div class="text-center py-8">
                <div class="text-4xl mb-4">👋</div>
                <h3 class="text-lg font-medium mb-2">欢迎使用 Life Coach</h3>
                <p class="text-sm text-muted-foreground">
                  我是您的AI个人成长助手，让我们开始对话吧！
                </p>
              </div>
            </template>
            <div 
              v-else
              v-for="message in messages" 
              :key="message.id"
              class="flex"
              :class="message.role === 'user' ? 'justify-end' : 'justify-start'"
            >
              <div 
                class="flex max-w-[80%]"
                :class="message.role === 'user' ? 'flex-row-reverse' : 'flex-row'"
              >
                <!-- Avatar -->
                <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm">
                  {{ message.role === 'user' ? 'U' : 'AI' }}
                </div>
                
                <!-- Message Content -->
                <div class="mx-2">
                  <div 
                    class="rounded-lg px-4 py-2"
                    :class="[
                      message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground',
                      error && message.content === error ? 'bg-red-100 text-red-800' : ''
                    ]"
                  >
                    {{ message.content }}
                  </div>
                  <div class="text-xs text-muted-foreground mt-1">
                    {{ message.timestamp }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Loading Indicator -->
            <div v-if="isLoading" class="flex justify-start">
              <div class="flex max-w-[80%]">
                <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm">
                  AI
                </div>
                <div class="mx-2">
                  <div class="bg-muted rounded-lg px-4 py-2">
                    <div class="flex space-x-1">
                      <div class="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                      <div class="w-2 h-2 bg-current rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                      <div class="w-2 h-2 bg-current rounded-full animate-bounce" style="animation-delay: 0.4s"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Input Area -->
        <div class="border-t p-4">
          <form @submit.prevent="handleSubmit" class="relative">
            <div class="relative rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring p-1">
              <textarea
                v-model="input"
                rows="1"
                placeholder="输入消息..."
                class="min-h-12 w-full resize-none rounded-lg bg-background border-0 p-3 pr-12 shadow-none focus:outline-none"
                @keydown.enter.prevent="handleSubmit"
              ></textarea>
              <button
                type="submit"
                class="absolute right-2 bottom-2 p-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                :disabled="!input.trim() || isLoading"
              >
                <i class="ri-send-plane-line"></i>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { sendMessage } from '@/services/chat'
import type { ChatMessage } from '@/types/chat'

const input = ref('')
const isLoading = ref(false)
const messageListRef = ref<HTMLElement | null>(null)
const messages = ref<ChatMessage[]>([])
const error = ref<string | null>(null)

// Handle form submission
async function handleSubmit() {
  if (!input.value.trim() || isLoading.value) return
  
  error.value = null
  
  try {
    isLoading.value = true
    
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.value,
      timestamp: new Date().toLocaleTimeString()
    }
    messages.value.push(userMessage)
    input.value = ''
    
    // Scroll to bottom
    await nextTick()
    scrollToBottom()
    
    // Get AI response
    const aiMessage = await sendMessage([...messages.value])
    if (aiMessage) {
      messages.value.push(aiMessage)
      
      // Scroll to bottom again
      await nextTick()
      scrollToBottom()
    } else {
      error.value = '抱歉，我暂时无法回复。请稍后再试。'
      messages.value.push({
        id: Date.now().toString(),
        role: 'assistant',
        content: error.value,
        timestamp: new Date().toLocaleTimeString()
      })
    }
  } catch (error) {
    console.error('Failed to send message:', error)
    const errorMessage = '发生错误，请稍后重试。'
    messages.value.push({
      id: Date.now().toString(),
      role: 'assistant',
      content: errorMessage,
      timestamp: new Date().toLocaleTimeString()
    })
  } finally {
    isLoading.value = false
    scrollToBottom()
  }
}

// Start new chat
function handleNewChat() {
  messages.value = []
  input.value = ''
  
  // Add welcome message
  const welcomeMessage: ChatMessage = {
    id: Date.now().toString(),
    role: 'assistant',
    content: '你好！我是你的 AI 个人成长助手。我可以帮助你制定目标、解决问题、提供建议。让我们开始对话吧！',
    timestamp: new Date().toLocaleTimeString()
  }
  messages.value.push(welcomeMessage)
}

// Scroll message list to bottom
function scrollToBottom() {
  if (messageListRef.value) {
    messageListRef.value.scrollTop = messageListRef.value.scrollHeight
  }
}

// Initialize chat on mount
onMounted(() => {
  handleNewChat()
})
</script>

<style scoped>
.message-list {
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
}

.message-list::-webkit-scrollbar {
  width: 6px;
}

.message-list::-webkit-scrollbar-track {
  background: transparent;
}

.message-list::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}
</style> 