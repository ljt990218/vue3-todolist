<script setup lang="ts">
import useAutoThemeSwitcher from '@/hooks/useAutoThemeSwitcher'
import useAppStore from '@/stores/modules/app'
import useRouteCache from '@/stores/modules/routeCache'
import { storeToRefs } from 'pinia'

useHead({
  title: 'Vue3-TodoList',
  meta: [
    {
      name: 'description',
      content: 'Vue + Vite Vue3-TodoList',
    },
    {
      name: 'theme-color',
      content: () => isDark.value ? '#00aba9' : '#ffffff',
    },
  ],
  link: [
    {
      rel: 'icon',
      type: 'image/svg+xml',
      href: () => preferredDark.value ? '/favicon-dark.svg' : '/favicon.svg',
    },
  ],
})

const appStore = useAppStore()
const { mode } = storeToRefs(appStore)

const { initializeThemeSwitcher } = useAutoThemeSwitcher(appStore)

const keepAliveRouteNames = computed(() => {
  return useRouteCache().routeCaches as string[]
})

onMounted(() => {
  initializeThemeSwitcher()
})
</script>

<template>
  <VanConfigProvider :theme="mode">
    <NavBar />
    <router-view v-slot="{ Component, route }">
      <keep-alive :include="keepAliveRouteNames">
        <component :is="Component" :key="route.name" />
      </keep-alive>
    </router-view>
  </VanConfigProvider>
</template>
