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
  <div :style="{ bottom: useScrollState.scrollDirection === 'down' ? '-100px' : '10px' }" class="tabbar select-none shadow-base .dark:bg-[var(--van-background-2)]" @contextmenu.prevent @selectstart.prevent>
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
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(20px) saturate(180%);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.12),
    0 2px 8px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.4),
    inset 0 -1px 0 rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.18);
  display: flex;
  align-items: center;
  justify-content: space-around;
  z-index: 1000;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  overflow: hidden;
}

.tabbar::before {
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
  opacity: 0.3;
  pointer-events: none;
}

.tabbar:hover {
  background: rgba(255, 255, 255, 0.3);
  box-shadow:
    0 12px 40px rgba(0, 0, 0, 0.15),
    0 4px 12px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.5),
    inset 0 -1px 0 rgba(255, 255, 255, 0.15);
}

& > .bar {
  flex: 1;
  text-align: center;
  cursor: pointer;
  padding: 12px 0;
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
}

& > .bar:hover {
  transform: translateY(-1px);
}

.active {
  color: #007aff;
  font-weight: 600;
}

.dark .tabbar {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px) saturate(200%);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.3),
    0 2px 8px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.15),
    inset 0 -1px 0 rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.dark .tabbar:hover {
  background: rgba(255, 255, 255, 0.12);
  box-shadow:
    0 12px 40px rgba(0, 0, 0, 0.4),
    0 4px 12px rgba(0, 0, 0, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.2),
    inset 0 -1px 0 rgba(255, 255, 255, 0.08);
}
</style>
