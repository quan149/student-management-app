import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config';
import router from './components/router';

const app = createApp(App);
app.use(PrimeVue);
app.use(router);
app.mount('#app')
