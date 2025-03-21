import axios from 'axios'
import type { ChatCompletionOptions } from '../types/chat'

// 默认的聊天选项
export const defaultChatOptions: ChatCompletionOptions = {
  model: import.meta.env.VITE_CHAT_MODEL || 'deepseek-chat',
  temperature: Number(import.meta.env.VITE_TEMPERATURE) || 0.7,
  max_tokens: Number(import.meta.env.VITE_MAX_TOKENS) || 1000,
  presence_penalty: 0,
  frequency_penalty: 0
}

// API 错误类
export class ApiError extends Error {
  constructor(
    message: string,
    public code: string = 'UNKNOWN_ERROR',
    public status?: number
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// 检查环境变量配置
export function checkApiConfig() {
  const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

  if (!apiKey) {
    throw new ApiError(
      'DeepSeek API Key not configured. Please set VITE_DEEPSEEK_API_KEY in your environment variables.',
      'API_KEY_MISSING'
    )
  }

  if (!apiBaseUrl) {
    throw new ApiError(
      'API Base URL not configured. Please set VITE_API_BASE_URL in your environment variables.',
      'API_URL_MISSING'
    )
  }

  // 验证API基础URL格式
  try {
    new URL(apiBaseUrl)
  } catch (error) {
    throw new ApiError(
      'Invalid API Base URL format. Please check VITE_API_BASE_URL in your environment variables.',
      'INVALID_API_URL'
    )
  }
}

// 创建 axios 实例
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,  // 使用基础URL，不添加任何后缀
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 添加 API Key
    const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY
    if (apiKey && config.headers) {
      config.headers['Authorization'] = `Bearer ${apiKey}`
    }

    // 记录请求信息
    console.log('API Request:', {
      method: config.method,
      url: config.url,
      baseURL: config.baseURL,
      fullUrl: `${config.baseURL}${config.url}`,
      headers: {
        ...config.headers,
        Authorization: config.headers?.Authorization ? '(hidden)' : undefined
      }
    })

    return config
  },
  (error) => {
    console.error('Request interceptor error:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    // 记录响应信息
    console.log('API Response:', {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      data: response.data,
      config: {
        url: response.config.url,
        baseURL: response.config.baseURL,
        fullUrl: `${response.config.baseURL}${response.config.url}`
      }
    })
    return response
  },
  (error) => {
    if (error.response) {
      // 服务器返回错误
      console.error('API Error Response:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        headers: error.response.headers,
        config: {
          url: error.config.url,
          baseURL: error.config.baseURL,
          fullUrl: `${error.config.baseURL}${error.config.url}`,
          method: error.config.method
        }
      })
    } else if (error.request) {
      // 请求发送失败
      console.error('API Request Error:', {
        request: error.request,
        config: {
          url: error.config.url,
          baseURL: error.config.baseURL,
          fullUrl: `${error.config.baseURL}${error.config.url}`,
          method: error.config.method
        }
      })
    } else {
      // 其他错误
      console.error('API Error:', error.message)
    }
    return Promise.reject(error)
  }
)

export default api 