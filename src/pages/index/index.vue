<script setup lang="ts">
import type { ApiResponse, TodoItem } from '@/types'
import { addTodo, delTodo, queryTodoList, updTodo } from '@/api/todo'
import { useScrollStateStore } from '@/stores'
import { closeToast, showConfirmDialog, showLoadingToast, showSuccessToast, showToast } from 'vant'
import TodoItemComponent from './components/TodoItem.vue'

const useScrollState = useScrollStateStore()

definePage({
  name: 'home',
})

showLoadingToast({
  message: 'load...',
  forbidClick: true,
})

const isLoading = ref<boolean>(false)
const page = ref<number>(1)
const pageSize = ref<number>(20)
const hasMore = ref<boolean>(true)
const todoList = ref<TodoItem[]>([])

function queryTodoListFun() {
  queryTodoList({ page: page.value, pageSize: pageSize.value }).then(({ code, data }: ApiResponse) => {
    closeToast()
    isLoading.value = false

    if (code === 200 && data.meta.total > 0) {
      data.todos.forEach((item) => {
        item.checked = false
        item.open = true
      })

      todoList.value = [...todoList.value, ...data.todos]
      hasMore.value = todoList.value.length < data.meta.total
    }
  })
}
queryTodoListFun()

function onRefresh() {
  showLoadingToast({
    message: 'load...',
    forbidClick: true,
  })

  page.value = 1
  todoList.value = []
  queryTodoListFun()
}

const createShow = ref<boolean>(false)
const todoValue = ref<any>('')
const createBtnLoading = ref<boolean>(false)
const todoValueError = ref<boolean>(false)

// 编辑弹窗相关状态
const editPopupShow = ref<boolean>(false)
const editTodo = ref<TodoItem | null>(null)
const editBtnLoading = ref<boolean>(false)
const editTodoValueError = ref<boolean>(false)
const delBtnLoading = ref<boolean>(false)

watch(todoValue, (val: any) => {
  if (val)
    todoValueError.value = false
})

watch(editTodo, (val) => {
  if (val && val.todo)
    editTodoValueError.value = false
}, { deep: true })

function addTodoFun() {
  if (!todoValue.value) {
    todoValueError.value = true
    return
  }

  createBtnLoading.value = true
  addTodo({
    todo: todoValue.value,
  }).then(({ code, message }) => {
    createBtnLoading.value = false

    if (code === 200) {
      showSuccessToast('添加成功')
      onRefresh() // 重新刷新获取最新数据
      todoValue.value = ''
      createShow.value = false
    }
    else {
      showToast(message)
    }
  })
}

// 处理编辑事件
function handleTodoEdit(todo: TodoItem) {
  editTodo.value = { ...todo }
  editPopupShow.value = true
}

// 处理删除事件
function handleTodoDelete(todo: TodoItem) {
  showConfirmDialog({
    title: '提示',
    message: `是否要删除'${todo.todo}'`,
  })
    .then(() => {
      delBtnLoading.value = true
      delTodo(todo.id).then(({ code, message }) => {
        delBtnLoading.value = false
        if (code === 200) {
          const index = todoList.value.findIndex(item => item.id === todo.id)
          if (index !== -1) {
            todoList.value.splice(index, 1)
          }
          showSuccessToast('删除成功')
        }
        else {
          showToast(message)
        }
      }).catch(() => {
        delBtnLoading.value = false
      })
    })
}

