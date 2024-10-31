import request from '@/utils/request'

export async function queryTodoList(data: any): Promise<any> {
  return request.get('/todolist', { params: data })
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
