<script setup lang="ts">
import type { TodoItem } from '@/types'
import useAppStore from '@/stores/modules/app'

interface Props {
  todo: TodoItem
  index: number
}

interface Emits {
  (e: 'delete', todo: TodoItem): void
  (e: 'edit', todo: TodoItem): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const appStore = useAppStore()

const localTodo = ref<TodoItem>({ ...props.todo })

watch(() => props.todo, (newTodo) => {
  localTodo.value = { ...newTodo }
}, { deep: true })

function openEdit() {
  emit('edit', localTodo.value)
}

function editIconShow(status: boolean) {
  localTodo.value.open = status
}

function delTodoFun() {
  emit('delete', localTodo.value)
}

function getItemBackgroundColor(checked: boolean) {
  if (checked)
    return appStore.mode === 'dark' ? '#1c1c1e' : '#f0f0f0'

  return appStore.mode === 'dark' ? '#161616' : '#fff'
}
</script>

<template>
  <div
    class="todo-item-wrapper mt-10 flex items-center overflow-hidden rounded-8 bg-[var(--van-background-2)] shadow-sm duration-300 first:mt-0"
    :style="{ backgroundColor: getItemBackgroundColor(localTodo.checked) }"
  >
    <van-swipe-cell class="w-full" @open="editIconShow(false)" @close="editIconShow(true)">
      <div class="flex items-center justify-between py-16 pl-8 pr-24">
        <van-checkbox v-model="localTodo.checked">
          {{ localTodo.todo }}
        </van-checkbox>
        <transition name="icon-fade">
          <div v-if="localTodo.open" class="i-carbon:edit h-16 w-16" style="color: #999;" @click="openEdit" />
        </transition>
      </div>
      <template #right>
        <van-button square type="danger" text="删除" class="h-52! lh-52!" @click="delTodoFun()" />
      </template>
    </van-swipe-cell>
  </div>
</template>

<style lang="less" scoped>
.todo-item-wrapper {
  :deep(.todo-swipe-cell .van-swipe-cell__right) {
    right: -1px !important;
  }

  .icon-fade-enter-active,
  .icon-fade-leave-active {
    transition: opacity 0.5s ease;
  }

  .icon-fade-enter-from,
  .icon-fade-leave-to {
    opacity: 0;
  }
}
</style>
