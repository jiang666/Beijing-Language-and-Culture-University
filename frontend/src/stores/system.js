import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSystemStore = defineStore('system', () => {
  const sidebarCollapsed = ref(false)
  const loading = ref(false)
  const theme = ref('light')
  
  // 切换侧边栏
  const toggleSidebar = () => {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }
  
  // 设置加载状态
  const setLoading = (status) => {
    loading.value = status
  }
  
  // 切换主题
  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }
  
  return {
    sidebarCollapsed,
    loading,
    theme,
    toggleSidebar,
    setLoading,
    toggleTheme
  }
})