<template>
  <div class="header-container">
    <!-- 面包屑导航 -->
    <div class="breadcrumb-container">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item
          v-for="item in breadcrumbList"
          :key="item.path"
          :to="item.path ? { path: item.path } : undefined"
        >
          {{ item.title }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    
    <!-- 右侧操作区 -->
    <div class="actions">
      <!-- 用户信息下拉菜单 -->
      <el-dropdown @command="handleCommand">
        <div class="user-info">
          <el-avatar size="small" :src="userInfo.avatar">
            {{ userInfo.name?.charAt(0) }}
          </el-avatar>
          <span class="username">{{ userInfo.name || 'Administrator' }}</span>
          <el-icon class="arrow-down">
            <ArrowDown />
          </el-icon>
        </div>
        
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="profile">
              <el-icon><User /></el-icon>
              个人中心
            </el-dropdown-item>
            <el-dropdown-item command="settings">
              <el-icon><Setting /></el-icon>
              系统设置
            </el-dropdown-item>
            <el-dropdown-item divided command="logout">
              <el-icon><SwitchButton /></el-icon>
              退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import { ArrowDown, User, Setting, SwitchButton } from '@element-plus/icons-vue'
import { useUserStore } from '../../stores/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const userInfo = computed(() => userStore.userInfo)

// 面包屑导航
const breadcrumbList = computed(() => {
  const matched = route.matched.filter(item => item.meta && item.meta.title)
  const breadcrumbs = []
  
  matched.forEach(item => {
    breadcrumbs.push({
      title: item.meta.title,
      path: item.path
    })
  })
  
  return breadcrumbs
})

// 处理下拉菜单命令
const handleCommand = async (command) => {
  switch (command) {
    case 'profile':
      // 跳转到个人中心
      break
    case 'settings':
      router.push('/settings')
      break
    case 'logout':
      try {
        await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        userStore.logout()
        router.push('/login')
      } catch {
        // 用户取消
      }
      break
  }
}
</script>

<style scoped lang="scss">
.header-container {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  
  .breadcrumb-container {
    flex: 1;
    
    :deep(.el-breadcrumb) {
      font-size: 14px;
      
      .el-breadcrumb__item {
        .el-breadcrumb__inner {
          color: #666;
          
          &:hover {
            color: #1890ff;
          }
        }
        
        &:last-child {
          .el-breadcrumb__inner {
            color: #1890ff;
            font-weight: 500;
          }
        }
      }
    }
  }
  
  .actions {
    display: flex;
    align-items: center;
    
    .user-info {
      display: flex;
      align-items: center;
      padding: 8px 12px;
      cursor: pointer;
      border-radius: 4px;
      transition: background-color 0.3s;
      
      &:hover {
        background-color: #f0f0f0;
      }
      
      .username {
        margin: 0 8px;
        font-size: 14px;
        color: #333;
      }
      
      .arrow-down {
        font-size: 12px;
        color: #999;
      }
    }
  }
}
</style>