<template>
  <div class="access-terminals">
    <el-card>
      <template #header>
        <div class="card-header">
          <h3>终端信息</h3>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            新增终端
          </el-button>
        </div>
      </template>
      
      <!-- 搜索区域 -->
      <div class="search-area">
        <el-form :model="searchForm" :inline="true">
          <el-form-item label="终端名称">
            <el-input
              v-model="searchForm.name"
              placeholder="请输入终端名称"
              clearable
            />
          </el-form-item>
          <el-form-item label="安装位置">
            <el-input
              v-model="searchForm.location"
              placeholder="请输入安装位置"
              clearable
            />
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="searchForm.status" placeholder="全部" clearable>
              <el-option label="全部" value="" />
              <el-option label="在线" value="在线" />
              <el-option label="离线" value="离线" />
              <el-option label="故障" value="故障" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      
      <!-- 终端列表 -->
      <div class="terminals-table">
        <el-table
          :data="terminalsList"
          v-loading="loading"
          style="width: 100%"
        >
          <el-table-column prop="name" label="终端名称" width="120" />
          <el-table-column prop="location" label="安装位置" width="150" />
          <el-table-column prop="ip" label="IP地址" width="130" />
          <el-table-column prop="mac" label="MAC地址" width="150" />
          <el-table-column prop="version" label="版本号" width="100" />
          <el-table-column label="状态" width="100">
            <template #default="{ row }">
              <el-tag 
                :type="getStatusType(row.status)"
                :icon="getStatusIcon(row.status)"
              >
                {{ row.status }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="lastHeartbeat" label="最后心跳" width="160" />
          <el-table-column prop="installTime" label="安装时间" width="160" />
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="{ row }">
              <el-button type="primary" link @click="handleEdit(row)">
                编辑
              </el-button>
              <el-button 
                type="success" 
                link 
                @click="handleReboot(row)"
                :disabled="row.status === '离线'"
              >
                重启
              </el-button>
              <el-button type="danger" link @click="handleDelete(row)">
                删除
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
    </el-card>
    
    <!-- 终端表单弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      @close="handleDialogClose"
    >
      <el-form
        ref="terminalFormRef"
        :model="terminalForm"
        :rules="terminalFormRules"
        label-width="100px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="终端名称" prop="name">
              <el-input v-model="terminalForm.name" placeholder="请输入终端名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="安装位置" prop="location">
              <el-input v-model="terminalForm.location" placeholder="请输入安装位置" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="IP地址" prop="ip">
              <el-input v-model="terminalForm.ip" placeholder="请输入IP地址" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="MAC地址" prop="mac">
              <el-input v-model="terminalForm.mac" placeholder="请输入MAC地址" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="版本号" prop="version">
              <el-input v-model="terminalForm.version" placeholder="请输入版本号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-select v-model="terminalForm.status" placeholder="请选择状态">
                <el-option label="在线" value="在线" />
                <el-option label="离线" value="离线" />
                <el-option label="故障" value="故障" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-form-item label="备注">
          <el-input
            v-model="terminalForm.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入备注信息"
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

const loading = ref(false)
const terminalsList = ref([])
const dialogVisible = ref(false)
const dialogTitle = ref('')
const isEdit = ref(false)
const currentTerminal = ref(null)
const terminalFormRef = ref()

const searchForm = reactive({
  name: '',
  location: '',
  status: ''
})

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const terminalForm = reactive({
  name: '',
  location: '',
  ip: '',
  mac: '',
  version: '',
  status: '在线',
  remark: ''
})

const terminalFormRules = {
  name: [{ required: true, message: '请输入终端名称', trigger: 'blur' }],
  location: [{ required: true, message: '请输入安装位置', trigger: 'blur' }],
  ip: [
    { required: true, message: '请输入IP地址', trigger: 'blur' },
    { pattern: /^(\d{1,3}\.){3}\d{1,3}$/, message: '请输入正确的IP地址', trigger: 'blur' }
  ],
  mac: [
    { required: true, message: '请输入MAC地址', trigger: 'blur' },
    { pattern: /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/, message: '请输入正确的MAC地址', trigger: 'blur' }
  ],
  version: [{ required: true, message: '请输入版本号', trigger: 'blur' }]
}

// 模拟终端数据
const mockTerminals = [
  {
    id: 1,
    name: '23#门禁',
    location: 'A栋1楼大门',
    ip: '192.168.1.101',
    mac: '00:1B:44:11:3A:B7',
    version: 'v2.1.0',
    status: '在线',
    lastHeartbeat: '2024.07.12 14:30:25',
    installTime: '2024.01.15 09:00:00',
    remark: '主要通道门禁'
  },
  {
    id: 2,
    name: '24#门禁',
    location: 'A栋2楼门禁',
    ip: '192.168.1.102',
    mac: '00:1B:44:11:3A:B8',
    version: 'v2.1.0',
    status: '在线',
    lastHeartbeat: '2024.07.12 14:30:20',
    installTime: '2024.01.15 09:30:00',
    remark: ''
  },
  {
    id: 3,
    name: '25#门禁',
    location: 'B栋1楼大门',
    ip: '192.168.1.103',
    mac: '00:1B:44:11:3A:B9',
    version: 'v2.0.5',
    status: '离线',
    lastHeartbeat: '2024.07.12 10:15:30',
    installTime: '2024.01.15 10:00:00',
    remark: '需要检修'
  }
]

// 获取状态类型
const getStatusType = (status) => {
  const typeMap = {
    '在线': 'success',
    '离线': 'danger',
    '故障': 'warning'
  }
  return typeMap[status] || 'info'
}

// 获取状态图标
const getStatusIcon = (status) => {
  const iconMap = {
    '在线': 'CircleCheck',
    '离线': 'CircleClose',
    '故障': 'Warning'
  }
  return iconMap[status] || 'QuestionFilled'
}

// 获取终端列表
const fetchTerminalsList = async () => {
  try {
    loading.value = true
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    terminalsList.value = mockTerminals
    pagination.total = mockTerminals.length
  } catch (error) {
    ElMessage.error('获取终端列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  fetchTerminalsList()
}

// 重置
const handleReset = () => {
  Object.keys(searchForm).forEach(key => {
    searchForm[key] = ''
  })
  pagination.page = 1
  fetchTerminalsList()
}

// 新增终端
const handleAdd = () => {
  isEdit.value = false
  dialogTitle.value = '新增终端'
  resetTerminalForm()
  dialogVisible.value = true
}

// 编辑终端
const handleEdit = (row) => {
  isEdit.value = true
  dialogTitle.value = '编辑终端'
  currentTerminal.value = row
  Object.keys(terminalForm).forEach(key => {
    terminalForm[key] = row[key] || ''
  })
  dialogVisible.value = true
}

// 重启终端
const handleReboot = async (row) => {
  try {
    await ElMessageBox.confirm(`确定要重启终端 ${row.name} 吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    ElMessage.success('重启命令已发送')
  } catch (error) {
    // 用户取消
  }
}

// 删除终端
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(`确定要删除终端 ${row.name} 吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    ElMessage.success('删除成功')
    fetchTerminalsList()
  } catch (error) {
    // 用户取消
  }
}

// 提交表单
const handleSubmit = async () => {
  try {
    await terminalFormRef.value.validate()
    
    if (isEdit.value) {
      ElMessage.success('更新成功')
    } else {
      ElMessage.success('创建成功')
    }
    
    dialogVisible.value = false
    fetchTerminalsList()
  } catch (error) {
    // 表单验证失败
  }
}

// 关闭弹窗
const handleDialogClose = () => {
  resetTerminalForm()
  terminalFormRef.value?.clearValidate()
}

// 重置表单
const resetTerminalForm = () => {
  Object.keys(terminalForm).forEach(key => {
    terminalForm[key] = key === 'status' ? '在线' : ''
  })
}

// 分页处理
const handleSizeChange = (val) => {
  pagination.pageSize = val
  pagination.page = 1
  fetchTerminalsList()
}

const handleCurrentChange = (val) => {
  pagination.page = val
  fetchTerminalsList()
}

onMounted(() => {
  fetchTerminalsList()
})
</script>

<style scoped lang="scss">
.access-terminals {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    h3 {
      margin: 0;
      color: #333;
    }
  }
  
  .search-area {
    margin-bottom: 20px;
    padding: 20px;
    background: #fafafa;
    border-radius: 4px;
  }
  
  .terminals-table {
    .pagination {
      margin-top: 20px;
      display: flex;
      justify-content: center;
    }
  }
}
</style>