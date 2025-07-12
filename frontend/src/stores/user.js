import { defineStore } from 'pinia'
import { ref } from 'vue'

// 模拟登录API
const mockLogin = (loginForm) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (loginForm.username === 'admin' && loginForm.password === '123456') {
        resolve({
          data: {
            token: 'mock-token-' + Date.now(),
            userInfo: {
              id: 1,
              username: 'admin',
              name: '管理员',
              avatar: '',
              role: 'admin',
              department: '技术部'
            }
          }
        })
      } else {
        reject(new Error('用户名或密码错误'))
      }
    }, 500)
  })
}

// 模拟获取用户信息API
const mockGetUserInfo = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          userInfo: {
            id: 1,
            username: 'admin',
            name: '管理员',
            avatar: '',
            role: 'admin',
            department: '技术部'
          },
          permissions: ['user:read', 'user:write', 'access:read', 'room:read', 'credit:read']
        }
      })
    }, 300)
  })
}

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token') || '')
  const userInfo = ref({})
  const permissions = ref([])

  // 登录
  const loginAction = async (loginForm) => {
    try {
      const response = await mockLogin(loginForm)
      token.value = response.data.token
      userInfo.value = response.data.userInfo
      localStorage.setItem('token', token.value)
      localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
      return response
    } catch (error) {
      throw error
    }
  }

  // 获取用户信息
  const getUserInfoAction = async () => {
    try {
      const response = await mockGetUserInfo()
      userInfo.value = response.data.userInfo
      permissions.value = response.data.permissions
      localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
      localStorage.setItem('permissions', JSON.stringify(permissions.value))
      return response
    } catch (error) {
      throw error
    }
  }

  // 登出
  const logout = () => {
    token.value = ''
    userInfo.value = {}
    permissions.value = []
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
    localStorage.removeItem('permissions')
  }

  // 初始化用户信息
  const initUserInfo = async () => {
    if (token.value) {
      try {
        // 从localStorage恢复数据
        const savedUserInfo = localStorage.getItem('userInfo')
        const savedPermissions = localStorage.getItem('permissions')
        
        if (savedUserInfo) {
          userInfo.value = JSON.parse(savedUserInfo)
        }
        if (savedPermissions) {
          permissions.value = JSON.parse(savedPermissions)
        }
        
        // 如果没有用户信息，重新获取
        if (!savedUserInfo) {
          await getUserInfoAction()
        }
      } catch (error) {
        console.error('初始化用户信息失败:', error)
        logout()
      }
    }
  }

  return {
    token,
    userInfo,
    permissions,
    loginAction,
    getUserInfoAction,
    logout,
    initUserInfo
  }
})