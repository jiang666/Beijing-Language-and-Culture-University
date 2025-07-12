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

// 获取房屋列表
export const getRoomList = (params) => {
  const mockRooms = [
    {
      id: 1,
      name: 'A栋-101',
      floor: '1楼',
      area: '120',
      status: '可用',
      description: '会议室',
      createTime: '2024.01.15 09:00:00',
      authorizedUsers: [
        { id: 1, name: '张三', department: '技术部' },
        { id: 2, name: '李四', department: '产品部' }
      ]
    },
    {
      id: 2,
      name: 'A栋-102',
      floor: '1楼',
      area: '80',
      status: '可用',
      description: '办公室',
      createTime: '2024.01.15 09:30:00',
      authorizedUsers: [
        { id: 3, name: '王五', department: '运营部' }
      ]
    },
    {
      id: 3,
      name: 'A栋-103',
      floor: '1楼',
      area: '95',
      status: '可用',
      description: '休息室',
      createTime: '2024.01.15 10:00:00',
      authorizedUsers: []
    },
    {
      id: 4,
      name: 'B栋-201',
      floor: '2楼',
      area: '150',
      status: '维修中',
      description: '大型会议室',
      createTime: '2024.01.15 10:30:00',
      authorizedUsers: []
    },
    {
      id: 5,
      name: 'B栋-202',
      floor: '2楼',
      area: '90',
      status: '可用',
      description: '培训室',
      createTime: '2024.01.15 11:00:00',
      authorizedUsers: [
        { id: 4, name: '赵六', department: '财务部' },
        { id: 5, name: '钱七', department: '人事部' },
        { id: 6, name: '孙八', department: '技术部' }
      ]
    },
    {
      id: 6,
      name: 'B栋-203',
      floor: '2楼',
      area: '75',
      status: '可用',
      description: '小型会议室',
      createTime: '2024.01.15 11:30:00',
      authorizedUsers: [
        { id: 7, name: '周九', department: '产品部' }
      ]
    },
    {
      id: 7,
      name: 'C栋-301',
      floor: '3楼',
      area: '200',
      status: '可用',
      description: '多功能厅',
      createTime: '2024.01.15 12:00:00',
      authorizedUsers: [
        { id: 8, name: '吴十', department: '运营部' },
        { id: 9, name: '郑十一', department: '财务部' }
      ]
    },
    {
      id: 8,
      name: 'C栋-302',
      floor: '3楼',
      area: '110',
      status: '停用',
      description: '档案室',
      createTime: '2024.01.15 12:30:00',
      authorizedUsers: []
    }
  ]

  // 根据搜索条件过滤
  let filteredRooms = mockRooms
  if (params.userType) {
    if (params.userType === '已收录') {
      filteredRooms = filteredRooms.filter(room => room.authorizedUsers.length > 0)
    } else if (params.userType === '未收录') {
      filteredRooms = filteredRooms.filter(room => room.authorizedUsers.length === 0)
    }
  }
  
  if (params.roomName) {
    filteredRooms = filteredRooms.filter(room => room.name.includes(params.roomName))
  }

  return mockApiResponse({
    list: filteredRooms,
    total: filteredRooms.length,
    page: params.page || 1,
    pageSize: params.pageSize || 8
  })
}

// 创建房屋
export const createRoom = (data) => {
  return mockApiResponse({
    id: Date.now(),
    ...data,
    createTime: new Date().toLocaleString(),
    authorizedUsers: []
  })
}

// 更新房屋
export const updateRoom = (id, data) => {
  return mockApiResponse({
    id,
    ...data,
    updateTime: new Date().toLocaleString()
  })
}

// 删除房屋
export const deleteRoom = (id) => {
  return mockApiResponse({ id })
}

// 分配房屋权限
export const assignRoomPermission = (roomId, userIds) => {
  return mockApiResponse({
    roomId,
    userIds,
    assignTime: new Date().toLocaleString()
  })
}

// 批量分配房屋权限
export const batchAssignRoomPermission = (assignments) => {
  return mockApiResponse({
    assignments,
    assignTime: new Date().toLocaleString(),
    successCount: assignments.length
  })
}

// 获取房屋权限用户列表
export const getRoomUsers = (roomId) => {
  const mockUsers = [
    { id: 1, name: '张三', department: '技术部', position: '开发工程师', phone: '13111111131' },
    { id: 2, name: '李四', department: '产品部', position: '产品经理', phone: '13111111132' },
    { id: 3, name: '王五', department: '运营部', position: '运营专员', phone: '13111111133' }
  ]

  return mockApiResponse(mockUsers)
}

// 移除房屋权限
export const removeRoomPermission = (roomId, userId) => {
  return mockApiResponse({
    roomId,
    userId,
    removeTime: new Date().toLocaleString()
  })
}

// 获取房屋统计信息
export const getRoomStats = () => {
  return mockApiResponse({
    total: 168,
    available: 145,
    maintenance: 15,
    disabled: 8,
    utilization: '86.3%',
    avgArea: '95.6'
  })
}

// 获取房屋使用记录
export const getRoomUsageRecords = (roomId, params) => {
  const mockRecords = [
    {
      id: 1,
      userName: '张三',
      department: '技术部',
      action: '进入',
      time: '2024.07.12 09:30:25',
      duration: '2小时30分钟'
    },
    {
      id: 2,
      userName: '李四',
      department: '产品部',
      action: '离开',
      time: '2024.07.12 11:45:12',
      duration: '1小时15分钟'
    },
    {
      id: 3,
      userName: '王五',
      department: '运营部',
      action: '进入',
      time: '2024.07.12 14:20:08',
      duration: '45分钟'
    }
  ]

  return mockApiResponse({
    list: mockRecords,
    total: mockRecords.length,
    page: params.page || 1,
    pageSize: params.pageSize || 10
  })
}