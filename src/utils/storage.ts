/* 封装localStoarge和sessionStorage方法 */
let Storage = {
  // ==================sessionsTorage设置缓存================
  // 设置缓存
  sessionSet: function <T> (name: string, data: T) {
    sessionStorage.removeItem(name)
    sessionStorage.setItem(name, JSON.stringify(data))
  },
  // 获取缓存
  sessionGet: function (name: string) {
    if (sessionStorage.getItem(name)) {
      return JSON.parse(sessionStorage.getItem(name) || '')
    } else {
      return false
    }
  },
  // 清除缓存
  sessionRemove: function (name: string) {
    sessionStorage.removeItem(name)
  },
  // ==================localStorage设置缓存==================
  // 设置缓存
  localSet: function <T> (name: string, data: T) {
    localStorage.removeItem(name)
    localStorage.setItem(name, JSON.stringify(data))
  },
  // 获取缓存
  localGet: function (name: string) {
    if (localStorage.getItem(name)) {
      return JSON.parse(localStorage.getItem(name) || '')
    } else {
      return ''
    }
  },
  // 清除缓存
  localRemove: function (name: string) {
    localStorage.removeItem(name)
  }
}
export default Storage
