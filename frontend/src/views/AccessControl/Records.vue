<template>
  <div class="access-records">
    <el-card>
      <template #header>
        <h3>通行记录</h3>
      </template>
      
      <div class="page-content">
        <!-- 左侧终端信息 -->
        <div class="left-panel">
          <div class="panel-header">
            <h4>通行设备</h4>
          </div>
          <div class="terminal-list">
            <div class="search-box">
              <el-input
                v-model="terminalSearch"
                placeholder="请输入终端名称"
                size="small"
                clearable
              />
            </div>
            <div class="terminal-tree">
              <div
                v-for="terminal in filteredTerminals"
                :key="terminal.id"
                class="terminal-item"
                :class="{ active: selectedTerminal?.id === terminal.id }"
                @click="selectTerminal(terminal)"
              >
                <div class="terminal-info">
                  <div class="terminal-name">{{ terminal.name }}</div>
                  <div class="terminal-location">{{ terminal.location }}</div>
                </div>
                <div class="terminal-status">
                  <el-tag :type="terminal.status === '在线' ? 'success' : 'danger'" size="small">
                    {{ terminal.status }}
                  </el-tag>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 右侧记录信息 -->
        <div class="right-panel">
          <!-- 搜索筛选区域 -->
          <div class="filter-area">
            <el-form :model="filterForm" :inline="true">
              <el-form-item label="基础信息">
                <el-input
                  v-model="filterForm.keyword"
                  placeholder="请输入姓名/工号/手机号"
                  clearable
                  style="width: 200px;"
                />
              </el-form-item>
              
              <el-form-item label="开门方式">
                <el-select v-model="filterForm.openMethod" placeholder="全部" clearable>
                  <el-option label="全部" value="" />
                  <el-option label="人脸识别" value="人脸识别" />
                  <el-option label="刷卡" value="刷卡" />
                  <el-option label="密码" value="密码" />
                </el-select>
              </el-form-item>
              
              <el-form-item label="通行类型">
                <el-select v-model="filterForm.accessType" placeholder="全部" clearable>
                  <el-option label="全部" value="" />
                  <el-option label="进入" value="进入" />
                  <el-option label="离开" value="离开" />
                </el-select>
              </el-form-item>
              
              <el-form-item label="通行时间">
                <el-date-picker
                  v-model="filterForm.timeRange"
                  type="datetimerange"
                  range-separator="~"
                  start-placeholder="请选择开始时间"
                  end-placeholder="请选择结束时间"
                  format="YYYY-MM-DD HH:mm:ss"
                  value-format="YYYY-MM-DD HH:mm:ss"
                />
              </el-form-item>
              
              <el-form-item>
                <el-button type="primary" @click="handleSearch">搜索</el-button>
                <el-button @click="handleReset">重置</el-button>
              </el-form-item>
            </el-form>
          </div>
          
          <!-- 记录列表 -->
          <div class="records-table">
            <el-table
              :data="recordsList"
              v-loading="loading"
              style="width: 100%"
            >
              <el-table-column prop="name" label="姓名" width="100" />
              <el-table-column prop="gender" label="性别" width="80" />
              <el-table-column prop="workId" label="工号" width="120" />
              <el-table-column prop="phone" label="联系方式" width="130" />
              <el-table-column prop="openMethod" label="开门方式" width="100" />
              <el-table-column prop="accessType" label="通行类型" width="100">
                <template #default="{ row }">
                  <el-tag :type="row.accessType === '进入' ? 'success' : 'warning'">
                    {{ row.accessType }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="accessTime" label="通行时间" width="160" />
              <el-table-column prop="location" label="通行地点" />
              <el-table-column label="状态" width="100">
                <template #default="{ row }">
                  <el-tag :type="row.status === '正常' ? 'success' : 'danger'">
                    {{ row.status }}
                  </el-tag>
                </template>
              </el-table-column>
            </el-table>
            
            <!-- 分页 -->
            <div class="pagination">
              <el-pagination
                v-model:current-page="pagination.page"
                v-model:page-size="pagination.pageSize"
                :page-sizes="[10, 20, 50, 100]"
                :total="pagination.total"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
              />
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

const loading = ref(false)
const terminalSearch = ref('')
const selectedTerminal = ref(null)
const recordsList = ref([])

const filterForm = reactive({
  keyword: '',
  openMethod: '',
  accessType: '',
  timeRange: []
})

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

// 模拟终端数据
const terminals = ref([
  { id: 1, name: '23#门禁', location: 'A栋1楼大门', status: '在线' },
  { id: 2, name: '24#门禁', location: 'A栋2楼门禁', status: '在线' },
  { id: 3, name: '25#门禁', location: 'B栋1楼大门', status: '离线' },
  { id: 4, name: '26#门禁', location: 'B栋2楼门禁', status: '在线' },
  { id: 5, name: '27#门禁', location: 'C栋1楼大门', status: '在线' }
])

// 筛选后的终端列表
const filteredTerminals = computed(() => {
  if (!terminalSearch.value) return terminals.value
  return terminals.value.filter(item => 
    item.name.includes(terminalSearch.value) || 
    item.location.includes(terminalSearch.value)
  )
})

// 模拟通行记录数据
const mockRecords = [
  {
    id: 1,
    name: '张三',
    gender: '男',
    workId: '12315461',
    phone: '13111111131',
    openMethod: '人脸识别',
    accessType: '进入',
    accessTime: '2024.06.27 10:23:23',
    location: 'A栋1楼大门',
    status: '正常'
  },
  {
    id: 2,
    name: '李四',
    gender: '女',
    workId: '12315462',
    phone: '13111111132',
    openMethod: '刷卡',
    accessType: '离开',
    accessTime: '2024.06.27 10:23:23',
    location: 'A栋1楼大门',
    status: '正常'
  },
  {
    id: 3,
    name: '王五',
    gender: '男',
    workId: '12315463',
    phone: '13111111133',
    openMethod: '人脸识别',
    accessType: '进入',
    accessTime: '2024.06.27 10:23:23',
    location: 'B栋1楼大门',
    status: '异常'
  }
]

// 选择终端
const selectTerminal = (terminal) => {
  selectedTerminal.value = terminal
  fetchRecords()
}

// 获取记录列表
const fetchRecords = async () => {
  try {
    loading.value = true
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    recordsList.value = mockRecords
    pagination.total = mockRecords.length
  } catch (error) {
    ElMessage.error('获取通行记录失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  fetchRecords()
}

// 重置
const handleReset = () => {
  Object.keys(filterForm).forEach(key => {
    if (key === 'timeRange') {
      filterForm[key] = []
    } else {
      filterForm[key] = ''
    }
  })
  pagination.page = 1
  fetchRecords()
}

// 分页处理
const handleSizeChange = (val) => {
  pagination.pageSize = val
  pagination.page = 1
  fetchRecords()
}

const handleCurrentChange = (val) => {
  pagination.page = val
  fetchRecords()
}

onMounted(() => {
  // 默认选择第一个终端
  if (terminals.value.length > 0) {
    selectTerminal(terminals.value[0])
  }
})
</script>

<style scoped lang="scss">
.access-records {
  .page-content {
    display: flex;
    gap: 20px;
    
    .left-panel {
      width: 300px;
      border: 1px solid #e8e8e8;
      border-radius: 4px;
      
      .panel-header {
        padding: 16px;
        border-bottom: 1px solid #e8e8e8;
        background: #fafafa;
        
        h4 {
          margin: 0;
          color: #333;
          font-size: 14px;
        }
      }
      
      .terminal-list {
        padding: 16px;
        
        .search-box {
          margin-bottom: 16px;
        }
        
        .terminal-tree {
          max-height: 500px;
          overflow-y: auto;
          
          .terminal-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px;
            margin-bottom: 8px;
            border-radius: 4px;
            cursor: pointer;
            border: 1px solid #e8e8e8;
            transition: all 0.3s;
            
            &:hover {
              background-color: #f0f9ff;
              border-color: #1890ff;
            }
            
            &.active {
              background-color: #e6f7ff;
              border-color: #1890ff;
            }
            
            .terminal-info {
              .terminal-name {
                font-weight: 500;
                color: #333;
                margin-bottom: 4px;
              }
              
              .terminal-location {
                font-size: 12px;
                color: #666;
              }
            }
          }
        }
      }
    }
    
    .right-panel {
      flex: 1;
      
      .filter-area {
        margin-bottom: 20px;
        padding: 20px;
        background: #fafafa;
        border-radius: 4px;
        
        .el-form-item {
          margin-bottom: 16px;
        }
      }
      
      .records-table {
        .pagination {
          margin-top: 20px;
          display: flex;
          justify-content: center;
        }
      }
    }
  }
}
</style>