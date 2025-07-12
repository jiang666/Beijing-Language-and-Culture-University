<template>
  <el-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :title="isEdit ? '编辑预约' : '新增预约'"
    width="700px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
    >
      <el-tabs v-model="activeTab" class="form-tabs">
        <!-- 基本信息 -->
        <el-tab-pane label="基本信息" name="basic">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="预约人" prop="reservePerson">
                <el-input v-model="formData.reservePerson" placeholder="请输入预约人" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="其他人姓名" prop="otherPersons">
                <el-input v-model="formData.otherPersons" placeholder="【其他人姓名】权威宴请信用" />
              </el-form-item>
            </el-col>
          </el-row>
          
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="联系方式" prop="contact">
                <el-input v-model="formData.contact" placeholder="请输入联系方式" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="预约会议" prop="meetingType">
                <el-select v-model="formData.meetingType" placeholder="【集体人员会】权威宴请信用">
                  <el-option label="【集体人员会】权威宴请信用" value="group_banquet" />
                  <el-option label="部门会议" value="department_meeting" />
                  <el-option label="客户洽谈" value="client_meeting" />
                  <el-option label="培训会议" value="training_meeting" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-tab-pane>
        
        <!-- 其他信息 -->
        <el-tab-pane label="其他信息" name="other">
          <el-form-item label="宴用限选" prop="banquetRestriction">
            <el-input 
              v-model="formData.banquetRestriction" 
              placeholder="请选择宴用限选或输入限制条件"
              type="textarea"
              :rows="2"
            />
          </el-form-item>
          
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="参与人" prop="participants">
                <el-input-number 
                  v-model="formData.participants" 
                  :min="1" 
                  :max="100"
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
                  start-placeholder="请选择开始时间"
                  end-placeholder="请选择结束时间"
                  format="YYYY.MM.DD HH:mm"
                  value-format="YYYY.MM.DD HH:mm"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
          </el-row>
          
          <el-form-item label="宴会详情" prop="banquetDetails">
            <el-input 
              v-model="formData.banquetDetails" 
              placeholder="请输入宴会详细安排、特殊要求等信息"
              type="textarea"
              :rows="4"
            />
          </el-form-item>
        </el-tab-pane>
        
        <!-- 申批信息 -->
        <el-tab-pane label="申批信息" name="approval">
          <div class="approval-info">
            <el-alert
              title="请选择合适的审批人进行申请审核"
              type="info"
              :closable="false"
              show-icon
              style="margin-bottom: 20px;"
            />
            
            <el-form-item label="选择宴批人" prop="approver">
              <el-select v-model="formData.approver" placeholder="请选择审批人" style="width: 100%">
                <el-option label="张经理 - 部门主管" value="zhang_manager" />
                <el-option label="李总监 - 运营总监" value="li_director" />
                <el-option label="王部长 - 行政部长" value="wang_minister" />
                <el-option label="赵总裁 - 公司总裁" value="zhao_ceo" />
              </el-select>
            </el-form-item>
            
            <el-form-item label="紧急程度" prop="urgency">
              <el-radio-group v-model="formData.urgency">
                <el-radio label="normal">普通</el-radio>
                <el-radio label="urgent">紧急</el-radio>
                <el-radio label="very_urgent">非常紧急</el-radio>
              </el-radio-group>
            </el-form-item>
            
            <el-form-item label="申请理由" prop="reason">
              <el-input 
                v-model="formData.reason" 
                placeholder="请详细说明申请理由、重要性及必要性"
                type="textarea"
                :rows="4"
              />
            </el-form-item>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-form>
    
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">
          {{ isEdit ? '更新' : '提交' }}申请
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  modelValue: Boolean,
  reservation: Object
})

const emit = defineEmits(['update:modelValue', 'submit'])

const formRef = ref()
const activeTab = ref('basic')
const submitting = ref(false)

const isEdit = computed(() => !!props.reservation)

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
    { required: true, message: '请输入预约人', trigger: 'blur' }
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
    { required: true, message: '请输入申请理由', trigger: 'blur' },
    { min: 10, message: '申请理由至少需要10个字符', trigger: 'blur' }
  ]
}

// 监听预约数据变化，用于编辑模式
watch(() => props.reservation, (newVal) => {
  if (newVal && props.modelValue) {
    Object.keys(formData).forEach(key => {
      if (newVal[key] !== undefined) {
        formData[key] = newVal[key]
      }
    })
  }
}, { immediate: true })

// 监听弹窗显示状态
watch(() => props.modelValue, (newVal) => {
  if (newVal && !props.reservation) {
    resetForm()
  }
})

// 提交表单
const handleSubmit = async () => {
  try {
    await formRef.value.validate()
    submitting.value = true
    
    // 模拟提交
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    emit('submit', { ...formData })
    ElMessage.success(isEdit.value ? '预约信息已更新' : '预约申请已提交')
    handleCancel()
  } catch (error) {
    ElMessage.error('请检查表单信息')
  } finally {
    submitting.value = false
  }
}

// 取消
const handleCancel = () => {
  emit('update:modelValue', false)
}

// 关闭弹窗
const handleClose = () => {
  resetForm()
  activeTab.value = 'basic'
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
.form-tabs {
  .approval-info {
    .el-form-item {
      margin-bottom: 24px;
    }
  }
}

.dialog-footer {
  text-align: center;
  
  .el-button {
    min-width: 100px;
    margin: 0 8px;
  }
}
</style>