<template>
  <div class="sidebar-wrapper">
    <!-- Logo区域 -->
    <div class="logo-container">
      <div class="logo">
        <span v-if="!collapsed">功能模块</span>
        <span v-else>功</span>
      </div>
    </div>
    
    <!-- 菜单区域 -->
    <el-menu
      :default-active="activeMenu"
      class="sidebar-menu"
      :collapse="collapsed"
      :unique-opened="true"
      router
    >
      <template v-for="route in menuRoutes" :key="route.path">
        <!-- 有子菜单的项 -->
        <el-sub-menu v-if="route.children && route.children.length > 0" :index="route.path">
          <template #title>
            <el-icon v-if="route.meta?.icon">
              <component :is="route.meta.icon" />
            </el-icon>
            <span>{{ route.meta?.title }}</span>
          </template>
          
          <el-menu-item
            v-for="child in route.children"
            :key="child.path"
            :index="route.path + '/' + child.path"
          >
            <el-icon v-if="child.meta?.icon">
              <component :is="child.meta.icon" />
            </el-icon>
            <template #title>{{ child.meta?.title }}</template>
          </el-menu-item>
        </el-sub-menu>
        
        <!-- 无子菜单的项 -->
        <el-menu-item v-else :index="route.path">
          <el-icon v-if="route.meta?.icon">
            <component :is="route.meta.icon" />
          </el-icon>
          <template #title>{{ route.meta?.title }}</template>
        </el-menu-item>
      </template>
    </el-menu>
    
    <!-- 折叠按钮 -->
    <div class="collapse-btn" @click="$emit('toggle')">
      <el-icon>
        <Fold v-if="!collapsed" />
        <Expand v-else />
      </el-icon>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Fold, Expand } from '@element-plus/icons-vue'

defineEmits(['toggle'])

const route = useRoute()
const collapsed = defineModel('collapsed', { default: false })

// 菜单路由配置
const menuRoutes = [
  {
    path: '/dashboard',
    meta: { title: '数据看板', icon: 'DataBoard' }
  },
  {
    path: '/user-manage',
    meta: { title: '用户管理', icon: 'User' }
  },
  {
    path: '/access-control',
    meta: { title: '门禁管理', icon: 'Lock' },
    children: [
      {
        path: 'records',
        meta: { title: '通行记录', icon: 'Document' }
      },
      {
        path: 'terminals',
        meta: { title: '终端信息', icon: 'Monitor' }
      }
    ]
  },
  {
    path: '/room-manage',
    meta: { title: '房屋管理', icon: 'House' }
  },
  {
    path: '/credit-manage',
    meta: { title: '信用管理', icon: 'CreditCard' }
  },
  {
    path: '/settings',
    meta: { title: '系统设置', icon: 'Setting' }
  }
]

// 当前激活的菜单
const activeMenu = computed(() => {
  return route.path
})
</script>

<style scoped lang="scss">
.sidebar-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
  
  .logo-container {
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid #e8e8e8;
    
    .logo {
      font-size: 18px;
      font-weight: bold;
      color: #1890ff;
    }
  }
  
  .sidebar-menu {
    flex: 1;
    border: none;
    
    :deep(.el-menu-item),
    :deep(.el-sub-menu__title) {
      height: 48px;
      line-height: 48px;
      
      &:hover {
        background-color: #e6f7ff;
      }
      
      &.is-active {
        background-color: #e6f7ff;
        color: #1890ff;
        border-right: 2px solid #1890ff;
      }
    }
  }
  
  .collapse-btn {
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-top: 1px solid #e8e8e8;
    
    &:hover {
      background-color: #f0f0f0;
    }
  }
}
</style>