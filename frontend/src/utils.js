// utils.js: Common utility functions

/**
 * 格式化日期时间
 * @param {Date|string|number} date - 日期对象、日期字符串或时间戳
 * @param {string} format - 格式字符串，例如 'YYYY-MM-DD HH:mm:ss'
 * @returns {string} 格式化后的日期字符串
 */
export function formatDate(date, format = 'YYYY-MM-DD HH:mm:ss') {
    if (!date) return ''
    
    const d = new Date(date)
    if (isNaN(d.getTime())) return ''
    
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    const hours = String(d.getHours()).padStart(2, '0')
    const minutes = String(d.getMinutes()).padStart(2, '0')
    const seconds = String(d.getSeconds()).padStart(2, '0')
    
    return format
      .replace('YYYY', year)
      .replace('MM', month)
      .replace('DD', day)
      .replace('HH', hours)
      .replace('mm', minutes)
      .replace('ss', seconds)
  }
  
  /**
   * 计算两个日期之间的时间差
   * @param {Date|string|number} startDate - 开始日期
   * @param {Date|string|number} endDate - 结束日期
   * @returns {string} 格式化的时间差字符串（例如 "2小时5分钟30秒"）
   */
  export function calculateTimeDifference(startDate, endDate) {
    if (!startDate || !endDate) return ''
    
    const start = new Date(startDate)
    const end = new Date(endDate)
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return ''
    
    const diffMs = end - start
    if (diffMs < 0) return ''
    
    const seconds = Math.floor((diffMs / 1000) % 60)
    const minutes = Math.floor((diffMs / (1000 * 60)) % 60)
    const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24)
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    
    let result = ''
    if (days > 0) result += `${days}天`
    if (hours > 0) result += `${hours}小时`
    if (minutes > 0) result += `${minutes}分钟`
    if (seconds > 0) result += `${seconds}秒`
    
    return result || '0秒'
  }
  
  /**
   * 验证手机号格式
   * @param {string} phone - 手机号
   * @returns {boolean} 是否是有效的手机号
   */
  export function validatePhoneNumber(phone) {
    const regex = /^1[3-9]\d{9}$/
    return regex.test(phone)
  }
  
  /**
   * 验证工号格式
   * @param {string} employeeId - 工号
   * @returns {boolean} 是否是有效的工号
   */
  export function validateEmployeeId(employeeId) {
    const regex = /^[A-Za-z0-9]{3,10}$/
    return regex.test(employeeId)
  }
  
  /**
   * 生成唯一ID
   * @returns {string} 唯一ID
   */
  export function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5).toUpperCase()
  }
  
  /**
   * 导出数据到CSV文件
   * @param {Array} data - 要导出的数据数组
   * @param {string} filename - 文件名
   */
  export function exportToCSV(data, filename) {
    if (!data || !data.length) return
    
    // 获取所有列名
    const columns = Object.keys(data[0])
    
    // 创建CSV内容
    let csvContent = columns.join(',') + '\n'
    
    // 添加数据行
    data.forEach(item => {
      const row = columns.map(key => {
        // 处理包含逗号、引号或换行符的字段
        const cell = item[key] === null || item[key] === undefined ? '' : item[key].toString()
        if (cell.includes(',') || cell.includes('"') || cell.includes('\n')) {
          return `"${cell.replace(/"/g, '""')}"`
        }
        return cell
      })
      csvContent += row.join(',') + '\n'
    })
    
    // 创建Blob对象
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    
    // 创建下载链接
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename || 'export.csv')
    link.style.visibility = 'hidden'
    
    // 添加到文档并触发点击
    document.body.appendChild(link)
    link.click()
    
    // 清理
    document.body.removeChild(link)
  }
  
  /**
   * 深拷贝对象
   * @param {Object} obj - 要拷贝的对象
   * @returns {Object} 拷贝的对象
   */
  export function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') {
      return obj
    }
    
    if (Array.isArray(obj)) {
      return obj.map(item => deepClone(item))
    }
    
    const clonedObj = {}
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        clonedObj[key] = deepClone(obj[key])
      }
    }
    
    return clonedObj
  }