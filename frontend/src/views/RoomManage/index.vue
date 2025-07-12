<template>
  <div class="room-manage">
    <el-card>
      <template #header>
        <div class="card-header">
          <h3>房屋管理</h3>
          <div class="header-actions">
            <el-button type="success" @click="handleBatchAssign">
              <el-icon><UserFilled /></el-icon>
              批量分配权限
            </el-button>
            <el-button type="primary" @click="handleAdd">
              <el-icon><Plus /></el-icon>
              新增房屋
            </el-button>
          </div>
        </div>
      </template>
      
      <!-- 搜索区域 -->
      <div class="search-area">
        <el-form :model="searchForm" :inline="true">
          <el-form-item label="收录人员名单">
            <el-select v-model="searchForm.userType" placeholder="全部" clearable>
              <el-option label="全部" value="" />
              <el-option label="已收录" value="已收录" />
              <el-option label="未收录" value="未收录" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="房屋名称">
            <el-select v-model="searchForm.roomName" placeholder="全部" clearable>
              <el-option label="全部" value="" />
              <el-option label="A栋" value="A栋" />
              <el-option label="B栋" value="B栋" />
              <el-option label="C栋" value="C栋" />
            </el-select>
          </el-form-item>
          
          <el-form-item>
            <el-button type="primary" @click="handleSearch">
              <el-icon><Search /></el-icon>
              搜索名单
            </el-button>
            <el-button @click="handleAdd">
              <el-icon><Plus /></el-icon>
              添加
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      
      <!-- 房屋列表 -->
      <div class="rooms-grid">
        <el-row :gutter="20">
          <el-col 
            :span="6" 
            v-for="room in roomsList" 
            :key="room.id"
            class="room-col"
          >
            <el-card class="room-card" @click="handleRoomClick(room)">
              <div class="room-header">
                <div class="room-icon">
                  <el-icon><House /></el-icon>
                </div>
                <div class="room-actions">
                  <el-dropdown @command="(command) => handleRoomAction(command, room)">
                    <el-button type="default" size="small">
                      <el-icon><MoreFilled /></el-icon>
                    </el-button>
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item command="edit">编辑</el-dropdown-item>
                        <el-dropdown-item command="assign">分配权限</el-dropdown-item>
                        <el-dropdown-item command="delete" divided>删除</el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                </div>
              </div>
              
              <div class="room-content">
                <h4 class="room-name">{{ room.name }}</h4>
                <div class="room-info">
                  <div class="info-item">
                    <span class="label">楼层：</span>
                    <span class="value">{{ room.floor }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">面积：</span>
                    <span class="value">{{ room.area }}㎡</span>
                  </div>
                  <div class="info-item">
                    <span class="label">状态：</span>
                    <el-tag :type="room.status === '可用' ? 'success' : 'warning'" size="small">
                      {{ room.status }}
                    </el-tag>
                  </div>
                </div>
                
                <div class="room-users">
                  <div class="users-header">
                    <span>授权人员 ({{ room.authorizedUsers?.length || 0 }})</span>
                  </div>
                  <div class="users-list">
                    <div class="avatar-group">
                      <el-avatar 
                        v-for="(user, index) in room.authorizedUsers?.slice(0, 3)" 
                        :key="user.id"
                        size="small"
                        :style="{ marginLeft: index > 0 ? '-8px' : '0', zIndex: 3 - index }"
                      >
                        {{ user.name.charAt(0) }}
                      </el-avatar>
                    </div>
                    <span v-if="room.authorizedUsers?.length > 3" class="more-users">
                      +{{ room.authorizedUsers.length - 3 }}
                    </span>
                  </div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
      
      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[8, 16, 24, 32]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    
    <!-- 房屋表单弹窗 -->
    <el-dialog
      v-model="roomDialogVisible"
      :title="roomDialogTitle"
      width="600px"
      @close="handleRoomDialogClose"
    >
      <el-form
        ref="roomFormRef"
        :model="roomForm"
        :rules="roomFormRules"
        label-width="80px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="房屋名称" prop="name">
              <el-input v-model="roomForm.name" placeholder="请输入房屋名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="楼层" prop="floor">
              <el-input v-model="roomForm.floor" placeholder="请输入楼层" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="面积" prop="area">
              <el-input v-model="roomForm.area" placeholder="请输入面积">
                <template #append>㎡</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-select v-model="roomForm.status" placeholder="请选择状态">
                <el-option label="可用" value="可用" />
                <el-option label="维修中" value="维修中" />
                <el-option label="停用" value="停用" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-form-item label="描述">
          <el-input
            v-model="roomForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入房屋描述"
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="roomDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleRoomSubmit">确定</el-button>
        </div>
      </template>
    </el-dialog>
    
    <!-- 权限分配弹窗 -->
    <el-dialog
      v-model="assignDialogVisible"
      title="分配房屋权限"
      width="800px"
    >
      <div class="assign-content">
        <div class="selected-room" v-if="selectedRoom">
          <h4>{{ selectedRoom.name }}</h4>
          <p>{{ selectedRoom.floor }} · {{ selectedRoom.area }}㎡</p>
        </div>
        
        <el-transfer
          v-model="assignedUsers"
          :data="allUsers"
          :titles="['可选人员', '已授权人员']"
          :button-texts="['移除', '添加']"
          :format="{
            noChecked: '${total}',
            hasChecked: '${checked}/${total}'
          }"
          filterable
        />
      </div>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="assignDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleAssignSubmit">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search, House, MoreFilled, UserFilled } from '@element-plus/icons-vue'

