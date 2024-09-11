import request from '@/utils/request'

export async function queryTodoList(): Promise<any> {
  return request.get('/todolist')
}

export async function addTodo(data: any): Promise<any> {
  return request.post('/todolist', data)
}
