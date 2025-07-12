<template>
  <div class="credit-manage">
    <el-card>
      <template #header>
        <div class="card-header">
          <h3>信用管理</h3>
          <el-button type="primary" @click="handleQuickReserve">
            <el-icon><Plus /></el-icon>
            立即预约
          </el-button>
        </div>
      </template>
      
      <div class="page-content">
        <!-- 左侧导航 -->
        <div class="left-panel">
          <div class="panel-header">
            <h4>数录信用权约</h4>
          </div>
          <div class="nav-menu">
            <div 
              class="nav-item"
              :class="{ active: activeTab === 'list' }"
              @click="activeTab = 'list'"
            >
              <el-icon><Document /></el-icon>
              <span>列表</span>
            </div>
            <div 
              class="nav-item"
              :class="{ active: activeTab === 'reserve' }"
              @click="activeTab = 'reserve'"
            >
              <el-icon><Plus /></el-icon>
              <span>立即联约</span>
            </div>
            <div 
              class="nav-item"
              :class="{ active: activeTab === 'timeSelect' }"
              @click="activeTab = 'timeSelect'"
            >
              <el-icon><Clock /></el-icon>
              <span>选择信用时间</span>
            </div>
            <div 
              class="nav-item"
              :class="{ active: activeTab === 'validate' }"
              @click="activeTab = 'validate'"
            >
              <el-icon><Check /></el-icon>
              <span>有效吗</span>
            </div>
            <div 
              class="nav-item"
              :class="{ active: activeTab === 'success' }"
              @click="activeTab = 'success'"
            >
              <el-icon><CircleCheck /></el-icon>
              <span>预约成功</span>
            </div>
          </div>
          
          <el-divider />
          
          <div class="panel-header">
            <h4>信用权约列表</h4>
          </div>
          <div class="nav-menu">
            <div 
              class="nav-item"
              :class="{ active: activeTab === 'myReservations' }"
              @click="activeTab = 'myReservations'"
            >
              <el-icon><User /></el-icon>
              <span>我信用权约的</span>
            </div>
            <div 
              class="nav-item"
              :class="{ active: activeTab === 'checkStatus' }"
              @click="activeTab = 'checkStatus'"
            >
              <el-icon><View /></el-icon>
              <span>查核状态</span>
            </div>
            <div 
              class="nav-item"
              :class="{ active: activeTab === 'viewDetails' }"
              @click="activeTab = 'viewDetails'"
            >
              <el-icon><Document /></el-icon>
              <span>查看详情</span>
            </div>
            <div 
              class="nav-item"
              :class="{ active: activeTab === 'cancel' }"
              @click="activeTab = 'cancel'"
            >
              <el-icon><Close /></el-icon>
              <span>取消权约</span>
            </div>
          </div>
        </div>
        
        <!-- 右侧内容区 -->
        <div class="right-panel">
          <!-- 预约列表 -->
          <div v-if="activeTab === 'list'" class="content-section">
            <div class="section-header">
              <h4>信用权约列表</h4>
              <el-button type="primary" @click="handleAddReservation">新增预约</el-button>
            </div>
            
            <!-- 搜索区域 -->
            <div class="search-area">
              <el-form :model="searchForm" :inline="true">
                <el-form-item label="预约人">
                  <el-input v-model="searchForm.reservePerson" placeholder="请输入预约人" clearable />
                </el-form-item>
                <el-form-item label="房间">
                  <el-select v-model="searchForm.roomId" placeholder="请选择房间" clearable>
                    <el-option label="会议室A" value="1" />
                    <el-option label="会议室B" value="2" />
                    <el-option label="培训室" value="3" />
                  </el-select>
                </el-form-item>
                <el-form-item label="状态">
                  <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
                    <el-option label="待审核" value="pending" />
                    <el-option label="已通过" value="approved" />
                    <el-option label="已拒绝" value="rejected" />
                    <el-option label="已取消" value="cancelled" />
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="handleSearch">搜索</el-button>
                  <el-button @click="handleReset">重置</el-button>
                </el-form-item>
              </el-form>
            </div>
            
            <!-- 预约表格 -->
            <el-table :data="reservationList" v-loading="loading">
              <el-table-column prop="id" label="预约编号" width="120" />
              <el-table-column prop="reservePerson" label="预约人" width="100" />
              <el-table-column prop="roomName" label="房间" width="120" />
              <el-table-column prop="purpose" label="用途" width="150" />
              <el-table-column prop="reserveTime" label="预约时间" width="160" />
              <el-table-column prop="duration" label="使用时长" width="100" />
              <el-table-column label="状态" width="100">
                <template #default="{ row }">
                  <el-tag :type="getStatusType(row.status)">
                    {{ getStatusText(row.status) }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="createTime" label="申请时间" width="160" />
              <el-table-column label="操作" width="180" fixed="right">
                <template #default="{ row }">
                  <el-button type="primary" link @click="handleViewDetail(row)">查看</el-button>
                  <el-button 
                    type="warning" 
                    link 
                    @click="handleEdit(row)"
                    v-if="row.status === 'pending'"
                  >
                    编辑
                  </el-button>
                  <el-button 
                    type="danger" 
                    link 
                    @click="handleCancel(row)"
                    v-if="['pending', 'approved'].includes(row.status)"
                  >
                    取消
                  </el-button>
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
          
          <!-- 立即预约 -->
          <div v-else-if="activeTab === 'reserve'" class="content-section">
            <div class="section-header">
              <h4>立即预约</h4>
            </div>
            <!-- <ReservationForm @submit="handleReservationSubmit" /> -->
            <div class="temp-content">
              <el-empty description="预约表单组件开发中..." />
            </div>
          </div>
          
          <!-- 时间选择 -->
          <div v-else-if="activeTab === 'timeSelect'" class="content-section">
            <div class="section-header">
              <h4>选择信用时间</h4>
            </div>
            <!-- <TimeSelector @select="handleTimeSelect" /> -->
            <div class="temp-content">
              <el-empty description="时间选择组件开发中..." />
            </div>
          </div>
          
          <!-- 其他标签页内容 -->
          <div v-else class="content-section">
            <div class="section-header">
              <h4>{{ getTabTitle() }}</h4>
            </div>
            <div class="empty-content">
              <el-empty description="功能开发中..." />
            </div>
          </div>
        </div>
      </div>
    </el-card>
    
    <!-- 预约详情弹窗 -->
    <!-- <ReservationDetailDialog 
      v-model="detailDialogVisible" 
      :reservation="selectedReservation"
    /> -->
    
    <!-- 预约表单弹窗 -->
    <!-- <ReservationFormDialog 
      v-model="formDialogVisible"
      :reservation="editingReservation"
      @submit="handleFormSubmit"
    /> -->
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  Plus, Document, Clock, Check, CircleCheck, 
  User, View, Close 
} from '@element-plus/icons-vue'