// 执行编辑操作
function editTodoFun() {
  if (!editTodo.value || !editTodo.value.todo.trim()) {
    editTodoValueError.value = true
    return
  }

  editBtnLoading.value = true

  updTodo(editTodo.value).then(({ code, message }: ApiResponse) => {
    editBtnLoading.value = false
    if (code === 200) {
      editPopupShow.value = false
      const index = todoList.value.findIndex(todo => todo.id === editTodo.value!.id)
      if (index !== -1) {
        todoList.value[index].todo = editTodo.value!.todo
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

// 从编辑弹窗中删除todo
function delTodoFromEdit() {
  if (!editTodo.value)
    return

  showConfirmDialog({
    title: '提示',
    message: `是否要删除'${editTodo.value.todo}'`,
  })
    .then(() => {
      delBtnLoading.value = true
      delTodo(editTodo.value!.id).then(({ code, message }) => {
        delBtnLoading.value = false
        if (code === 200) {
          editPopupShow.value = false
          const index = todoList.value.findIndex(item => item.id === editTodo.value!.id)
          if (index !== -1) {
            todoList.value.splice(index, 1)
          }
          showSuccessToast('删除成功')
        }
        else {
          showToast(message)
        }
      }).catch(() => {
        delBtnLoading.value = false
      })
    })
    .catch(() => {
      delBtnLoading.value = false
    })
}

onMounted(() => {
  window.addEventListener('scroll', useScrollState.handleScroll)
})
onUnmounted(() => {
  window.removeEventListener('scroll', useScrollState.handleScroll)
})
</script>

<template>
  <div class="relative h-[100dvh] pt-16">
    <div v-if="todoList.length > 0" class="px-16 pb-80">
      <van-pull-refresh v-model="isLoading" success-text="刷新成功" @refresh="onRefresh">
        <TodoItemComponent
          v-for="(todo, index) in todoList"
          :key="todo.id"
          :todo="todo"
          :index="index"
          @delete="handleTodoDelete"
          @edit="handleTodoEdit"
        />
      </van-pull-refresh>
    </div>

    <div v-else class="h-[calc(100vh-200px)] flex items-center justify-center px-16 pb-80">
      <div class="text-center text-22">
        No Todo
      </div>
    </div>

    <!-- 创建按钮 -->
    <div
      :style="{ opacity: useScrollState.scrollDirection === 'down' ? '.5' : '1' }"
      class="liquid-button fixed bottom-80 right-24 z-50 h-48 w-48 flex cursor-pointer select-none rounded-[50%] lh-48 shadow-base"
      @click="createShow = true"
      @contextmenu.prevent
      @selectstart.prevent
    >
      <van-icon class="m-auto" size="24" name="plus" color="#fff" />
    </div>

    <TabBar />
  </div>

  <!-- 创建弹窗 -->
  <van-popup v-model:show="createShow" class="rounded-8 p-12">
    <div class="createShow">
      <div class="text-center text-22">
        Add Todo
      </div>

      <van-field
        v-model="todoValue" :border="false" :clearable="true" :error="todoValueError" :autofocus="true"
        class="my-20" label="Todo" placeholder="Input Todo..."
      />

      <div class="flex justify-between">
        <div />
        <van-button
          :loading="createBtnLoading" type="primary" loading-text="Adding ..." round
          native-type="submit" @click="addTodoFun"
        >
          Add
        </van-button>
      </div>
    </div>
  </van-popup>

  <!-- 编辑弹窗 -->
  <van-popup v-model:show="editPopupShow" class="rounded-8 p-12">
    <div class="editShow">
      <div class="text-center text-22">
        Edit Todo
      </div>

      <van-field
        v-model="editTodo!.todo"
        :border="false"
        :clearable="true"
        :error="editTodoValueError"
        :autofocus="true"
        class="my-20"
        label="Todo："
        placeholder="Input Todo..."
      />

      <div class="flex justify-end">
        <van-button
          :loading="delBtnLoading"
          type="warning"
          loading-text="Deleting ..."
          round
          native-type="submit"
          @click="delTodoFromEdit"
        >
          Del
        </van-button>
        <div class="w-10" />
        <van-button
          :loading="editBtnLoading"
          type="primary"
          loading-text="Editing ..."
          round
          native-type="submit"
          @click="editTodoFun"
        >
          Edit
        </van-button>
      </div>
    </div>
  </van-popup>
</template>

<style lang="less" scoped>
.liquid-button {
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  background: rgba(0, 122, 255, 0.25);
  backdrop-filter: blur(20px) saturate(180%);
  box-shadow:
    0 8px 32px rgba(0, 122, 255, 0.15),
    0 2px 8px rgba(0, 122, 255, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.4),
    inset 0 -1px 0 rgba(0, 122, 255, 0.2);
  border: 1px solid rgba(0, 122, 255, 0.3);
  overflow: hidden;
}

.liquid-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.4) 0%,
    rgba(255, 255, 255, 0.1) 50%,
    rgba(255, 255, 255, 0.05) 100%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.liquid-button:hover {
  transform: translateY(-2px) scale(1.05);
  background: rgba(0, 122, 255, 0.35);
  box-shadow:
    0 12px 40px rgba(0, 122, 255, 0.2),
    0 4px 12px rgba(0, 122, 255, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.5),
    inset 0 -1px 0 rgba(0, 122, 255, 0.25);
}

.liquid-button:hover::before {
  opacity: 1;
}

.liquid-button:active {
  transform: translateY(0) scale(0.98);
  transition: all 0.1s ease;
}

.dark .liquid-button {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px) saturate(200%);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.3),
    0 2px 8px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.15),
    inset 0 -1px 0 rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.dark .liquid-button:hover {
  background: rgba(255, 255, 255, 0.12);
  box-shadow:
    0 12px 40px rgba(0, 0, 0, 0.4),
    0 4px 12px rgba(0, 0, 0, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.2),
    inset 0 -1px 0 rgba(255, 255, 255, 0.08);
}
</style>