const roomsList = ref([])
const roomDialogVisible = ref(false)
const assignDialogVisible = ref(false)
const roomDialogTitle = ref('')
const isEdit = ref(false)
const currentRoom = ref(null)
const selectedRoom = ref(null)
const roomFormRef = ref()
const assignedUsers = ref([])
const allUsers = ref([])

const searchForm = reactive({
  userType: '',
  roomName: ''
})

const pagination = reactive({
  page: 1,
  pageSize: 8,
  total: 0
})

const roomForm = reactive({
  name: '',
  floor: '',
  area: '',
  status: '可用',
  description: ''
})

const roomFormRules = {
  name: [{ required: true, message: '请输入房屋名称', trigger: 'blur' }],
  floor: [{ required: true, message: '请输入楼层', trigger: 'blur' }],
  area: [
    { required: true, message: '请输入面积', trigger: 'blur' },
    { pattern: /^\d+(\.\d+)?$/, message: '请输入正确的面积', trigger: 'blur' }
  ]
}

// 模拟房屋数据
const mockRooms = [
  {
    id: 1,
    name: 'A栋-101',
    floor: '1楼',
    area: '120',
    status: '可用',
    description: '会议室',
    authorizedUsers: [
      { id: 1, name: '张三', key: 1, label: '张三 - 技术部' },
      { id: 2, name: '李四', key: 2, label: '李四 - 产品部' }
    ]
  },
  {
    id: 2,
    name: 'A栋-102',
    floor: '1楼',
    area: '80',
    status: '可用',
    description: '办公室',
    authorizedUsers: [
      { id: 3, name: '王五', key: 3, label: '王五 - 运营部' }
    ]
  },
  {
    id: 3,
    name: 'B栋-201',
    floor: '2楼',
    area: '150',
    status: '维修中',
    description: '大型会议室',
    authorizedUsers: []
  },
  {
    id: 4,
    name: 'B栋-202',
    floor: '2楼',
    area: '90',
    status: '可用',
    description: '休息室',
    authorizedUsers: [
      { id: 4, name: '赵六', key: 4, label: '赵六 - 财务部' },
      { id: 5, name: '钱七', key: 5, label: '钱七 - 人事部' }
    ]
  }
]

// 模拟所有用户数据
const mockAllUsers = [
  { key: 1, label: '张三 - 技术部', disabled: false },
  { key: 2, label: '李四 - 产品部', disabled: false },
  { key: 3, label: '王五 - 运营部', disabled: false },
  { key: 4, label: '赵六 - 财务部', disabled: false },
  { key: 5, label: '钱七 - 人事部', disabled: false },
  { key: 6, label: '孙八 - 技术部', disabled: false },
  { key: 7, label: '周九 - 产品部', disabled: false },
  { key: 8, label: '吴十 - 运营部', disabled: false }
]

// 获取房屋列表
const fetchRoomsList = async () => {
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    roomsList.value = mockRooms
    pagination.total = mockRooms.length
  } catch (error) {
    ElMessage.error('获取房屋列表失败')
  }
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  fetchRoomsList()
}

// 房屋卡片点击
const handleRoomClick = (room) => {
  // 可以跳转到房屋详情或其他操作
  console.log('点击房屋:', room)
}

