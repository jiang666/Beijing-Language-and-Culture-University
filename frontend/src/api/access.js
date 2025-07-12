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

// 获取通行记录列表
export const getAccessRecords = (params) => {
  const mockRecords = [
    {
      id: 1,
      name: '张三',
      gender: '男',
      workId: '12315461',
      phone: '13111111131',
      openMethod: '人脸识别',
      accessType: '进入',
      accessTime: '2024.06.27 10:23:23',
      location: 'A栋1楼大门',
      status: '正常'
    },
    {
      id: 2,
      name: '李四',
      gender: '女',
      workId: '12315462',
      phone: '13111111132',
      openMethod: '刷卡',
      accessType: '离开',
      accessTime: '2024.06.27 10:23:23',
      location: 'A栋1楼大门',
      status: '正常'
    },
    {
      id: 3,
      name: '王五',
      gender: '男',
      workId: '12315463',
      phone: '13111111133',
      openMethod: '人脸识别',
      accessType: '进入',
      accessTime: '2024.06.27 10:23:23',
      location: 'B栋1楼大门',
      status: '异常'
    },
    {
      id: 4,
      name: '赵六',
      gender: '男',
      workId: '12315464',
      phone: '13111111134',
      openMethod: '密码',
      accessType: '进入',
      accessTime: '2024.06.27 10:23:23',
      location: 'A栋2楼门禁',
      status: '正常'
    },
    {
      id: 5,
      name: '钱七',
      gender: '女',
      workId: '12315465',
      phone: '13111111135',
      openMethod: '刷卡',
      accessType: '离开',
      accessTime: '2024.06.27 10:23:23',
      location: 'B栋2楼门禁',
      status: '正常'
    }
  ]

  return mockApiResponse({
    list: mockRecords,
    total: mockRecords.length,
    page: params.page || 1,
    pageSize: params.pageSize || 10
  })
}

// 获取终端列表
export const getTerminals = (params) => {
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
    },
    {
      id: 4,
      name: '26#门禁',
      location: 'B栋2楼门禁',
      ip: '192.168.1.104',
      mac: '00:1B:44:11:3A:C0',
      version: 'v2.1.0',
      status: '在线',
      lastHeartbeat: '2024.07.12 14:29:58',
      installTime: '2024.01.15 10:30:00',
      remark: ''
    },
    {
      id: 5,
      name: '27#门禁',
      location: 'C栋1楼大门',
      ip: '192.168.1.105',
      mac: '00:1B:44:11:3A:C1',
      version: 'v2.1.0',
      status: '故障',
      lastHeartbeat: '2024.07.12 08:20:15',
      installTime: '2024.01.15 11:00:00',
      remark: '读卡器故障'
    }
  ]

  return mockApiResponse({
    list: mockTerminals,
    total: mockTerminals.length,
    page: params.page || 1,
    pageSize: params.pageSize || 10
  })
}

// 创建终端
export const createTerminal = (data) => {
  return mockApiResponse({
    id: Date.now(),
    ...data,
    installTime: new Date().toLocaleString(),
    lastHeartbeat: new Date().toLocaleString()
  })
}

// 更新终端
export const updateTerminal = (id, data) => {
  return mockApiResponse({
    id,
    ...data,
    updateTime: new Date().toLocaleString()
  })
}

// 删除终端
export const deleteTerminal = (id) => {
  return mockApiResponse({ id })
}

// 重启终端
export const rebootTerminal = (id) => {
  return mockApiResponse({ 
    id,
    message: '重启命令已发送',
    timestamp: new Date().toLocaleString()
  })
}

// 获取终端状态统计
export const getTerminalStats = () => {
  return mockApiResponse({
    total: 25,
    online: 20,
    offline: 3,
    fault: 2,
    onlineRate: '80%'
  })
}

// 获取通行统计数据
export const getAccessStats = () => {
  return mockApiResponse({
    today: {
      total: 342,
      enter: 186,
      exit: 156,
      success: 335,
      failed: 7
    },
    thisWeek: {
      total: 2156,
      enter: 1078,
      exit: 1078,
      success: 2089,
      failed: 67
    },
    thisMonth: {
      total: 8965,
      enter: 4523,
      exit: 4442,
      success: 8758,
      failed: 207
    }
  })
}