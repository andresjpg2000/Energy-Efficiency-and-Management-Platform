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

import 'gridstack/dist/gridstack.min.css';

const vuetify = createVuetify({
    components,
    directives,
});

const app = createApp(App)

const pinia = createPinia()

app.use(pinia)
app.use(vuetify);

import { useUsersStore } from './stores/usersStore.js';
const usersStore = useUsersStore();
// Fetch user info before mounting the app
usersStore.fetchUser().then(() => {
    app.use(router)
    app.mount('#app');
});