// 房屋操作
const handleRoomAction = (command, room) => {
  switch (command) {
    case 'edit':
      handleEdit(room)
      break
    case 'assign':
      handleAssign(room)
      break
    case 'delete':
      handleDelete(room)
      break
  }
}

// 新增房屋
const handleAdd = () => {
  isEdit.value = false
  roomDialogTitle.value = '新增房屋'
  resetRoomForm()
  roomDialogVisible.value = true
}

// 编辑房屋
const handleEdit = (room) => {
  isEdit.value = true
  roomDialogTitle.value = '编辑房屋'
  currentRoom.value = room
  Object.keys(roomForm).forEach(key => {
    roomForm[key] = room[key] || ''
  })
  roomDialogVisible.value = true
}

// 分配权限
const handleAssign = (room) => {
  selectedRoom.value = room
  allUsers.value = mockAllUsers
  assignedUsers.value = room.authorizedUsers?.map(user => user.key) || []
  assignDialogVisible.value = true
}

// 批量分配权限
const handleBatchAssign = () => {
  ElMessage.info('批量分配权限功能')
}

// 删除房屋
const handleDelete = async (room) => {
  try {
    await ElMessageBox.confirm(`确定要删除房屋 ${room.name} 吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    ElMessage.success('删除成功')
    fetchRoomsList()
  } catch (error) {
    // 用户取消
  }
}

// 提交房屋表单
const handleRoomSubmit = async () => {
  try {
    await roomFormRef.value.validate()
    
    if (isEdit.value) {
      ElMessage.success('更新成功')
    } else {
      ElMessage.success('创建成功')
    }
    
    roomDialogVisible.value = false
    fetchRoomsList()
  } catch (error) {
    // 表单验证失败
  }
}

// 提交权限分配
const handleAssignSubmit = () => {
  ElMessage.success('权限分配成功')
  assignDialogVisible.value = false
  fetchRoomsList()
}

// 关闭房屋弹窗
const handleRoomDialogClose = () => {
  resetRoomForm()
  roomFormRef.value?.clearValidate()
}

// 重置房屋表单
const resetRoomForm = () => {
  Object.keys(roomForm).forEach(key => {
    roomForm[key] = key === 'status' ? '可用' : ''
  })
}

// 分页处理
const handleSizeChange = (val) => {
  pagination.pageSize = val
  pagination.page = 1
  fetchRoomsList()
}

const handleCurrentChange = (val) => {
  pagination.page = val
  fetchRoomsList()
}

onMounted(() => {
  fetchRoomsList()
})
</script>

<style scoped lang="scss">
.room-manage {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    h3 {
      margin: 0;
      color: #333;
    }
    
    .header-actions {
      display: flex;
      gap: 12px;
    }
  }
  
  .search-area {
    margin-bottom: 20px;
    padding: 20px;
    background: #fafafa;
    border-radius: 4px;
  }
  
  .rooms-grid {
    margin-bottom: 20px;
    
    .room-col {
      margin-bottom: 20px;
    }
    
    .room-card {
      height: 240px;
      cursor: pointer;
      transition: all 0.3s;
      
      &:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transform: translateY(-2px);
      }
      
      :deep(.el-card__body) {
        padding: 16px;
        height: 100%;
        display: flex;
        flex-direction: column;
      }
      
      .room-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
        
        .room-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          
          .el-icon {
            color: white;
            font-size: 20px;
          }
        }
      }
      
      .room-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        
        .room-name {
          margin: 0 0 12px 0;
          font-size: 16px;
          font-weight: 600;
          color: #333;
        }
        
        .room-info {
          margin-bottom: 16px;
          
          .info-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            font-size: 14px;
            
            .label {
              color: #666;
            }
            
            .value {
              color: #333;
              font-weight: 500;
            }
          }
        }
        
        .room-users {
          margin-top: auto;
          
          .users-header {
            font-size: 12px;
            color: #666;
            margin-bottom: 8px;
          }
          
          .users-list {
            display: flex;
            align-items: center;
            gap: 8px;
            
            .more-users {
              font-size: 12px;
              color: #999;
            }
          }
        }
      }
    }
  }
  
  .pagination {
    display: flex;
    justify-content: center;
  }
  
  .assign-content {
    .selected-room {
      margin-bottom: 20px;
      padding: 16px;
      background: #f9f9f9;
      border-radius: 4px;
      
      h4 {
        margin: 0 0 4px 0;
        color: #333;
      }
      
      p {
        margin: 0;
        color: #666;
        font-size: 14px;
      }
    }
  }
}
</style>