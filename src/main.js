import {createApp} from 'vue';
import App from './App.vue';
import router from './router';

createApp(App).use(router).mount('#app');

Storage.prototype.setObject = function (key, value) {
    this.setItem(key, JSON.stringify(value));
}

Storage.prototype.getObject = function (key) {
    return JSON.parse(this.getItem(key));
}