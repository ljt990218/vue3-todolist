import { defineStore } from 'pinia'

export const useScrollStateStore = defineStore('scrollState', () => {
  const scrollDirection = ref('')
  let lastScrollTop = 0

  const handleScroll = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    if (scrollTop > lastScrollTop) {
      scrollDirection.value = 'down'
    }
    else {
      scrollDirection.value = 'up'
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop
  }

  return {
    scrollDirection,
    handleScroll,
  }
})

export default useScrollStateStore
