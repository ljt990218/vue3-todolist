<script setup lang="ts">
const { todoList } = defineProps(['todoList'])
</script>

<template>
  <div v-for="item in todoList" :key="item.id" class="mt-10 rounded-8 bg-[var(--van-background-2)] py-16 pl-8 shadow-sm first:mt-0">
    <van-checkbox v-model="item.checked">
      {{ item.todo }}
    </van-checkbox>
  </div>
</template>
