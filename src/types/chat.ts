// 消息角色类型
export type MessageRole = 'user' | 'assistant' | 'system'

// 聊天消息类型
export interface ChatMessage {
  id: string
  role: MessageRole
  content: string
  timestamp: string
}

// 聊天会话类型
export interface ChatSession {
  id: string
  messages: ChatMessage[]
  createdAt: string
  updatedAt: string
}

// API 响应类型
export interface ChatResponse {
  choices: Array<{
    message: {
      role: MessageRole
      content: string
    }
  }>
}

// API 错误类型
export class ApiError extends Error {
  constructor(
    message: string,
    public code: string,
    public status?: number
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// 聊天完成选项类型
export interface ChatCompletionOptions {
  model: string
  temperature: number
  max_tokens: number
  presence_penalty: number
  frequency_penalty: number
}

// 聊天状态类型
export interface ChatState {
  messages: ChatMessage[]
  isLoading: boolean
  error: string | null
  currentSession: ChatSession | null
} 