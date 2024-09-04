<script setup lang="ts">
import type { PickerColumn } from 'vant'
import { closeToast, showLoadingToast } from 'vant'
import useAppStore from '@/stores/modules/app'
import { languageColumns, locale } from '@/utils/i18n'
import { queryTodoList } from '@/api'

definePage({
  name: 'home',
  meta: {
    level: 1,
  },
})

showLoadingToast({
  message: 'load...',
  forbidClick: true,
})

const appStore = useAppStore()
const checked = ref<boolean>(isDark.value)

watch(
  () => isDark.value,
  (newMode) => {
    checked.value = newMode
  },
  { immediate: true },
)

function toggle() {
  toggleDark()
  appStore.switchMode(isDark.value ? 'dark' : 'light')
}

const { t } = useI18n()

const showLanguagePicker = ref(false)
const languageValues = ref<Array<string>>([locale.value])
const language = computed(() => languageColumns.find(l => l.value === locale.value).text)

function onLanguageConfirm(event: { selectedOptions: PickerColumn }) {
  locale.value = event.selectedOptions[0].value as string
  showLanguagePicker.value = false
}

const todoList = ref([])
queryTodoList().then(({ code, data }) => {
  closeToast()

  if (code === 200)
    todoList.value = data
})
</script>

<template>
  <div class="pt-46">
    <div class="px-16">
      <div v-for="item in todoList" :key="item.id" class="rounded-8 bg-white py-16 pl-8">
        <van-checkbox v-model="checked">
          {{ item.todo }}
        </van-checkbox>
      </div>
    </div>

    <!-- <VanCellGroup inset>
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

      <van-popup v-model:show="showLanguagePicker" position="bottom">
        <van-picker
          v-model="languageValues"
          :columns="languageColumns"
          @confirm="onLanguageConfirm"
          @cancel="showLanguagePicker = false"
        />
      </van-popup>
    </VanCellGroup> -->
  </div>
</template>
