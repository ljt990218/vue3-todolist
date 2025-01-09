<script setup lang="ts">
import { useUserStore } from '@/stores'
import { showSuccessToast, showToast } from 'vant'
import { type RouteMap, useRouter } from 'vue-router'

import logoDark from '~/images/logo-dark.svg'
import logo from '~/images/logo.svg'

const { t } = useI18n()
const router = useRouter()
const userStore = useUserStore()
const loading = ref<boolean>(false)

const dark = ref<boolean>(isDark.value)

watch(
  () => isDark.value,
  (newMode) => {
    dark.value = newMode
  },
)

const postData = reactive({
  account: 'admin3',
  password: 'admin3',
  confirmPassword: 'admin3',
})

const rules = reactive({
  account: [
    { required: true, message: t('login.pleaseEnteraccount') },
  ],
  password: [
    { required: true, message: t('login.pleaseEnterPassword') },
  ],
  confirmPassword: [
    { required: true, message: t('login.pleaseEnterConfirmPassword') },
  ],
})

async function asyncRegister(values: any) {
  if (postData.password !== postData.confirmPassword) {
    return showToast({ message: '两次输入的密码不一致', duration: 1500 })
  }

  try {
    loading.value = true
    const code = await userStore.register({ ...postData, ...values })

    if (code !== 200)
      return

    showSuccessToast({ message: '注册成功', duration: 1000 })

    setTimeout(() => {
      const { redirect, ...othersQuery } = router.currentRoute.value.query
      router.push({
        name: (redirect as keyof RouteMap) || 'home',
        query: {
          ...othersQuery,
        },
      })
    }, 1000)
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="m-x-a w-7xl text-center">
    <div class="mb-32 mt-64">
      <van-image :src="dark ? logoDark : logo" class="h-120 w-120" />
    </div>

    <van-form :model="postData" :rules="rules" @submit="asyncRegister">
      <van-cell-group inset>
        <van-field v-model="postData.account" :rules="rules.account" name="account" :placeholder="t('login.account')" left-icon="contact" />
        <van-field v-model="postData.password" :rules="rules.password" name="password" :placeholder="t('login.password')" left-icon="lock" type="password" />
        <van-field v-model="postData.confirmPassword" :rules="rules.confirmPassword" name="confirmPassword" :placeholder="t('login.pleaseEnterConfirmPassword')" left-icon="lock" type="password" />
      </van-cell-group>
      <div class="m-16 mt-32">
        <van-button :loading="loading" round block type="primary" native-type="submit">
          {{ t('login.register') }}
        </van-button>
      </div>
    </van-form>
  </div>
</template>
