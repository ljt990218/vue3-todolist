<script setup lang="ts">
import { closeToast, showLoadingToast } from 'vant'
import { queryTodoList } from '@/api'

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
</script>

<template>
  <div class="pt-46">
    <div class="px-16">
      <div v-for="item in todoList" :key="item.id" class="todo mt-10 rounded-8 py-16 pl-8">
        <van-checkbox v-model="item.checked">
          {{ item.todo }}
        </van-checkbox>
      </div>
    </div>

    <!-- 创建按钮 -->
    <div class="fixed bottom-60 right-20 h-48 w-48 flex rounded-[50%] bg-[var(--van-blue)] lh-36">
      <van-icon class="m-auto" size="24" name="plus" color="#fff" />
    </div>

    <!-- 创建弹窗 -->
    <van-popup v-model:show="createShow" class="rounded-8 p-12">
      <div class="createShow">
        <div class="text-center text-22">
          Add Todo
        </div>
        <van-field v-model="todoValue" class="bg-#F7F8FA" label="Todo" placeholder="Todo..." />
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
