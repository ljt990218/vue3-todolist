<script setup lang="ts">
import { useScrollStateStore } from '@/stores'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const useScrollState = useScrollStateStore()

onMounted(() => {
  window.addEventListener('scroll', useScrollState.handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', useScrollState.handleScroll)
})
</script>

<template>
  <div :style="{ bottom: useScrollState.scrollDirection === 'down' ? '-100px' : '10px' }" class="tabbar shadow-base .dark:bg-[var(--van-background-2)]">
    <div class="bar" :class="route.name === 'home' ? 'active' : ''" @click="router.replace('/')">
      {{ t('layouts.home') }}
    </div>
    <div
      class="bar" :class="route.name === 'profile' ? 'active' : ''"
      @click="router.replace('profile')"
    >
      {{ t('layouts.profile') }}
    </div>
  </div>
</template>

<style lang="less" scoped>
.tabbar {
  position: fixed;
  bottom: 10px;
  left: 40px;
  right: 40px;
  height: 48px;
  border-radius: 24px;

  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: space-around;
  z-index: 1000;

  transition: all 0.2s ease;

  & > .bar {
    flex: 1;
    text-align: center;
    cursor: pointer;
  }
}

.active {
  color: blueviolet;
}
</style>
