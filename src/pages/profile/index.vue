<script setup lang="ts">
import type { PickerColumn } from 'vant'
import { showConfirmDialog, showToast } from 'vant'
import { useUserStore } from '@/stores'
import { formatDate } from '@/utils/date'
import useAppStore from '@/stores/modules/app'
import { languageColumns, locale } from '@/utils/i18n'

definePage({
  name: 'profile',
  meta: {
    // title: '个人中心',
    // i18n: 'menus.profile',
    level: 1,
  },
})

const { userInfo, logout } = useUserStore()

const { t } = useI18n()
const appStore = useAppStore()
const checked = ref<boolean>(isDark.value)
const router = useRouter()

function toggle() {
  toggleDark()
  appStore.switchMode(isDark.value ? 'dark' : 'light')
}

const showLanguagePicker = ref(false)
const languageValues = ref<Array<string>>([locale.value])
const language = computed(() => languageColumns.find(l => l.value === locale.value).text)

function onLanguageConfirm(event: { selectedOptions: PickerColumn }) {
  locale.value = event.selectedOptions[0].value as string
  showLanguagePicker.value = false
}

function logoutFun() {
  showConfirmDialog({
    title: '提示',
    message:
    '确定退出登录？',
    confirmButtonText: '退出登录',
    cancelButtonText: '点错了',
  })
    .then(() => {
      logout().then(() => {
        showToast('退出成功')
        router.replace('/login')
      })
    })
}
</script>

<template>
  <div class="rounded-8 pt-16">
    <VanCellGroup inset shadow-sm>
      <van-cell title="Name" :value="userInfo.name" />
      <van-cell title="Age" :value="userInfo.age" />
      <van-cell title="CreateDate" :value="formatDate(userInfo.createDate)" />
    </VanCellGroup>

    <div class="h-16" />

    <VanCellGroup inset shadow-sm>
      <VanCell center :title="t('menus.darkMode')">
        <template #right-icon>
          <VanSwitch v-model="checked" size="20px" aria-label="on/off Dark Mode" @click="toggle()" />
        </template>
      </VanCell>

      <VanCell
        is-link
        :title="t('menus.language')"
        :value="language"
        @click="showLanguagePicker = true"
      />

      <van-cell title="退出登录" is-link @click="logoutFun" />
    </VanCellGroup>

    <div class="h-16" />

    <van-popup v-model:show="showLanguagePicker" position="bottom">
      <van-picker
        v-model="languageValues"
        :columns="languageColumns"
        @confirm="onLanguageConfirm"
        @cancel="showLanguagePicker = false"
      />
    </van-popup>
  </div>
</template>
