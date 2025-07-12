<template>
  <div class="reservation-form">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      class="form-container"
    >
      <div class="form-section">
        <h4>基本信息</h4>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="预约人" prop="reservePerson">
              <el-input v-model="formData.reservePerson" placeholder="请输入预约人姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="其他人姓名" prop="otherPersons">
              <el-input v-model="formData.otherPersons" placeholder="多人用逗号分隔" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="联系方式" prop="contact">
              <el-input v-model="formData.contact" placeholder="请输入联系电话" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="预约会议" prop="meetingType">
              <el-select v-model="formData.meetingType" placeholder="请选择会议类型">
                <el-option label="【集体人员会】权威宴请信用" value="group_meeting" />
                <el-option label="部门会议" value="department_meeting" />
                <el-option label="客户洽谈" value="client_meeting" />
                <el-option label="培训会议" value="training_meeting" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      
      <div class="form-section">
        <h4>其他信息</h4>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="宴用限选" prop="banquetRestriction">
              <el-input 
                v-model="formData.banquetRestriction" 
                placeholder="请选择宴用限选条件或输入详细要求"
                type="textarea"
                :rows="3"
              />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="参与人" prop="participants">
              <el-input-number 
                v-model="formData.participants" 
                :min="1" 
                :max="100"
                placeholder="参与人数"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="使用时间" prop="usageTime">
              <el-date-picker
                v-model="formData.usageTime"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                format="YYYY-MM-DD HH:mm"
                value-format="YYYY-MM-DD HH:mm"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="宴会详情" prop="banquetDetails">
              <el-input 
                v-model="formData.banquetDetails" 
                placeholder="请输入宴会详细安排、菜单要求、特殊需求等信息"
                type="textarea"
                :rows="4"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      
      <div class="form-section">
        <h4>申批信息</h4>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="选择宴批人" prop="approver">
              <el-select v-model="formData.approver" placeholder="请选择审批人">
                <el-option label="张经理" value="zhang_manager" />
                <el-option label="李总监" value="li_director" />
                <el-option label="王部长" value="wang_minister" />
                <el-option label="赵总裁" value="zhao_ceo" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="紧急程度" prop="urgency">
              <el-select v-model="formData.urgency" placeholder="请选择紧急程度">
                <el-option label="普通" value="normal" />
                <el-option label="紧急" value="urgent" />
                <el-option label="非常紧急" value="very_urgent" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="申请理由" prop="reason">
              <el-input 
                v-model="formData.reason" 
                placeholder="请详细说明申请理由和重要性"
                type="textarea"
                :rows="3"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      
      <div class="form-actions">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">
          提交申请
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['submit', 'cancel'])

const formRef = ref()
const submitting = ref(false)

const formData = reactive({
  reservePerson: '',
  otherPersons: '',
  contact: '',
  meetingType: '',
  banquetRestriction: '',
  participants: 1,
  usageTime: [],
  banquetDetails: '',
  approver: '',
  urgency: 'normal',
  reason: ''
})

const formRules = {
  reservePerson: [
    { required: true, message: '请输入预约人姓名', trigger: 'blur' }
  ],
  contact: [
    { required: true, message: '请输入联系方式', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  meetingType: [
    { required: true, message: '请选择会议类型', trigger: 'change' }
  ],
  participants: [
    { required: true, message: '请输入参与人数', trigger: 'blur' }
  ],
  usageTime: [
    { required: true, message: '请选择使用时间', trigger: 'change' }
  ],
  approver: [
    { required: true, message: '请选择审批人', trigger: 'change' }
  ],
  reason: [
    { required: true, message: '请输入申请理由', trigger: 'blur' }
  ]
}

// 提交表单
const handleSubmit = async () => {
  try {
    await formRef.value.validate()
    submitting.value = true
    
    // 模拟提交
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    emit('submit', { ...formData })
    resetForm()
  } catch (error) {
    ElMessage.error('请检查表单信息')
  } finally {
    submitting.value = false
  }
}

// 取消
const handleCancel = () => {
  resetForm()
  emit('cancel')
}

// 重置表单
const resetForm = () => {
  formRef.value?.resetFields()
  Object.keys(formData).forEach(key => {
    if (key === 'participants') {
      formData[key] = 1
    } else if (key === 'urgency') {
      formData[key] = 'normal'
    } else if (key === 'usageTime') {
      formData[key] = []
    } else {
      formData[key] = ''
    }
  })
}
</script>

<style scoped lang="scss">
.reservation-form {
  .form-container {
    max-width: 800px;
    
    .form-section {
      margin-bottom: 32px;
      
      h4 {
        margin: 0 0 20px 0;
        padding: 0 0 8px 0;
        border-bottom: 2px solid #1890ff;
        color: #333;
        font-size: 16px;
        font-weight: 600;
      }
      
      .el-form-item {
        margin-bottom: 20px;
      }
    }
    
    .form-actions {
      padding-top: 20px;
      border-top: 1px solid #e8e8e8;
      text-align: center;
      
      .el-button {
        min-width: 100px;
        margin: 0 10px;
      }
    }
  }
}
</style>