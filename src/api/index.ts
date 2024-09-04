import request from '@/utils/request'

export async function queryTodoList(): Promise<any> {
  return request('/todolist')
}
