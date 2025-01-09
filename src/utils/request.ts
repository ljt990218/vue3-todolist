import type { InternalAxiosRequestConfig } from 'axios'
import router from '@/router'
import { STORAGE_TOKEN_KEY } from '@/stores/mutation-type'
import { i18n } from '@/utils/i18n'
import { localStorage } from '@/utils/local-storage'
import axios from 'axios'
import { showConfirmDialog } from 'vant'

export const REQUEST_TOKEN_KEY = 'token'

const { t } = i18n.global

// 定义 API 响应的接口
interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

// 创建 axios 实例
const request = axios.create({
  baseURL: import.meta.env.VITE_APP_API_BASE_URL,
  timeout: 6000,
})

// 异常拦截处理器
function errorHandler(error: any): Promise<any> {
  const responseData: ApiResponse<any> = error.response.data
  const { code } = responseData

  // 401 403 未登录 无权限
  if (code === 401 || code === 403) {
    showConfirmDialog({
      title: t('login.notLogged'),
      message: t('login.goLoginExp'),
      confirmButtonText: t('login.goLogin'),
      cancelButtonText: t('login.lookFirst'),
    })
      .then(() => {
        router.replace('/login')
      })
      .catch(() => {
        // on cancel
      })
  }

  return Promise.reject(error)
}

// 请求拦截器
function requestHandler(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig> {
  const savedToken = localStorage.get(STORAGE_TOKEN_KEY)
  // 如果 token 存在
  if (savedToken) {
    config.headers[REQUEST_TOKEN_KEY] = savedToken
  }

  return config
}

// 响应拦截器
function responseHandler(response: ApiResponse<any>) {
  const { code } = response.data
  // 401 403 未登录 无权限
  if (code === 401 || code === 403) {
    showConfirmDialog({
      title: t('login.notLogged'),
      message: t('login.goLoginExp'),
      confirmButtonText: t('login.goLogin'),
      cancelButtonText: t('login.lookFirst'),
    })
      .then(() => {
        router.replace('/login')
      })
      .catch(() => {
        // on cancel
      })
  }

  return response.data
}

// Add a request interceptor
request.interceptors.request.use(requestHandler, errorHandler)

// Add a response interceptor
request.interceptors.response.use(response => responseHandler(response as unknown as ApiResponse<any>), errorHandler)

export default request