// 注意：这些组件暂时注释掉，因为可能还没创建
// import ReservationForm from './components/ReservationForm.vue'
// import TimeSelector from './components/TimeSelector.vue'
// import ReservationDetailDialog from './components/ReservationDetailDialog.vue'
// import ReservationFormDialog from './components/ReservationFormDialog.vue'

const activeTab = ref('list')
const loading = ref(false)
const detailDialogVisible = ref(false)
const formDialogVisible = ref(false)
const selectedReservation = ref(null)
const editingReservation = ref(null)

const searchForm = reactive({
  reservePerson: '',
  roomId: '',
  status: ''
})

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

// 模拟预约数据
const reservationList = ref([
  {
    id: 'R001',
    reservePerson: '张三',
    roomName: '会议室A',
    purpose: '部门会议',
    reserveTime: '2024-07-15 14:00-16:00',
    duration: '2小时',
    status: 'approved',
    createTime: '2024-07-12 10:30:00',
    participants: 8,
    contact: '13111111131'
  },
  {
    id: 'R002',
    reservePerson: '李四',
    roomName: '培训室',
    purpose: '员工培训',
    reserveTime: '2024-07-16 09:00-12:00',
    duration: '3小时',
    status: 'pending',
    createTime: '2024-07-12 11:20:00',
    participants: 15,
    contact: '13111111132'
  },
  {
    id: 'R003',
    reservePerson: '王五',
    roomName: '会议室B',
    purpose: '客户洽谈',
    reserveTime: '2024-07-14 10:00-11:30',
    duration: '1.5小时',
    status: 'rejected',
    createTime: '2024-07-12 09:15:00',
    participants: 4,
    contact: '13111111133'
  }
])

