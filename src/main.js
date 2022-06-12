import Vue from 'vue'
import App from './App.vue'
import vuetify from "@/plugins/vuetify";
import router from "./router";
import axios from 'axios';
import EnlargeableImage from '@diracleo/vue-enlargeable-image';
Vue.use(EnlargeableImage)

Vue.config.productionTip = false

Vue.prototype.$http = axios; // code standar untuk menggunakan axios
Vue.prototype.$api = 'https://atmajogjarental.felixyehdeya.xyz/api'; // link backend
Vue.prototype.$baseUrl = 'https://atmajogjarental.felixyehdeya.xyz';
// Vue.prototype.$api = 'http://127.0.0.1:8000/api'; // link backend
// Vue.prototype.$baseUrl = 'http://127.0.0.1:8000';

new Vue({
  router,
  vuetify,
  render: h => h(App),
}).$mount('#app');