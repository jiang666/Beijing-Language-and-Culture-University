<template>
  <div class="layout-container">
    <!-- 侧边栏 -->
    <div class="sidebar" :class="{ collapsed: sidebarCollapsed }">
      <Sidebar @toggle="toggleSidebar" />
    </div>
    
    <!-- 主内容区 -->
    <div class="main-container">
      <!-- 顶部导航 -->
      <div class="header">
        <Header />
      </div>
      
      <!-- 内容区域 -->
      <div class="content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Sidebar from './Sidebar.vue'
import Header from './Header.vue'

const sidebarCollapsed = ref(false)

const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}
</script>

<style scoped lang="scss">
.layout-container {
  display: flex;
  height: 100vh;
  
  .sidebar {
    width: 250px;
    background: #f5f5f5;
    transition: width 0.3s;
    border-right: 1px solid #e8e8e8;
    
    &.collapsed {
      width: 64px;
    }
  }
  
  .main-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    
    .header {
      height: 64px;
      background: #fff;
      border-bottom: 1px solid #e8e8e8;
      box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
    }
    
    .content {
      flex: 1;
      padding: 20px;
      background: #f0f2f5;
      overflow: auto;
    }
  }
}
</style>