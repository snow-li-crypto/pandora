import '@babel/polyfill'
import 'mutationobserver-shim'
import Vue from 'vue'
import './plugins/bootstrap-vue'
import router from './router'
import VueRouter from 'vue-router';
    
Vue.use(VueRouter);


import App from './App.vue'
Vue.config.productionTip = false
Vue.use(router);


new Vue({
  render: h => h(App),
  router: router
}).$mount('#app');


// const app = Vue.createApp(App)
// //确保 _use_ 路由实例使
// //整个应用支持路由。
// app.use(router)

// app.mount('#app')