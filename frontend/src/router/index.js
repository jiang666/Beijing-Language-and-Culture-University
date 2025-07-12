import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { title: '登录', requiresAuth: false }
  },
  {
    path: '/',
    component: () => import('../components/Layout/Layout.vue'),
    redirect: '/dashboard',
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('../views/Dashboard/index.vue'),
        meta: { title: '数据看板', icon: 'DataBoard' }
      },
      {
        path: 'user-manage',
        name: 'UserManage',
        component: () => import('../views/UserManage/index.vue'), // 恢复用户管理
        meta: { title: '用户管理', icon: 'User' }
      },
      {
        path: 'access-control',
        name: 'AccessControl',
        meta: { title: '门禁管理', icon: 'Lock' },
        children: [
          {
            path: 'records',
            name: 'AccessRecords',
            component: () => import('../views/AccessControl/Records.vue'), // 恢复通行记录
            meta: { title: '通行记录', icon: 'Document' }
          },
          {
            path: 'terminals',
            name: 'AccessTerminals',
            component: () => import('../views/AccessControl/Terminals.vue'), // 恢复终端信息
            meta: { title: '终端信息', icon: 'Monitor' }
          }
        ]
      },
      {
        path: 'room-manage',
        name: 'RoomManage',
        component: () => import('../views/RoomManage/index.vue'), // 恢复房屋管理
        meta: { title: '房屋管理', icon: 'House' }
      },
      {
        path: 'credit-manage',
        name: 'CreditManage',
        component: () => import('../views/CreditManage/index.vue'), // 恢复信用管理
        meta: { title: '信用管理', icon: 'CreditCard' }
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('../views/Settings/index.vue'), // 恢复系统设置
        meta: { title: '系统设置', icon: 'Setting' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫 - 延迟导入 userStore 避免循环依赖
router.beforeEach(async (to, from, next) => {
  // 动态导入 userStore
  try {
    const { useUserStore } = await import('../stores/user')
    const userStore = useUserStore()
    
    if (to.meta.requiresAuth && !userStore.token) {
      next('/login')
    } else if (to.path === '/login' && userStore.token) {
      next('/')
    } else {
      next()
    }
  } catch (error) {
    console.error('路由守卫错误:', error)
    next()
  }
})

export default router