// Todo项目相关的接口定义
export interface TodoItem {
  id: number | string
  todo: string
  checked: boolean
  open?: boolean
  createDate: string
  state: number
  stateText: string
  updateDate: string
  userId: number
}

// API响应接口
export interface ApiResponse {
  code: number
  message: string
  data?: any
}

// Todo创建请求参数
export interface TodoPayload {
  todo: string
}

// 查询参数
export interface QueryParams {
  page: number
  pageSize: number
}
