import api from '@/services/api'
import type { ChatMessage, ChatSession, ChatResponse } from '@/types/chat'

// 生成唯一ID
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// 创建新的聊天会话
export function createChatSession(): ChatSession {
  return {
    id: generateId(),
    messages: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
}

// Send message to DeepSeek API
export async function sendMessage(messages: ChatMessage[]): Promise<ChatMessage | null> {
  try {
    // 检查 API Key
    const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY
    if (!apiKey) {
      throw new Error('API key is not configured')
    }

    // 只在没有API Key时使用开发环境模拟响应
    if (!apiKey && import.meta.env.DEV) {
      // Simulate API response in development
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const lastMessage = messages[messages.length - 1]
      let response = ''
      
      // 根据消息内容生成相应的回复
      if (lastMessage.content.includes('目标') || lastMessage.content.includes('计划')) {
        response = '让我帮你分析一下目标和计划。\n\n1. 首先，你的目标是什么？请具体描述一下。\n2. 这个目标对你来说有多重要？\n3. 你期望在什么时间范围内实现它？\n4. 目前遇到了哪些困难？\n\n让我们一步步来规划实现的方案。'
      } 
      else if (lastMessage.content.includes('问题') || lastMessage.content.includes('困难')) {
        response = '我明白你遇到了困难。让我们一起来分析这个问题：\n\n1. 这个问题具体表现在哪些方面？\n2. 它对你的影响有多大？\n3. 你已经尝试过哪些解决方法？\n4. 现在最急需解决的是什么？\n\n基于你的回答，我们可以制定一个切实可行的解决方案。'
      }
      else if (lastMessage.content.includes('建议') || lastMessage.content.includes('怎么办')) {
        response = '关于这个情况，我有以下建议：\n\n1. 首先，让我们客观分析现状\n2. 考虑可能的解决方案：\n   - 方案A：...\n   - 方案B：...\n   - 方案C：...\n3. 评估每个方案的优劣势\n4. 制定具体的执行计划\n\n你觉得这些建议中，哪些最适合你的情况？'
      }
      else if (lastMessage.content.includes('谢谢') || lastMessage.content.includes('感谢')) {
        response = '不用谢！很高兴能帮到你。如果还有任何问题，随时都可以问我。我会继续为你提供支持和建议。'
      }
      else {
        // 生成更有针对性的回复
        response = `让我仔细思考一下你说的"${lastMessage.content}"。\n\n这个问题涉及几个方面：\n1. ${generateRelevantPoint(lastMessage.content)}\n2. ${generateRelevantPoint(lastMessage.content)}\n3. ${generateRelevantPoint(lastMessage.content)}\n\n你想先从哪个方面深入讨论？`
      }

      return {
        id: Date.now().toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date().toLocaleTimeString()
      }
    }

    // 设置请求头
    api.defaults.headers.common['Authorization'] = `Bearer ${apiKey}`
    api.defaults.headers.common['Content-Type'] = 'application/json'

    // 准备请求数据
    const requestData = {
      model: import.meta.env.VITE_CHAT_MODEL || 'deepseek-chat',
      messages: messages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      })),
      temperature: Number(import.meta.env.VITE_TEMPERATURE) || 0.7,
      max_tokens: Number(import.meta.env.VITE_MAX_TOKENS) || 1000,
      stream: false
    }

    console.log('Sending request to DeepSeek API:', {
      url: '/chat/completions',
      model: requestData.model,
      messagesCount: requestData.messages.length,
      baseURL: api.defaults.baseURL
    })

    // 发送请求
    const response = await api.post<ChatResponse>('/chat/completions', requestData, {
      timeout: 30000, // 30 seconds timeout
      validateStatus: (status) => status === 200
    })

    console.log('Received response from DeepSeek API:', {
      status: response.status,
      hasChoices: !!response.data?.choices,
      firstChoice: response.data?.choices?.[0],
      config: {
        url: response.config.url,
        baseURL: response.config.baseURL,
        fullUrl: `${response.config.baseURL}${response.config.url}`
      }
    })

    // 验证响应
    if (!response.data || !response.data.choices || !response.data.choices[0]?.message?.content) {
      console.error('Invalid API response:', response.data)
      throw new Error('Invalid response from API')
    }

    const content = response.data.choices[0].message.content.trim()
    if (!content) {
      throw new Error('Empty response from API')
    }

    return {
      id: Date.now().toString(),
      role: 'assistant',
      content: content,
      timestamp: new Date().toLocaleTimeString()
    }

  } catch (error: any) {
    console.error('API call failed:', error)
    
    let errorMessage: string
    if (error.response) {
      // API 响应错误
      const status = error.response.status
      const data = error.response.data
      
      switch (status) {
        case 401:
          errorMessage = 'API 认证失败，请检查 API Key'
          break
        case 404:
          errorMessage = 'API 端点不存在，请检查 API 配置'
          break
        case 429:
          errorMessage = '请求过于频繁，请稍后再试'
          break
        case 500:
          errorMessage = '服务器错误，请稍后重试'
          break
        default:
          errorMessage = `API 错误 (${status}): ${data?.error?.message || '请检查API配置和网络连接'}`
      }

      // 记录详细错误信息
      console.error('Detailed API Error:', {
        status,
        data,
        requestUrl: error.config?.url,
        requestBaseUrl: error.config?.baseURL,
        requestHeaders: error.config?.headers
      })
    } else if (error.code === 'ECONNABORTED') {
      errorMessage = '请求超时，请稍后重试'
    } else {
      errorMessage = error.message || '发生未知错误'
    }

    return {
      id: Date.now().toString(),
      role: 'assistant',
      content: `抱歉，${errorMessage}`,
      timestamp: new Date().toLocaleTimeString()
    }
  }
}

// 辅助函数：根据用户输入生成相关的讨论点
function generateRelevantPoint(input: string): string {
  const points = [
    '这可能与个人成长和发展有关',
    '这涉及到时间管理和效率问题',
    '这可能需要考虑长期规划和短期目标',
    '这与建立良好的习惯有关',
    '这需要平衡多个方面的需求',
    '这可能需要一些具体的行动步骤',
    '这涉及到自我认知和理解',
    '这可能需要一些外部资源和支持',
    '这与情绪管理和心理健康有关',
    '这需要考虑可行性和持续性'
  ]
  
  // 根据输入内容选择最相关的点
  const words = input.split(/\s+/)
  const relevantPoints = points.filter(point => 
    words.some(word => point.includes(word))
  )
  
  return relevantPoints.length > 0 
    ? relevantPoints[Math.floor(Math.random() * relevantPoints.length)]
    : points[Math.floor(Math.random() * points.length)]
}

// 更新会话
export async function updateSession(session: ChatSession) {
  try {
    session.updatedAt = new Date().toISOString()
    localStorage.setItem(`chat_session_${session.id}`, JSON.stringify(session))
  } catch (error) {
    console.error('更新会话失败:', error)
    throw error
  }
}

// 获取历史会话列表
export function getSessionList(): ChatSession[] {
  const sessions: ChatSession[] = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key?.startsWith('chat_session_')) {
      const session = JSON.parse(localStorage.getItem(key) || '{}')
      sessions.push(session)
    }
  }
  return sessions.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
}

// 删除会话
export function deleteSession(sessionId: string) {
  localStorage.removeItem(`chat_session_${sessionId}`)
} 