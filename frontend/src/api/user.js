import { defineStore } from 'pinia'
import { ref } from 'vue'
import { login, getUserInfo } from '../api/user'

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token') || '')
  const userInfo = ref({})
  const permissions = ref([])

  // 登录
  const loginAction = async (loginForm) => {
    try {
      const response = await login(loginForm)
      token.value = response.data.token
      localStorage.setItem('token', token.value)
      return response
    } catch (error) {
      throw error
    }
  }

  // 获取用户信息
  const getUserInfoAction = async () => {
    try {
      const response = await getUserInfo()
      userInfo.value = response.data.userInfo
      permissions.value = response.data.permissions
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
  }

  // 初始化用户信息
  const initUserInfo = async () => {
    if (token.value) {
      try {
        await getUserInfoAction()
      } catch (error) {
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