// 获取状态类型
const getStatusType = (status) => {
  const typeMap = {
    pending: 'warning',
    approved: 'success',
    rejected: 'danger',
    cancelled: 'info'
  }
  return typeMap[status] || 'info'
}

// 获取状态文本
const getStatusText = (status) => {
  const textMap = {
    pending: '待审核',
    approved: '已通过',
    rejected: '已拒绝',
    cancelled: '已取消'
  }
  return textMap[status] || '未知'
}

// 获取标签页标题
const getTabTitle = () => {
  const titleMap = {
    validate: '有效性验证',
    success: '预约成功记录',
    myReservations: '我的预约',
    checkStatus: '审核状态',
    viewDetails: '详细信息',
    cancel: '取消预约'
  }
  return titleMap[activeTab.value] || '功能页面'
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  // fetchReservationList()
}

// 重置
const handleReset = () => {
  Object.keys(searchForm).forEach(key => {
    searchForm[key] = ''
  })
  pagination.page = 1
  // fetchReservationList()
}

// 快速预约
const handleQuickReserve = () => {
  activeTab.value = 'reserve'
}

// 新增预约
const handleAddReservation = () => {
  editingReservation.value = null
  formDialogVisible.value = true
}

// 查看详情
const handleViewDetail = (row) => {
  selectedReservation.value = row
  detailDialogVisible.value = true
}

// 编辑预约
const handleEdit = (row) => {
  editingReservation.value = row
  formDialogVisible.value = true
}

// 取消预约
const handleCancel = async (row) => {
  try {
    await ElMessageBox.confirm(`确定要取消预约 ${row.id} 吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    row.status = 'cancelled'
    ElMessage.success('预约已取消')
  } catch {
    // 用户取消
  }
}

// 预约提交
const handleReservationSubmit = (data) => {
  ElMessage.success('预约申请已提交')
  activeTab.value = 'list'
}

// 时间选择
const handleTimeSelect = (time) => {
  ElMessage.success(`已选择时间：${JSON.stringify(time)}`)
}

// 表单提交
const handleFormSubmit = (data) => {
  if (editingReservation.value) {
    ElMessage.success('预约信息已更新')
  } else {
    ElMessage.success('预约申请已提交')
  }
  formDialogVisible.value = false
}

// 分页处理
const handleSizeChange = (val) => {
  pagination.pageSize = val
  pagination.page = 1
}

const handleCurrentChange = (val) => {
  pagination.page = val
}

onMounted(() => {
  pagination.total = reservationList.value.length
})
</script>

<style scoped lang="scss">
.credit-manage {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    h3 {
      margin: 0;
      color: #333;
    }
  }
  
  .page-content {
    display: flex;
    gap: 20px;
    
    .left-panel {
      width: 250px;
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
      
      .nav-menu {
        padding: 8px;
        
        .nav-item {
          display: flex;
          align-items: center;
          padding: 12px 16px;
          margin-bottom: 4px;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.3s;
          
          &:hover {
            background-color: #f0f9ff;
          }
          
          &.active {
            background-color: #e6f7ff;
            color: #1890ff;
            border-left: 3px solid #1890ff;
          }
          
          .el-icon {
            margin-right: 8px;
            font-size: 16px;
          }
          
          span {
            font-size: 14px;
          }
        }
      }
    }
    
    .right-panel {
      flex: 1;
      
      .content-section {
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          
          h4 {
            margin: 0;
            color: #333;
            font-size: 16px;
          }
        }
        
        .search-area {
          margin-bottom: 20px;
          padding: 20px;
          background: #fafafa;
          border-radius: 4px;
        }
        
        .pagination {
          margin-top: 20px;
          display: flex;
          justify-content: center;
        }
        
        .empty-content {
          padding: 60px 20px;
          text-align: center;
        }
      }
    }
  }
}
</style>