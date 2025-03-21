import api from './api'

export interface User {
  id: string
  name: string
  avatar?: string
  email: string
}

interface AuthResponse {
  token: string
  user: User
}

// 开发环境下的模拟数据
const mockUser: User = {
  id: '1',
  name: '测试用户',
  email: 'test@example.com',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=test'
}

const mockToken = 'mock_token_for_development'

// 用户登录
export async function login(email: string, password: string) {
  try {
    if (import.meta.env.DEV) {
      // 开发环境下使用模拟数据
      await new Promise(resolve => setTimeout(resolve, 1000)) // 模拟网络延迟
      
      if (email === 'test@example.com' && password === 'password') {
        localStorage.setItem('deepseek_token', mockToken)
        localStorage.setItem('user', JSON.stringify(mockUser))
        return mockUser
      }
      
      throw new Error('邮箱或密码错误')
    }

    const { data } = await api.post<AuthResponse>('/auth/login', { email, password })
    
    // 保存 token 和用户信息
    localStorage.setItem('deepseek_token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    
    return data.user
  } catch (error) {
    console.error('登录失败:', error)
    throw error
  }
}

// 用户注册
export async function register(name: string, email: string, password: string) {
  try {
    if (import.meta.env.DEV) {
      // 开发环境下使用模拟数据
      await new Promise(resolve => setTimeout(resolve, 1000)) // 模拟网络延迟
      
      const newUser = { ...mockUser, name, email }
      localStorage.setItem('deepseek_token', mockToken)
      localStorage.setItem('user', JSON.stringify(newUser))
      return newUser
    }

    const { data } = await api.post<AuthResponse>('/auth/register', { name, email, password })
    
    // 保存 token 和用户信息
    localStorage.setItem('deepseek_token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    
    return data.user
  } catch (error) {
    console.error('注册失败:', error)
    throw error
  }
}

// 退出登录
export function logout() {
  localStorage.removeItem('deepseek_token')
  localStorage.removeItem('user')
  window.location.href = '/login'
}

// 获取当前用户信息
export function getCurrentUser(): User | null {
  const userJson = localStorage.getItem('user')
  return userJson ? JSON.parse(userJson) : null
}

// 检查是否已登录
export function isAuthenticated(): boolean {
  return !!localStorage.getItem('deepseek_token')
}

// 更新用户信息
export async function updateUserProfile(userData: Partial<User>) {
  try {
    if (import.meta.env.DEV) {
      // 开发环境下使用模拟数据
      await new Promise(resolve => setTimeout(resolve, 1000)) // 模拟网络延迟
      
      const currentUser = getCurrentUser()
      if (!currentUser) throw new Error('用户未登录')
      
      const updatedUser = { ...currentUser, ...userData }
      localStorage.setItem('user', JSON.stringify(updatedUser))
      return updatedUser
    }

    const { data } = await api.put<{ user: User }>('/auth/profile', userData)
    
    // 更新本地存储的用户信息
    localStorage.setItem('user', JSON.stringify(data.user))
    
    return data.user
  } catch (error) {
    console.error('更新用户信息失败:', error)
    throw error
  }
} 