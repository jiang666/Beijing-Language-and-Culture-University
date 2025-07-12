<template>
  <div class="settings">
    <el-card>
      <template #header>
        <h3>系统设置</h3>
      </template>
      
      <el-tabs v-model="activeTab" class="settings-tabs">
        <!-- 基础设置 -->
        <el-tab-pane label="基础设置" name="basic">
          <el-form :model="basicSettings" label-width="120px" class="settings-form">
            <el-form-item label="系统名称">
              <el-input v-model="basicSettings.systemName" style="width: 300px;" />
            </el-form-item>
            
            <el-form-item label="系统版本">
              <el-input v-model="basicSettings.version" style="width: 300px;" readonly />
            </el-form-item>
            
            <el-form-item label="管理员邮箱">
              <el-input v-model="basicSettings.adminEmail" style="width: 300px;" />
            </el-form-item>
            
            <el-form-item label="系统描述">
              <el-input
                v-model="basicSettings.description"
                type="textarea"
                :rows="4"
                style="width: 500px;"
              />
            </el-form-item>
            
            <el-form-item>
              <el-button type="primary" @click="saveBasicSettings">保存设置</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        
        <!-- 门禁设置 -->
        <el-tab-pane label="门禁设置" name="access">
          <el-form :model="accessSettings" label-width="120px" class="settings-form">
            <el-form-item label="开门延时">
              <el-input-number 
                v-model="accessSettings.openDelay" 
                :min="1" 
                :max="10"
                style="width: 200px;"
              />
              <span class="unit">秒</span>
            </el-form-item>
            
            <el-form-item label="门禁超时">
              <el-input-number 
                v-model="accessSettings.timeout" 
                :min="5" 
                :max="60"
                style="width: 200px;"
              />
              <span class="unit">秒</span>
            </el-form-item>
            
            <el-form-item label="失败重试次数">
              <el-input-number 
                v-model="accessSettings.retryTimes" 
                :min="1" 
                :max="5"
                style="width: 200px;"
              />
              <span class="unit">次</span>
            </el-form-item>
            
            <el-form-item label="启用人脸识别">
              <el-switch v-model="accessSettings.enableFaceRecognition" />
            </el-form-item>
            
            <el-form-item label="启用刷卡功能">
              <el-switch v-model="accessSettings.enableCardReader" />
            </el-form-item>
            
            <el-form-item label="启用密码开门">
              <el-switch v-model="accessSettings.enablePassword" />
            </el-form-item>
            
            <el-form-item label="记录保存天数">
              <el-input-number 
                v-model="accessSettings.recordRetentionDays" 
                :min="30" 
                :max="365"
                style="width: 200px;"
              />
              <span class="unit">天</span>
            </el-form-item>
            
            <el-form-item>
              <el-button type="primary" @click="saveAccessSettings">保存设置</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        
        <!-- 安全设置 -->
        <el-tab-pane label="安全设置" name="security">
          <el-form :model="securitySettings" label-width="120px" class="settings-form">
            <el-form-item label="密码最小长度">
              <el-input-number 
                v-model="securitySettings.minPasswordLength" 
                :min="6" 
                :max="20"
                style="width: 200px;"
              />
              <span class="unit">位</span>
            </el-form-item>
            
            <el-form-item label="登录失败锁定">
              <el-switch v-model="securitySettings.enableLoginLock" />
            </el-form-item>
            
            <el-form-item label="失败次数限制" v-if="securitySettings.enableLoginLock">
              <el-input-number 
                v-model="securitySettings.maxLoginAttempts" 
                :min="3" 
                :max="10"
                style="width: 200px;"
              />
              <span class="unit">次</span>
            </el-form-item>
            
            <el-form-item label="锁定时间" v-if="securitySettings.enableLoginLock">
              <el-input-number 
                v-model="securitySettings.lockDuration" 
                :min="5" 
                :max="60"
                style="width: 200px;"
              />
              <span class="unit">分钟</span>
            </el-form-item>
            
            <el-form-item label="会话超时">
              <el-input-number 
                v-model="securitySettings.sessionTimeout" 
                :min="30" 
                :max="480"
                style="width: 200px;"
              />
              <span class="unit">分钟</span>
            </el-form-item>
            
            <el-form-item label="启用操作日志">
              <el-switch v-model="securitySettings.enableOperationLog" />
            </el-form-item>
            
            <el-form-item label="IP白名单">
              <el-input
                v-model="securitySettings.ipWhitelist"
                type="textarea"
                :rows="4"
                placeholder="每行一个IP地址或IP段，例如：192.168.1.0/24"
                style="width: 500px;"
              />
            </el-form-item>
            
            <el-form-item>
              <el-button type="primary" @click="saveSecuritySettings">保存设置</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        
        <!-- 通知设置 -->
        <el-tab-pane label="通知设置" name="notification">
          <el-form :model="notificationSettings" label-width="120px" class="settings-form">
            <el-form-item label="邮件通知">
              <el-switch v-model="notificationSettings.enableEmail" />
            </el-form-item>
            
            <div v-if="notificationSettings.enableEmail" class="email-settings">
              <el-form-item label="SMTP服务器">
                <el-input v-model="notificationSettings.smtpServer" style="width: 300px;" />
              </el-form-item>
              
              <el-form-item label="SMTP端口">
                <el-input-number v-model="notificationSettings.smtpPort" style="width: 200px;" />
              </el-form-item>
              
              <el-form-item label="发件人邮箱">
                <el-input v-model="notificationSettings.fromEmail" style="width: 300px;" />
              </el-form-item>
              
              <el-form-item label="邮箱密码">
                <el-input 
                  v-model="notificationSettings.emailPassword" 
                  type="password" 
                  show-password
                  style="width: 300px;" 
                />
              </el-form-item>
            </div>
            
            <el-form-item label="短信通知">
              <el-switch v-model="notificationSettings.enableSms" />
            </el-form-item>
            
            <el-form-item label="设备离线通知">
              <el-switch v-model="notificationSettings.deviceOfflineAlert" />
            </el-form-item>
            
            <el-form-item label="异常开门通知">
              <el-switch v-model="notificationSettings.abnormalAccessAlert" />
            </el-form-item>
            
            <el-form-item label="系统故障通知">
              <el-switch v-model="notificationSettings.systemErrorAlert" />
            </el-form-item>
            
            <el-form-item>
              <el-button type="primary" @click="saveNotificationSettings">保存设置</el-button>
              <el-button @click="testEmailNotification">测试邮件</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        
        <!-- 数据备份 -->
        <el-tab-pane label="数据备份" name="backup">
          <div class="backup-section">
            <el-form :model="backupSettings" label-width="120px" class="settings-form">
              <el-form-item label="自动备份">
                <el-switch v-model="backupSettings.enableAutoBackup" />
              </el-form-item>
              
              <el-form-item label="备份周期" v-if="backupSettings.enableAutoBackup">
                <el-select v-model="backupSettings.backupCycle" style="width: 200px;">
                  <el-option label="每天" value="daily" />
                  <el-option label="每周" value="weekly" />
                  <el-option label="每月" value="monthly" />
                </el-select>
              </el-form-item>
              
              <el-form-item label="备份时间" v-if="backupSettings.enableAutoBackup">
                <el-time-picker 
                  v-model="backupSettings.backupTime" 
                  format="HH:mm"
                  value-format="HH:mm"
                  style="width: 200px;"
                />
              </el-form-item>
              
              <el-form-item label="保留备份数">
                <el-input-number 
                  v-model="backupSettings.retainBackups" 
                  :min="1" 
                  :max="30"
                  style="width: 200px;"
                />
                <span class="unit">个</span>
              </el-form-item>
              
              <el-form-item>
                <el-button type="primary" @click="saveBackupSettings">保存设置</el-button>
              </el-form-item>
            </el-form>
            
            <el-divider />
            
            <div class="backup-actions">
              <h4>手动备份</h4>
              <p class="backup-desc">立即创建系统数据备份</p>
              <el-button type="success" @click="createBackup" :loading="backupLoading">
                <el-icon><Download /></el-icon>
                立即备份
              </el-button>
            </div>
            
            <el-divider />
            
            <div class="backup-list">
              <h4>备份历史</h4>
              <el-table :data="backupHistory" style="width: 100%">
                <el-table-column prop="filename" label="备份文件" />
                <el-table-column prop="size" label="文件大小" width="120" />
                <el-table-column prop="createTime" label="创建时间" width="180" />
                <el-table-column prop="type" label="备份类型" width="100">
                  <template #default="{ row }">
                    <el-tag :type="row.type === 'auto' ? 'primary' : 'success'" size="small">
                      {{ row.type === 'auto' ? '自动' : '手动' }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="150">
                  <template #default="{ row }">
                    <el-button type="primary" link @click="downloadBackup(row)">
                      下载
                    </el-button>
                    <el-button type="danger" link @click="deleteBackup(row)">
                      删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Download } from '@element-plus/icons-vue'

