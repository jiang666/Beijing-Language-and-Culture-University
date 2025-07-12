<template>
  <div class="time-selector">
    <div class="selector-container">
      <div class="date-section">
        <h4>选择日期</h4>
        <el-calendar v-model="selectedDate" class="calendar">
          <template #date-cell="{ data }">
            <div 
              class="calendar-cell"
              :class="{ 
                'is-selected': isSameDay(data.day, selectedDate),
                'is-disabled': isDateDisabled(data.day),
                'has-reservation': hasReservation(data.day)
              }"
              @click="selectDate(data.day)"
            >
              <div class="date-number">{{ data.day.getDate() }}</div>
              <div class="date-status" v-if="hasReservation(data.day)">
                <el-tag size="small" type="warning">有预约</el-tag>
              </div>
            </div>
          </template>
        </el-calendar>
      </div>
      
      <div class="time-section" v-if="selectedDate">
        <h4>选择时间段 - {{ formatDate(selectedDate) }}</h4>
        
        <div class="time-grid">
          <div 
            v-for="timeSlot in timeSlots" 
            :key="timeSlot.id"
            class="time-slot"
            :class="{ 
              'is-selected': selectedTimeSlot?.id === timeSlot.id,
              'is-disabled': timeSlot.disabled,
              'is-occupied': timeSlot.occupied
            }"
            @click="selectTimeSlot(timeSlot)"
          >
            <div class="time-range">{{ timeSlot.time }}</div>
            <div class="time-status">
              <span v-if="timeSlot.occupied" class="status-text occupied">已预约</span>
              <span v-else-if="timeSlot.disabled" class="status-text disabled">不可用</span>
              <span v-else class="status-text available">可预约</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="duration-section" v-if="selectedTimeSlot">
        <h4>选择使用时长</h4>
        <el-radio-group v-model="selectedDuration">
          <el-radio label="1">1小时</el-radio>
          <el-radio label="2">2小时</el-radio>
          <el-radio label="3">3小时</el-radio>
          <el-radio label="4">4小时</el-radio>
          <el-radio label="custom">自定义</el-radio>
        </el-radio-group>
        
        <div v-if="selectedDuration === 'custom'" class="custom-duration">
          <el-input-number 
            v-model="customDuration" 
            :min="0.5" 
            :max="8" 
            :step="0.5"
            :precision="1"
          />
          <span class="unit">小时</span>
        </div>
      </div>
      
      <div class="summary-section" v-if="selectedTimeSlot && selectedDuration">
        <h4>预约信息确认</h4>
        <div class="summary-card">
          <div class="summary-item">
            <span class="label">日期：</span>
            <span class="value">{{ formatDate(selectedDate) }}</span>
          </div>
          <div class="summary-item">
            <span class="label">时间：</span>
            <span class="value">{{ selectedTimeSlot.time }}</span>
          </div>
          <div class="summary-item">
            <span class="label">时长：</span>
            <span class="value">{{ getDurationText() }}</span>
          </div>
          <div class="summary-item">
            <span class="label">结束时间：</span>
            <span class="value">{{ getEndTime() }}</span>
          </div>
        </div>
        
        <div class="action-buttons">
          <el-button @click="resetSelection">重新选择</el-button>
          <el-button type="primary" @click="confirmSelection">确认选择</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import dayjs from 'dayjs'

const emit = defineEmits(['select'])

const selectedDate = ref(new Date())
const selectedTimeSlot = ref(null)
const selectedDuration = ref('2')
const customDuration = ref(1)

// 模拟已有预约数据
const existingReservations = ref([
  {
    date: '2024-07-15',
    timeSlots: ['09:00-10:00', '14:00-15:00']
  },
  {
    date: '2024-07-16',
    timeSlots: ['10:00-11:00', '15:00-16:00']
  }
])

// 时间段配置
const timeSlots = ref([
  { id: 1, time: '08:00-09:00', disabled: false, occupied: false },
  { id: 2, time: '09:00-10:00', disabled: false, occupied: false },
  { id: 3, time: '10:00-11:00', disabled: false, occupied: false },
  { id: 4, time: '11:00-12:00', disabled: false, occupied: false },
  { id: 5, time: '12:00-13:00', disabled: true, occupied: false }, // 午休时间
  { id: 6, time: '13:00-14:00', disabled: false, occupied: false },
  { id: 7, time: '14:00-15:00', disabled: false, occupied: false },
  { id: 8, time: '15:00-16:00', disabled: false, occupied: false },
  { id: 9, time: '16:00-17:00', disabled: false, occupied: false },
  { id: 10, time: '17:00-18:00', disabled: false, occupied: false }
])

// 格式化日期
const formatDate = (date) => {
  return dayjs(date).format('YYYY年MM月DD日 dddd')
}

// 判断是否为同一天
const isSameDay = (date1, date2) => {
  return dayjs(date1).isSame(dayjs(date2), 'day')
}

// 判断日期是否禁用
const isDateDisabled = (date) => {
  return dayjs(date).isBefore(dayjs(), 'day')
}

