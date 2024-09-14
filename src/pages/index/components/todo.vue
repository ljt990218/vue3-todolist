<script setup lang="ts">
const props = defineProps<{
  todoList: any []
}>()
</script>

<template>
  <div v-for="item in props.todoList" :key="item.id" class="todo mt-10 rounded-8 py-16 pl-8 shadow-sm">
    <van-checkbox v-model="item.checked">
      {{ item.todo }}
    </van-checkbox>
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
