<script setup lang="ts">
import { closeToast, showLoadingToast, showSuccessToast, showToast } from 'vant'
import TodoList from './components/todoList.vue'
import { addTodo, queryTodoList } from '@/api/todo'

definePage({
  name: 'home',
  meta: {
    level: 1,
  },
})

showLoadingToast({
  message: 'load...',
  forbidClick: true,
})

const todoList = ref([])
function queryTodoListFun() {
  queryTodoList().then(({ code, data }) => {
    closeToast()

    if (code === 200 && data.count > 0) {
      data.todos.forEach((item) => {
        item.checked = false
        item.open = true
      })
      todoList.value = data.todos
    }
    else {
      // test todo
      todoList.value = [
        {
          id: 1,
          todo: 'test todo',
          checked: true,
        },
        {
          id: 2,
          todo: 'test todo2',
          checked: false,
        },
      ]
    }
  })
}
queryTodoListFun()

const createShow = ref(false)
const todoValue = ref('')
const createBtnLoading = ref(false)
const todoValueError = ref(false)

watch(todoValue, (val: any) => {
  if (val)
    todoValueError.value = false
})

function addTodoFun() {
  if (!todoValue.value) {
    todoValueError.value = true
    return
  }

  createBtnLoading.value = true
  addTodo({
    todo: todoValue.value,
  }).then(({ code, message }) => {
    if (code === 200) {
      showSuccessToast('添加成功')
      queryTodoListFun()
      todoValue.value = ''
      createShow.value = false
    }
    else {
      showToast(message)
    }
  })
}
</script>

<template>
  <div class="pt-16">
    <div class="px-16 pb-80">
      <TodoList :todo-list="todoList" />
    </div>

    <!-- 创建按钮 -->
    <div class="fixed bottom-70 right-20 h-48 w-48 flex rounded-[50%] bg-[var(--van-blue)] lh-36 shadow-base" @click="createShow = true">
      <van-icon class="m-auto" size="24" name="plus" color="#fff" />
    </div>

    <!-- 创建弹窗 -->
    <van-popup v-model:show="createShow" class="rounded-8 p-12">
      <div class="createShow">
        <div class="text-center text-22">
          Add Todo
        </div>

        <van-field v-model="todoValue" :border="false" :clearable="true" :error="todoValueError" :autofocus="true" class="my-20 bg-#F7F8FA!" label="Todo" placeholder="Input Todo..." />

        <div class="flex justify-between">
          <div />
          <van-button :loading="createBtnLoading" type="primary" loading-text="Adding ..." round native-type="submit" @click="addTodoFun">
            Add
          </van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>
