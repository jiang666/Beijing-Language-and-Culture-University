<template>
  <div class="user-manage">
    <el-card>
      <template #header>
        <div class="card-header">
          <h3>用户管理</h3>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            新增用户
          </el-button>
        </div>
      </template>
      
      <div class="page-content">
        <!-- 左侧组织架构 -->
        <div class="left-panel">
          <div class="panel-header">
            <h4>组织架构</h4>
          </div>
          <div class="org-tree">
            <el-tree
              :data="orgData"
              :props="{ children: 'children', label: 'label' }"
              node-key="id"
              :expand-on-click-node="false"
              @node-click="handleOrgClick"
            />
          </div>
        </div>
        
        <!-- 右侧用户列表 -->
        <div class="right-panel">
          <!-- 搜索区域 -->
          <div class="search-area">
            <el-form :model="searchForm" :inline="true">
              <el-form-item label="姓名">
                <el-input
                  v-model="searchForm.name"
                  placeholder="请输入姓名"
                  clearable
                />
              </el-form-item>
              <el-form-item label="手机号">
                <el-input
                  v-model="searchForm.phone"
                  placeholder="请输入手机号"
                  clearable
                />
              </el-form-item>
              <el-form-item label="工号">
                <el-input
                  v-model="searchForm.workId"
                  placeholder="请输入工号"
                  clearable
                />
              </el-form-item>
              <el-form-item label="账号状态">
                <el-select v-model="searchForm.status" placeholder="全部" clearable>
                  <el-option label="全部" value="" />
                  <el-option label="正常" value="正常" />
                  <el-option label="停用" value="停用" />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="handleSearch">搜索</el-button>
                <el-button @click="handleReset">重置</el-button>
              </el-form-item>
            </el-form>
          </div>
          
          <!-- 用户列表 -->
          <div class="table-area">
            <el-table
              :data="userList"
              style="width: 100%"
              v-loading="loading"
            >
              <el-table-column prop="name" label="姓名" width="100" />
              <el-table-column prop="gender" label="性别" width="80" />
              <el-table-column prop="phone" label="手机号" width="130" />
              <el-table-column prop="workId" label="工号" width="120" />
              <el-table-column prop="department" label="部门" width="120" />
              <el-table-column prop="position" label="职位" width="120" />
              <el-table-column label="状态" width="100">
                <template #default="{ row }">
                  <el-tag :type="row.status === '正常' ? 'success' : 'danger'">
                    {{ row.status }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="createTime" label="创建时间" width="160" />
              <el-table-column label="操作" width="150" fixed="right">
                <template #default="{ row }">
                  <el-button type="primary" link @click="handleEdit(row)">
                    编辑
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
        </div>
      </div>
    </el-card>
    
    <!-- 用户表单弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      @close="handleDialogClose"
    >
      <el-form
        ref="userFormRef"
        :model="userForm"
        :rules="userFormRules"
        label-width="80px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="userForm.name" placeholder="请输入姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别" prop="gender">
              <el-select v-model="userForm.gender" placeholder="请选择性别">
                <el-option label="男" value="男" />
                <el-option label="女" value="女" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="userForm.phone" placeholder="请输入手机号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工号" prop="workId">
              <el-input v-model="userForm.workId" placeholder="请输入工号" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="部门" prop="department">
              <el-select v-model="userForm.department" placeholder="请选择部门">
                <el-option label="技术部" value="技术部" />
                <el-option label="产品部" value="产品部" />
                <el-option label="运营部" value="运营部" />
                <el-option label="财务部" value="财务部" />
                <el-option label="人事部" value="人事部" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="职位" prop="position">
              <el-input v-model="userForm.position" placeholder="请输入职位" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="userForm.status">
            <el-radio label="正常">正常</el-radio>
            <el-radio label="停用">停用</el-radio>
          </el-radio-group>
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
const userList = ref([])
const orgData = ref([])
const dialogVisible = ref(false)
const dialogTitle = ref('')
const isEdit = ref(false)
const currentUser = ref(null)
const userFormRef = ref()

const searchForm = reactive({
  name: '',
  phone: '',
  workId: '',
  status: ''
})

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const userForm = reactive({
  name: '',
  gender: '',
  phone: '',
  workId: '',
  department: '',
  position: '',
  status: '正常'
})

const userFormRules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  workId: [{ required: true, message: '请输入工号', trigger: 'blur' }],
  department: [{ required: true, message: '请选择部门', trigger: 'change' }],
  position: [{ required: true, message: '请输入职位', trigger: 'blur' }]
}

