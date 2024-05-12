import './assets/main.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import locale from 'element-plus/dist/locale/zh-cn.js'
import { createPersistedState } from 'pinia-persistedstate-plugin'

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)
app.use(createPinia())
app.use(router)
app.use(ElementPlus, {locale})

app.mount('#app')
