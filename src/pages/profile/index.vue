<script setup lang="ts">
import { useUserStore } from '@/stores'
import { formatDate } from '@/utils/date'

definePage({
  name: 'profile',
  meta: {
    title: '个人中心',
    i18n: 'menus.profile',
    level: 1,
  },
})

const { userInfo } = useUserStore()

// const { t } = useI18n()
</script>

<template>
  <div class="mx-16 mt-66 overflow-hidden rounded-8">
    <van-cell title="Name" :value="userInfo.name" />
    <van-cell title="Age" :value="userInfo.age" />
    <van-cell title="CreateDate" :value="formatDate(userInfo.createDate)" />
  </div>
</template>