// 模拟用户数据
const mockUsers = [
  {
    id: 1,
    name: '张三',
    gender: '男',
    phone: '13111111131',
    workId: '12315461',
    department: '技术部',
    position: '开发工程师',
    status: '正常',
    createTime: '2024.06.27 10:23:23'
  },
  {
    id: 2,
    name: '李四',
    gender: '女',
    phone: '13111111132',
    workId: '12315462',
    department: '产品部',
    position: '产品经理',
    status: '正常',
    createTime: '2024.06.27 10:23:23'
  },
  {
    id: 3,
    name: '王五',
    gender: '男',
    phone: '13111111133',
    workId: '12315463',
    department: '运营部',
    position: '运营专员',
    status: '停用',
    createTime: '2024.06.27 10:23:23'
  }
]

// 模拟组织架构数据
const mockOrgData = [
  {
    id: 1,
    label: '公司总部',
    children: [
      {
        id: 2,
        label: '技术部',
        children: [
          { id: 3, label: '前端组' },
          { id: 4, label: '后端组' },
          { id: 5, label: '测试组' }
        ]
      },
      {
        id: 6,
        label: '产品部',
        children: [
          { id: 7, label: '产品一组' },
          { id: 8, label: '产品二组' }
        ]
      },
      {
        id: 9,
        label: '运营部'
      }
    ]
  }
]

// 获取用户列表
const fetchUserList = async () => {
  try {
    loading.value = true
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    userList.value = mockUsers
    pagination.total = mockUsers.length
  } catch (error) {
    ElMessage.error('获取用户列表失败')
  } finally {
    loading.value = false
  }
}

// 获取组织架构
const fetchOrgData = async () => {
  try {
    orgData.value = mockOrgData
  } catch (error) {
    ElMessage.error('获取组织架构失败')
  }
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  fetchUserList()
}

// 重置
const handleReset = () => {
  Object.keys(searchForm).forEach(key => {
    searchForm[key] = ''
  })
  pagination.page = 1
  fetchUserList()
}

// 组织架构点击
const handleOrgClick = (data) => {
  if (data.label !== '公司总部') {
    searchForm.department = data.label.includes('组') ? '' : data.label
    handleSearch()
  }
}

// 新增用户
const handleAdd = () => {
  isEdit.value = false
  dialogTitle.value = '新增用户'
  resetUserForm()
  dialogVisible.value = true
}

// 编辑用户
const handleEdit = (row) => {
  isEdit.value = true
  dialogTitle.value = '编辑用户'
  currentUser.value = row
  Object.keys(userForm).forEach(key => {
    userForm[key] = row[key] || ''
  })
  dialogVisible.value = true
}

// 删除用户
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(`确定要删除用户 ${row.name} 吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    ElMessage.success('删除成功')
    fetchUserList()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

// 提交表单
const handleSubmit = async () => {
  try {
    await userFormRef.value.validate()
    
    if (isEdit.value) {
      ElMessage.success('更新成功')
    } else {
      ElMessage.success('创建成功')
    }
    
    dialogVisible.value = false
    fetchUserList()
  } catch (error) {
    if (error.message) {
      ElMessage.error(error.message)
    }
  }
}

// 关闭弹窗
const handleDialogClose = () => {
  resetUserForm()
  userFormRef.value?.clearValidate()
}

// 重置表单
const resetUserForm = () => {
  Object.keys(userForm).forEach(key => {
    userForm[key] = key === 'status' ? '正常' : ''
  })
}

// 分页相关
const handleSizeChange = (val) => {
  pagination.pageSize = val
  pagination.page = 1
  fetchUserList()
}

const handleCurrentChange = (val) => {
  pagination.page = val
  fetchUserList()
}

onMounted(() => {
  fetchUserList()
  fetchOrgData()
})
</script>

<style scoped lang="scss">
.user-manage {
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
      
      .org-tree {
        padding: 16px;
        height: 400px;
        overflow-y: auto;
      }
    }
    
    .right-panel {
      flex: 1;
      
      .search-area {
        margin-bottom: 20px;
        padding: 20px;
        background: #fafafa;
        border-radius: 4px;
      }
      
      .table-area {
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