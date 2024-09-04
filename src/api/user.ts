import request from '@/utils/request'

export interface LoginData {
  account: string
  password: string
}

export interface LoginRes {
  token: string
}

export function login(data: LoginData): Promise<any> {
  return request.post<LoginRes>('/auth/login', data)
}

export function register(data: LoginData): Promise<any> {
  return request.post('/auth/register', data)
}

export function getUserInfo(): Promise<any> {
  return request.get('/user')
}

export function logout(): Promise<any> {
  return request.post('/auth/logout')
}
