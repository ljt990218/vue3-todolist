<script setup lang="ts">
const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const show = computed(() => {
  if (route.meta.level && route.meta.level !== 2)
    return true
  return false
})
</script>

<template>
  <div v-if="show" class="tabbar shadow-base .dark:bg-[var(--van-background-2)]">
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
  bottom: 20px;
  left: 40px;
  right: 40px;
  height: 48px;
  border-radius: 24px;

  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: space-around;
  z-index: 1000;

  & > .bar {
    flex: 1;
    text-align: center;
  }
}

.active {
  color: blueviolet;
}
</style>
