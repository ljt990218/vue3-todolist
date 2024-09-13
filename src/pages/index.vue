<script setup lang="ts">
import { closeToast, showLoadingToast, showSuccessToast, showToast } from 'vant'
import { addTodo, queryTodoList } from '@/api'

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

function addTodoFun() {
  if (!todoValue.value) {
    todoValueError.value = true
    return
  }

  createBtnLoading.value = true
  addTodo({
    todo: todoValue.value,
  }).then(({ code, data, message }) => {
    if (code === 200) {
      showSuccessToast('添加成功')
      todoList.value.push({
        id: data.id,
        todo: todoValue.value,
        checked: false,
      })
      todoValue.value = ''
      createShow.value = false
    }
    else {
      showToast(message)
    }
  })
}

watch(todoValue, (val) => {
  if (val)
    todoValueError.value = false
})
</script>

<template>
  <div class="pt-16">
    <div class="px-16 pb-80">
      <div v-for="item in todoList" :key="item.id" class="todo mt-10 rounded-8 py-16 pl-8 shadow-sm">
        <van-checkbox v-model="item.checked">
          {{ item.todo }}
        </van-checkbox>
      </div>
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

        <van-field v-model="todoValue" :border="false" :clearable="true" :error="todoValueError" class="my-20 bg-#F7F8FA!" label="Todo" placeholder="Input Todo..." />

        <div class="flex justify-between">
          <div />
          <van-button :loading="createBtnLoading" type="primary" loading-text="Add ..." round native-type="submit" @click="addTodoFun">
            Add
          </van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<style lang="less" scoped>
.todo {
  background: var(--van-background-2);
}
.todo:first-child {
  margin-top: 0;
}
</style>
