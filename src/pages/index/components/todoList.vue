<script setup lang="ts">
import { showConfirmDialog, showSuccessToast, showToast } from 'vant'
import { delTodo, updTodo } from '@/api/todo'

const props = defineProps(['todoList'])
const localTodoList = ref([...props.todoList])

watch(() => props.todoList, (newList) => {
  localTodoList.value = [...newList]
})

function editIconShow(index: number, status: boolean) {
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

const editPopupShow = ref(false)
const todoValue = ref('')
const editTodo = ref({}) as any
const editBtnLoading = ref(false)
const todoValueError = ref(false)

watch(todoValue, (val) => {
  if (val)
    todoValueError.value = false
})

function openEdit(item: any) {
  editTodo.value = item
  editPopupShow.value = true
  todoValue.value = item.todo
}

function editTodoFun() {
  editBtnLoading.value = true
  updTodo(editTodo.value).then(({ code, message }) => {
    editBtnLoading.value = false
    if (code === 200) {
      editPopupShow.value = false
      const index = localTodoList.value.findIndex(todo => todo.id === editTodo.value.id)
      if (index !== -1) {
        localTodoList.value[index].todo = editTodo.value.todo
      }
      showSuccessToast('修改成功')
    }
    else {
      showToast(message)
    }
  })
}
</script>

<template>
  <div v-for="(item, index) in localTodoList" :key="item.id" class="mt-10 flex items-center overflow-hidden rounded-8 bg-[var(--van-background-2)] shadow-sm first:mt-0" :style="{ backgroundColor: item.checked ? '#f0f0f0' : '' }">
    <van-swipe-cell class="w-full" @open="editIconShow(index, false)" @close="editIconShow(index, true)">
      <div class="flex items-center justify-between py-16 pl-8 pr-24">
        <van-checkbox v-model="item.checked">
          {{ item.todo }}
        </van-checkbox>
        <transition name="icon-fade">
          <div v-if="item.open" class="i-carbon:edit h-16 w-16" style="color: #999;" @click="openEdit(item)" />
        </transition>
      </div>
      <template #right>
        <van-button square type="danger" text="删除" class="h-52! lh-52!" @click="delTodoFun(item)" />
      </template>
    </van-swipe-cell>
  </div>

  <!-- 编辑弹窗 -->
  <van-popup v-model:show="editPopupShow" class="rounded-8 p-12">
    <div class="createShow">
      <div class="text-center text-22">
        Edit Todo
      </div>

      <van-field v-model="editTodo.todo" :border="false" :clearable="true" :error="todoValueError" :autofocus="true" class="my-20 bg-#F7F8FA!" label="Todo：" placeholder="Input Todo..." />

      <div class="flex justify-between">
        <div />
        <van-button :loading="editBtnLoading" type="primary" loading-text="Editing ..." round native-type="submit" @click="editTodoFun">
          Edit
        </van-button>
      </div>
    </div>
  </van-popup>
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
