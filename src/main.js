import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from './router/router.js';

const app = createApp(App);

// Sumamos el router a la app.
app.use(router);

// Montamos la app en el div app del index.html.
app.mount('#app');

