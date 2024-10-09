import request from '@/utils/request'

export async function queryTodoList(): Promise<any> {
  return request.get('/todolist')
}

export async function addTodo(data: any): Promise<any> {
  return request.post('/todolist', data)
}

export async function delTodo(id: any): Promise<any> {
  return request.delete(`/todolist/${id}`)
}

export async function updTodo(data: any): Promise<any> {
  return request.patch(`/todolist/${data.id}`, data)
}
