import { useSessionStore } from '@/Utils/store/useSessionStore'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './styles.css'

const app = createApp(App)
const pinia = createPinia()
const sessionStore = useSessionStore(pinia)

app.use(pinia)
sessionStore.loadFromSession()

app.use(router)
app.mount('#app')
