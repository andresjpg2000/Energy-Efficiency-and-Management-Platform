import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// Vuetify
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import 'gridstack/dist/gridstack.min.css';

const vuetify = createVuetify({
    components,
    directives,
});

const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(vuetify)
app.use(router)
app.mount('#app')

