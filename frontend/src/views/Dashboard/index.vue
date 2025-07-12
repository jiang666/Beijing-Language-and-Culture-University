<template>
  <div class="dashboard">
    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stats-cards">
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon users">
              <el-icon><User /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-number">{{ stats.totalUsers }}</div>
              <div class="stat-label">总用户数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon records">
              <el-icon><Document /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-number">{{ stats.todayRecords }}</div>
              <div class="stat-label">今日通行</div>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon terminals">
              <el-icon><Monitor /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-number">{{ stats.onlineTerminals }}</div>
              <div class="stat-label">在线设备</div>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon rooms">
              <el-icon><House /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-number">{{ stats.totalRooms }}</div>
              <div class="stat-label">房屋总数</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <!-- 图表区域 -->
    <el-row :gutter="20" class="charts-section">
      <el-col :span="12">
        <el-card title="最近7天通行趋势">
          <div class="chart-container">
            <div ref="accessTrendChart" class="chart"></div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="12">
        <el-card title="设备状态分布">
          <div class="chart-container">
            <div ref="deviceStatusChart" class="chart"></div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <!-- 最新记录 -->
    <el-row :gutter="20" class="recent-section">
      <el-col :span="24">
        <el-card title="最新通行记录">
          <el-table :data="recentRecords" style="width: 100%">
            <el-table-column prop="name" label="姓名" width="120" />
            <el-table-column prop="department" label="部门" width="120" />
            <el-table-column prop="action" label="动作" width="100" />
            <el-table-column prop="location" label="位置" width="150" />
            <el-table-column prop="time" label="时间" />
            <el-table-column label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="row.status === '成功' ? 'success' : 'danger'">
                  {{ row.status }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { User, Document, Monitor, House } from '@element-plus/icons-vue'

const stats = reactive({
  totalUsers: 1256,
  todayRecords: 342,
  onlineTerminals: 24,
  totalRooms: 168
})

const recentRecords = ref([
  {
    name: '张三',
    department: '技术部',
    action: '进入',
    location: 'A栋1楼大门',
    time: '2024.07.12 14:30:25',
    status: '成功'
  },
  {
    name: '李四',
    department: '产品部',
    action: '离开',
    location: 'B栋2楼门禁',
    time: '2024.07.12 14:28:15',
    status: '成功'
  },
  {
    name: '王五',
    department: '运营部',
    action: '进入',
    location: 'C栋3楼门禁',
    time: '2024.07.12 14:25:42',
    status: '失败'
  },
  {
    name: '赵六',
    department: '财务部',
    action: '进入',
    location: 'A栋地下车库',
    time: '2024.07.12 14:22:08',
    status: '成功'
  },
  {
    name: '钱七',
    department: '人事部',
    action: '离开',
    location: 'B栋1楼大门',
    time: '2024.07.12 14:18:33',
    status: '成功'
  }
])

const accessTrendChart = ref()
const deviceStatusChart = ref()

// 模拟图表初始化
const initCharts = () => {
  // 这里可以使用 ECharts 或其他图表库
  // 由于环境限制，这里仅显示占位元素
  if (accessTrendChart.value) {
    accessTrendChart.value.innerHTML = `
      <div style="height: 300px; display: flex; align-items: center; justify-content: center; background: #f9f9f9; border-radius: 4px;">
        <div style="text-align: center; color: #999;">
          <div style="font-size: 48px; margin-bottom: 16px;">📈</div>
          <div>通行趋势图表</div>
        </div>
      </div>
    `
  }
  
  if (deviceStatusChart.value) {
    deviceStatusChart.value.innerHTML = `
      <div style="height: 300px; display: flex; align-items: center; justify-content: center; background: #f9f9f9; border-radius: 4px;">
        <div style="text-align: center; color: #999;">
          <div style="font-size: 48px; margin-bottom: 16px;">🔧</div>
          <div>设备状态图表</div>
        </div>
      </div>
    `
  }
}

onMounted(() => {
  initCharts()
})
</script>

<style scoped lang="scss">
.dashboard {
  .stats-cards {
    margin-bottom: 24px;
    
    .stat-card {
      .stat-content {
        display: flex;
        align-items: center;
        
        .stat-icon {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 16px;
          
          .el-icon {
            font-size: 24px;
            color: white;
          }
          
          &.users {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }
          
          &.records {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          }
          
          &.terminals {
            background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          }
          
          &.rooms {
            background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
          }
        }
        
        .stat-info {
          .stat-number {
            font-size: 32px;
            font-weight: bold;
            color: #333;
            line-height: 1;
            margin-bottom: 4px;
          }
          
          .stat-label {
            color: #666;
            font-size: 14px;
          }
        }
      }
    }
  }
  
  .charts-section {
    margin-bottom: 24px;
    
    .chart-container {
      .chart {
        height: 300px;
      }
    }
  }
  
  .recent-section {
    .el-table {
      :deep(.el-table__header) {
        th {
          background: #fafafa;
        }
      }
    }
  }
}
</style>