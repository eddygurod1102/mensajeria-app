import '@mdi/font/css/materialdesignicons.css'
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue'
import Registro from './Registro.vue';
import Inicio from './Inicio.vue';
import IniciarSesion from './IniciarSesion.vue';
import Inbox from './Inbox.vue';

// Vuetify
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import { aliases, mdi } from 'vuetify/iconsets/mdi';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

const vuetify = createVuetify({
    components,
    directives,
    theme: {
        defaultTheme: 'dark',
    },
    ssr: true,
    icons: {
        defaultSet: 'mdi',
        aliases,
        sets: {
            mdi,
        },
    },
});

// Rutas del sitio web.
const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'inicio',
            component: Inicio
        },
        {
            path: '/registrarse',
            component: Registro
        },
        {
            path: '/login',
            component: IniciarSesion
        },
        {
            path: '/inbox/:id1/:id2',
            name: 'inbox',
            component: Inbox
        }
    ],
});

const app = createApp(App);

app.use(router);
app.use(vuetify);
app.mount('body');