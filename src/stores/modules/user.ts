import type { LoginData, RegisterData } from '@/api/user'
import { getUserInfo, login as userLogin, logout as userLogout, register as userRegister } from '@/api/user'
import { clearToken, setToken } from '@/utils/auth'
import { defineStore } from 'pinia'
import { showToast } from 'vant'

export const useUserStore = defineStore('user', () => {
  const userInfo = ref({}) as any

  // Set user's information
  const setInfo = (partial: any) => {
    userInfo.value = { ...partial }
  }

  const login = async (loginForm: LoginData) => {
    try {
      const { code, data, message } = await userLogin(loginForm)
      if (code === 200) {
        setToken(data.access_token)
        setInfo(data.user_info)
      }
      else {
        showToast(message)
      }
      return code
    }
    catch (error) {
      clearToken()
      throw error
    }
  }

  const register = async (registerForm: RegisterData) => {
    try {
      const { code, data, message } = await userRegister(registerForm)
      if (code === 200) {
        setToken(data.access_token)
        setInfo(data.user_info)
      }
      else {
        showToast(message)
      }
      return code
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
    register,
    logout,
  }
}, {
  persist: true,
})

export default useUserStore
