import { defineStore } from 'pinia'
import type { LoginData } from '@/api/user'
import { getUserInfo, login as userLogin, logout as userLogout } from '@/api/user'
import { clearToken, setToken } from '@/utils/auth'

export const useUserStore = defineStore('user', () => {
  const userInfo = ref({}) as any

  // Set user's information
  const setInfo = (partial: any) => {
    userInfo.value = { ...partial }
  }

  const login = async (loginForm: LoginData) => {
    try {
      const { data } = await userLogin(loginForm)
      setToken(data.access_token)
      setInfo(data.user_info)
    }
    catch (error) {
      clearToken()
      throw error
    }
  }

  const info = async () => {
    try {
      const { data } = await getUserInfo()
      setInfo(data)
    }
    catch (error) {
      clearToken()
      throw error
    }
  }

  const logout = async () => {
    try {
      await userLogout()
    }
    finally {
      clearToken()
      setInfo({})
    }
  }

  return {
    userInfo,
    info,
    login,
    logout,
  }
}, {
  persist: true,
})

export default useUserStore
