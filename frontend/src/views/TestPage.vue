<template>
  <div class="test-page">
    <el-card>
      <template #header>
        <h3>测试页面</h3>
      </template>
      
      <div class="content">
        <p>这是一个测试页面，用于验证路由和组件加载是否正常。</p>
        
        <el-space>
          <el-button type="primary">
            <el-icon><Check /></el-icon>
            主要按钮
          </el-button>
          <el-button type="success">成功按钮</el-button>
          <el-button type="warning">警告按钮</el-button>
          <el-button type="danger">危险按钮</el-button>
        </el-space>
        
        <div style="margin-top: 20px;">
          <el-table :data="testData" style="width: 100%">
            <el-table-column prop="name" label="名称" />
            <el-table-column prop="value" label="值" />
            <el-table-column prop="status" label="状态" />
          </el-table>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Check } from '@element-plus/icons-vue'

const testData = ref([
  { name: '测试项1', value: '值1', status: '正常' },
  { name: '测试项2', value: '值2', status: '正常' },
  { name: '测试项3', value: '值3', status: '异常' }
])
</script>

<style scoped>
.test-page {
  padding: 20px;
}

.content {
  padding: 20px 0;
}
</style>