const activeTab = ref('basic')
const backupLoading = ref(false)

// 基础设置
const basicSettings = reactive({
  systemName: '门禁管理系统',
  version: 'v1.0.0',
  adminEmail: 'admin@company.com',
  description: '智能门禁管理系统，提供完整的门禁控制、人员管理、权限分配等功能。'
})

// 门禁设置
const accessSettings = reactive({
  openDelay: 3,
  timeout: 30,
  retryTimes: 3,
  enableFaceRecognition: true,
  enableCardReader: true,
  enablePassword: false,
  recordRetentionDays: 90
})

// 安全设置
const securitySettings = reactive({
  minPasswordLength: 8,
  enableLoginLock: true,
  maxLoginAttempts: 5,
  lockDuration: 15,
  sessionTimeout: 120,
  enableOperationLog: true,
  ipWhitelist: '192.168.1.0/24\n10.0.0.0/8'
})

// 通知设置
const notificationSettings = reactive({
  enableEmail: true,
  smtpServer: 'smtp.company.com',
  smtpPort: 587,
  fromEmail: 'system@company.com',
  emailPassword: '',
  enableSms: false,
  deviceOfflineAlert: true,
  abnormalAccessAlert: true,
  systemErrorAlert: true
})

// 备份设置
const backupSettings = reactive({
  enableAutoBackup: true,
  backupCycle: 'daily',
  backupTime: '02:00',
  retainBackups: 7
})

