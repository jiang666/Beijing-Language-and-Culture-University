import request from './index'

// 模拟API响应
const mockApiResponse = (data, delay = 500) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        data: {
          code: 200,
          message: '操作成功',
          data: data
        }
      })
    }, delay)
  })
}

// 获取预约列表
export const getReservationList = (params) => {
  const mockReservations = [
    {
      id: 'R001',
      reservePerson: '张三',
      otherPersons: '李四,王五',
      contact: '13111111131',
      meetingType: 'group_banquet',
      roomName: '会议室A',
      purpose: '【集体人员会】权威宴请信用',
      reserveTime: '2024-07-15 14:00-16:00',
      duration: '2小时',
      participants: 8,
      status: 'approved',
      createTime: '2024-07-12 10:30:00',
      approveTime: '2024-07-12 15:20:00',
      approver: '张经理',
      urgency: 'normal',
      reason: '部门季度总结会议，需要邀请相关合作伙伴参加，讨论下季度合作计划',
      banquetRestriction: '素食为主，避免海鲜过敏',
      banquetDetails: '需要准备投影设备，茶水服务，预计用餐人数8人，要求环境安静适合商务洽谈'
    },
    {
      id: 'R002',
      reservePerson: '李四',
      otherPersons: '',
      contact: '13111111132',
      meetingType: 'training_meeting',
      roomName: '培训室',
      purpose: '员工培训',
      reserveTime: '2024-07-16 09:00-12:00',
      duration: '3小时',
      participants: 15,
      status: 'pending',
      createTime: '2024-07-12 11:20:00',
      approver: '李总监',
      urgency: 'urgent',
      reason: '新员工入职培训，急需安排，包含公司制度讲解和业务流程培训',
      banquetRestriction: '',
      banquetDetails: '需要准备培训资料，笔记本电脑，投影仪，白板，茶水和简单茶点'
    },
    {
      id: 'R003',
      reservePerson: '王五',
      otherPersons: '赵六',
      contact: '13111111133',
      meetingType: 'client_meeting',
      roomName: '会议室B',
      purpose: '客户洽谈',
      reserveTime: '2024-07-14 10:00-11:30',
      duration: '1.5小时',
      participants: 4,
      status: 'rejected',
      createTime: '2024-07-12 09:15:00',
      approveTime: '2024-07-12 14:30:00',
      approver: '王部长',
      urgency: 'normal',
      reason: '重要客户商务洽谈，讨论年度合作协议续签事宜',
      rejectReason: '该时间段已有其他重要会议安排，建议调整到下午时间',
      banquetRestriction: '不要太油腻的食物',
      banquetDetails: '商务接待标准，需要准备精美茶点，咖啡，商务礼品'
    },
    {
      id: 'R004',
      reservePerson: '赵六',
      otherPersons: '钱七,孙八',
      contact: '13111111134',
      meetingType: 'department_meeting',
      roomName: '会议室C',
      purpose: '月度总结会议',
      reserveTime: '2024-07-17 14:30-17:00',
      duration: '2.5小时',
      participants: 12,
      status: 'cancelled',
      createTime: '2024-07-11 16:45:00',
      approver: '赵总裁',
      urgency: 'normal',
      reason: '部门月度工作总结和下月计划讨论',
      banquetRestriction: '',
      banquetDetails: '需要准备会议资料，数据统计表，投影设备，茶水服务'
    }
  ]

  // 根据搜索条件过滤
  let filteredReservations = mockReservations
  if (params.reservePerson) {
    filteredReservations = filteredReservations.filter(item => 
      item.reservePerson.includes(params.reservePerson)
    )
  }
  if (params.roomId) {
    // 这里简化处理，实际应该根据roomId匹配
    filteredReservations = filteredReservations.filter(item => 
      item.roomName.includes(params.roomId)
    )
  }
  if (params.status) {
    filteredReservations = filteredReservations.filter(item => 
      item.status === params.status
    )
  }

  return mockApiResponse({
    list: filteredReservations,
    total: filteredReservations.length,
    page: params.page || 1,
    pageSize: params.pageSize || 10
  })
}