// 判断日期是否有预约
const hasReservation = (date) => {
  const dateStr = dayjs(date).format('YYYY-MM-DD')
  return existingReservations.value.some(res => res.date === dateStr)
}

// 选择日期
const selectDate = (date) => {
  if (isDateDisabled(date)) return
  selectedDate.value = date
  selectedTimeSlot.value = null
  updateTimeSlots()
}

// 更新时间段状态
const updateTimeSlots = () => {
  const dateStr = dayjs(selectedDate.value).format('YYYY-MM-DD')
  const reservation = existingReservations.value.find(res => res.date === dateStr)
  
  timeSlots.value.forEach(slot => {
    slot.occupied = reservation?.timeSlots.includes(slot.time) || false
  })
}

// 选择时间段
const selectTimeSlot = (timeSlot) => {
  if (timeSlot.disabled || timeSlot.occupied) return
  selectedTimeSlot.value = timeSlot
}

// 获取时长文本
const getDurationText = () => {
  if (selectedDuration.value === 'custom') {
    return `${customDuration.value}小时`
  }
  return `${selectedDuration.value}小时`
}

// 获取结束时间
const getEndTime = () => {
  if (!selectedTimeSlot.value || !selectedDuration.value) return ''
  
  const startTime = selectedTimeSlot.value.time.split('-')[0]
  const duration = selectedDuration.value === 'custom' ? customDuration.value : parseFloat(selectedDuration.value)
  
  const startDateTime = dayjs(`${dayjs(selectedDate.value).format('YYYY-MM-DD')} ${startTime}`)
  const endDateTime = startDateTime.add(duration, 'hour')
  
  return endDateTime.format('HH:mm')
}

// 重新选择
const resetSelection = () => {
  selectedDate.value = new Date()
  selectedTimeSlot.value = null
  selectedDuration.value = '2'
  customDuration.value = 1
}

// 确认选择
const confirmSelection = () => {
  const selectionData = {
    date: dayjs(selectedDate.value).format('YYYY-MM-DD'),
    time: selectedTimeSlot.value.time,
    duration: getDurationText(),
    endTime: getEndTime()
  }
  
  emit('select', selectionData)
  ElMessage.success('时间选择完成')
}

onMounted(() => {
  updateTimeSlots()
})
</script>

<style scoped lang="scss">
.time-selector {
  .selector-container {
    max-width: 1000px;
    
    .date-section,
    .time-section,
    .duration-section,
    .summary-section {
      margin-bottom: 32px;
      
      h4 {
        margin: 0 0 16px 0;
        color: #333;
        font-size: 16px;
        font-weight: 600;
        border-bottom: 2px solid #1890ff;
        padding-bottom: 8px;
      }
    }
    
    .calendar {
      :deep(.el-calendar-table) {
        .calendar-cell {
          min-height: 60px;
          padding: 8px;
          cursor: pointer;
          border-radius: 4px;
          transition: all 0.3s;
          
          &:hover:not(.is-disabled) {
            background-color: #f0f9ff;
          }
          
          &.is-selected {
            background-color: #e6f7ff;
            border: 2px solid #1890ff;
          }
          
          &.is-disabled {
            color: #ccc;
            cursor: not-allowed;
          }
          
          &.has-reservation .date-number {
            font-weight: bold;
          }
          
          .date-number {
            font-size: 16px;
            margin-bottom: 4px;
          }
          
          .date-status {
            font-size: 12px;
          }
        }
      }
    }
    
    .time-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 16px;
      
      .time-slot {
        padding: 16px;
        border: 1px solid #e8e8e8;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s;
        text-align: center;
        
        &:hover:not(.is-disabled):not(.is-occupied) {
          border-color: #1890ff;
          background-color: #f0f9ff;
        }
        
        &.is-selected {
          border-color: #1890ff;
          background-color: #e6f7ff;
        }
        
        &.is-disabled,
        &.is-occupied {
          cursor: not-allowed;
          opacity: 0.6;
        }
        
        .time-range {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 8px;
        }
        
        .status-text {
          font-size: 12px;
          
          &.available {
            color: #52c41a;
          }
          
          &.occupied {
            color: #ff4d4f;
          }
          
          &.disabled {
            color: #999;
          }
        }
      }
    }
    
    .duration-section {
      .custom-duration {
        margin-top: 16px;
        display: flex;
        align-items: center;
        gap: 8px;
        
        .unit {
          color: #666;
        }
      }
    }
    
    .summary-section {
      .summary-card {
        padding: 20px;
        background: #f9f9f9;
        border-radius: 8px;
        margin-bottom: 20px;
        
        .summary-item {
          display: flex;
          margin-bottom: 12px;
          
          &:last-child {
            margin-bottom: 0;
          }
          
          .label {
            min-width: 80px;
            color: #666;
            font-weight: 500;
          }
          
          .value {
            color: #333;
            font-weight: 600;
          }
        }
      }
      
      .action-buttons {
        text-align: center;
        
        .el-button {
          min-width: 120px;
          margin: 0 8px;
        }
      }
    }
  }
}
</style>