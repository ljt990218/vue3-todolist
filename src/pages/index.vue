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
queryTodoList().then(({ code, data }) => {
  closeToast()

  if (code === 200) {
    data.forEach((item) => {
      item.checked = false
    })

    todoList.value = data
  }
})
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
  </div>
</template>

<style lang="less" scoped>
.todo {
  background: var(--van-cell-background);
}
</style>