// 创建预约
export const createReservation = (data) => {
  return mockApiResponse({
    id: 'R' + Date.now().toString().slice(-3),
    ...data,
    status: 'pending',
    createTime: new Date().toLocaleString()
  })
}

// 更新预约
export const updateReservation = (id, data) => {
  return mockApiResponse({
    id,
    ...data,
    updateTime: new Date().toLocaleString()
  })
}

// 取消预约
export const cancelReservation = (id) => {
  return mockApiResponse({
    id,
    status: 'cancelled',
    cancelTime: new Date().toLocaleString()
  })
}

// 审批预约
export const approveReservation = (id, action, reason = '') => {
  return mockApiResponse({
    id,
    status: action, // 'approved' or 'rejected'
    approveTime: new Date().toLocaleString(),
    rejectReason: action === 'rejected' ? reason : undefined
  })
}

// 获取可用时间段
export const getAvailableTimeSlots = (date, roomId) => {
  const mockTimeSlots = [
    { id: 1, time: '08:00-09:00', available: true },
    { id: 2, time: '09:00-10:00', available: false }, // 已被预约
    { id: 3, time: '10:00-11:00', available: true },
    { id: 4, time: '11:00-12:00', available: true },
    { id: 5, time: '12:00-13:00', available: false }, // 午休时间
    { id: 6, time: '13:00-14:00', available: true },
    { id: 7, time: '14:00-15:00', available: false }, // 已被预约
    { id: 8, time: '15:00-16:00', available: true },
    { id: 9, time: '16:00-17:00', available: true },
    { id: 10, time: '17:00-18:00', available: true }
  ]

  return mockApiResponse(mockTimeSlots)
}

// 获取可预约房间列表
export const getAvailableRooms = () => {
  const mockRooms = [
    {
      id: 1,
      name: '会议室A',
      capacity: 10,
      equipment: ['投影仪', '白板', '音响'],
      available: true
    },
    {
      id: 2,
      name: '会议室B',
      capacity: 6,
      equipment: ['投影仪', '电视'],
      available: true
    },
    {
      id: 3,
      name: '培训室',
      capacity: 20,
      equipment: ['投影仪', '白板', '音响', '麦克风'],
      available: true
    },
    {
      id: 4,
      name: '会议室C',
      capacity: 15,
      equipment: ['投影仪', '白板'],
      available: false
    }
  ]

  return mockApiResponse(mockRooms)
}

// 获取审批人列表
export const getApprovers = () => {
  const mockApprovers = [
    {
      id: 1,
      name: '张经理',
      department: '技术部',
      level: 'manager',
      available: true
    },
    {
      id: 2,
      name: '李总监',
      department: '运营部',
      level: 'director',
      available: true
    },
    {
      id: 3,
      name: '王部长',
      department: '行政部',
      level: 'minister',
      available: false
    },
    {
      id: 4,
      name: '赵总裁',
      department: '总裁办',
      level: 'ceo',
      available: true
    }
  ]

  return mockApiResponse(mockApprovers)
}

// 获取预约统计数据
export const getReservationStats = () => {
  return mockApiResponse({
    total: 156,
    pending: 23,
    approved: 98,
    rejected: 15,
    cancelled: 20,
    thisMonth: {
      total: 45,
      approved: 32,
      pending: 8,
      rejected: 3,
      cancelled: 2
    },
    popularRooms: [
      { name: '会议室A', count: 28 },
      { name: '培训室', count: 24 },
      { name: '会议室B', count: 19 }
    ],
    peakHours: [
      { time: '09:00-10:00', count: 15 },
      { time: '14:00-15:00', count: 18 },
      { time: '15:00-16:00', count: 12 }
    ]
  })
}

// 批量操作预约
export const batchOperateReservations = (ids, operation) => {
  return mockApiResponse({
    successIds: ids,
    operation,
    operateTime: new Date().toLocaleString(),
    successCount: ids.length
  })
}