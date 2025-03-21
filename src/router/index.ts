import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 配置 NProgress
NProgress.configure({ showSpinner: false })

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/chat'
  },
  {
    path: '/chat',
    name: 'Chat',
    component: () => import('../components/ChatWindow.vue')
  },
  {
    path: '/growth',
    name: 'Growth',
    component: () => import('../views/GrowthView.vue')
  },
  {
    path: '/insights',
    name: 'Insights',
    component: () => import('../components/ChatWindow.vue')
  },
  {
    path: '/goals',
    name: 'Goals',
    component: () => import('../components/ChatWindow.vue')
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('../components/ChatWindow.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFoundView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((_to, _from, next) => {
  // 开始加载进度条
  NProgress.start()
  next()
})

// 路由解析完成
router.afterEach(() => {
  // 结束加载进度条
  NProgress.done()
})

// 路由错误处理
router.onError((error) => {
  console.error('路由错误:', error)
  NProgress.done()
})

export default router 