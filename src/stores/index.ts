import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import useAppStore from './modules/app'
import useScrollStateStore from './modules/scroll'
import useUserStore from './modules/user'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

export { useAppStore, useScrollStateStore, useUserStore }
export default pinia
