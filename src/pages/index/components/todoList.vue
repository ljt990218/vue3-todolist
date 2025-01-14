<script setup lang="ts">
import type { ApiResponse, TodoItem } from '@/types'
import { delTodo, updTodo } from '@/api/todo'
import useAppStore from '@/stores/modules/app'
import { showConfirmDialog, showSuccessToast, showToast } from 'vant'

interface Props {
  todoList: TodoItem[]
}

const props = defineProps<Props>()
const appStore = useAppStore()
const localTodoList = ref<TodoItem[]>([...props.todoList])

const editPopupShow = ref<boolean>(false)
const selectTodoValue = ref<TodoItem | null>(null)
const editTodo = ref<TodoItem | null>(null)
const editBtnLoading = ref<boolean>(false)
const todoValueError = ref<boolean>(false)
const delBtnLoading = ref<boolean>(false)

watch(() => props.todoList, (newList) => {
  localTodoList.value = [...newList]
})

watch(selectTodoValue, (val) => {
  if (val)
    todoValueError.value = false
})

function openEdit(item: any) {
  editTodo.value = item
  editPopupShow.value = true
  selectTodoValue.value = item
}

function editIconShow(index: number, status: boolean) {
  localTodoList.value[index].open = status
}

function delTodoFun() {
  showConfirmDialog({
    title: '提示',
    message:
    `是否要删除'${selectTodoValue.value?.todo}'`,
  })
    .then(() => {
      delTodo(selectTodoValue.value?.id).then(({ code, message }) => {
        if (code === 200) {
          delBtnLoading.value = false
          editPopupShow.value = false

          // 删除item
          const index = localTodoList.value.findIndex(todo => todo.id === selectTodoValue.value?.id)
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

function editTodoFun() {
  if (!editTodo.value)
    return

  editBtnLoading.value = true

  updTodo(editTodo.value).then(({ code, message }: ApiResponse) => {
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
  }).catch((error: any) => {
    editBtnLoading.value = false
    showToast(error.message)
  })
}

function getItemBackgroundColor(checked: boolean) {
  if (checked) {
    return appStore.mode === 'dark' ? '#1c1c1e' : '#f0f0f0'
  }
  return appStore.mode === 'dark' ? '#161616' : '#fff'
}
</script>

<template>
  <div v-for="(item, index) in localTodoList" :key="item.id" class="mt-10 flex items-center overflow-hidden rounded-8 bg-[var(--van-background-2)] shadow-sm first:mt-0" :style="{ backgroundColor: getItemBackgroundColor(item.checked) }">
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

      <van-field v-model="editTodo.todo" :border="false" :clearable="true" :error="todoValueError" :autofocus="true" class="my-20" label="Todo：" placeholder="Input Todo..." />

      <div class="flex justify-end">
        <van-button :loading="delBtnLoading" type="warning" loading-text="Deling ..." round native-type="submit" @click="delTodoFun">
          Del
        </van-button>
        <div class="w-10" />
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

:deep(.van-swipe-cell__right) {
  right: -1px !important;
}
</style>
