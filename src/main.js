// src/main.js
import { createApp } from 'vue'
import App from './App.vue'

// importas de index.js de /plugins
import { registerPlugins } from '@/plugins'

const app = createApp(App)

registerPlugins(app)   //  router

app.mount('#app')