// 备份历史
const backupHistory = ref([
  {
    id: 1,
    filename: 'backup_20240712_020000.sql',
    size: '15.6 MB',
    createTime: '2024-07-12 02:00:00',
    type: 'auto'
  },
  {
    id: 2,
    filename: 'backup_20240711_020000.sql',
    size: '15.2 MB',
    createTime: '2024-07-11 02:00:00',
    type: 'auto'
  },
  {
    id: 3,
    filename: 'backup_20240710_143256.sql',
    size: '15.1 MB',
    createTime: '2024-07-10 14:32:56',
    type: 'manual'
  }
])

// 保存基础设置
const saveBasicSettings = () => {
  ElMessage.success('基础设置保存成功')
}

// 保存门禁设置
const saveAccessSettings = () => {
  ElMessage.success('门禁设置保存成功')
}

// 保存安全设置
const saveSecuritySettings = () => {
  ElMessage.success('安全设置保存成功')
}

// 保存通知设置
const saveNotificationSettings = () => {
  ElMessage.success('通知设置保存成功')
}

// 测试邮件通知
const testEmailNotification = () => {
  ElMessage.success('测试邮件已发送')
}

// 保存备份设置
const saveBackupSettings = () => {
  ElMessage.success('备份设置保存成功')
}

// 创建备份
const createBackup = async () => {
  try {
    backupLoading.value = true
    // 模拟备份过程
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const now = new Date()
    const timestamp = now.toISOString().replace(/[:-]/g, '').replace(/\..+/, '')
    const newBackup = {
      id: Date.now(),
      filename: `backup_${timestamp}.sql`,
      size: '15.8 MB',
      createTime: now.toLocaleString(),
      type: 'manual'
    }
    
    backupHistory.value.unshift(newBackup)
    ElMessage.success('备份创建成功')
  } catch (error) {
    ElMessage.error('备份创建失败')
  } finally {
    backupLoading.value = false
  }
}

// 下载备份
const downloadBackup = (backup) => {
  ElMessage.success(`正在下载 ${backup.filename}`)
}

// 删除备份
const deleteBackup = async (backup) => {
  try {
    await ElMessageBox.confirm(`确定要删除备份文件 ${backup.filename} 吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    const index = backupHistory.value.findIndex(item => item.id === backup.id)
    if (index > -1) {
      backupHistory.value.splice(index, 1)
    }
    
    ElMessage.success('备份文件删除成功')
  } catch {
    // 用户取消
  }
}

onMounted(() => {
  // 初始化设置数据
})
</script>

<style scoped lang="scss">
.settings {
  .settings-tabs {
    .settings-form {
      max-width: 800px;
      
      .unit {
        margin-left: 8px;
        color: #666;
        font-size: 14px;
      }
      
      .email-settings {
        border-left: 3px solid #409eff;
        padding-left: 20px;
        margin-left: 120px;
        margin-bottom: 20px;
      }
    }
  }
  
  .backup-section {
    .backup-actions {
      margin: 20px 0;
      
      h4 {
        margin: 0 0 8px 0;
        color: #333;
      }
      
      .backup-desc {
        margin: 0 0 16px 0;
        color: #666;
        font-size: 14px;
      }
    }
    
    .backup-list {
      h4 {
        margin: 0 0 16px 0;
        color: #333;
      }
    }
  }
}
</style>