<script setup lang="ts">
import { showConfirmDialog, showSuccessToast, showToast } from 'vant'
import { delTodo } from '@/api/todo'

const props = defineProps(['todoList'])
const localTodoList = ref([...props.todoList])

watch(() => props.todoList, (newList) => {
  localTodoList.value = [...newList]
})

function editShow(index: number, status: boolean) {
  localTodoList.value[index].open = status
}

function delTodoFun(item: any) {
  showConfirmDialog({
    title: '提示',
    message:
    `是否要删除'${item.todo}'`,
  })
    .then(() => {
      delTodo(item.id).then(({ code, message }) => {
        if (code === 200) {
          // 删除item
          const index = localTodoList.value.findIndex(todo => todo.id === item.id)
          if (index !== -1)
            localTodoList.value.splice(index, 1)
          showSuccessToast('删除成功')
        }
        else {
          showToast(message)
        }
      })
    })
}
</script>

<template>
  <div v-for="(item, index) in localTodoList" :key="item.id" class="mt-10 flex items-center overflow-hidden rounded-8 bg-[var(--van-background-2)] shadow-sm first:mt-0" :style="{ backgroundColor: item.checked ? '#f0f0f0' : '' }">
    <van-swipe-cell class="w-full" @open="editShow(index, false)" @close="editShow(index, true)">
      <div class="flex items-center justify-between py-16 pl-8 pr-24">
        <van-checkbox v-model="item.checked">
          {{ item.todo }}
        </van-checkbox>
        <transition name="icon-fade">
          <div v-if="item.open" class="i-carbon:edit h-16 w-16" style="color: #999;" />
        </transition>
      </div>
      <template #right>
        <van-button square type="danger" text="删除" class="h-52! lh-52!" @click="delTodoFun(item)" />
      </template>
    </van-swipe-cell>
  </div>
</template>

<style scoped>
.icon-fade-enter-active,
.icon-fade-leave-active {
  transition: opacity 0.5s ease;
}

.icon-fade-enter-from,
.icon-fade-leave-to {
  opacity: 0;
}
</style>
