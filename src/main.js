import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'main',
      component: () => import(/* webpackChunkName: 'main' */ '@/pages/main')
    },
    {
      path: '/404',
      name: 'page404',
      component: () => import(/* webpackChunkName: 'page404' */ '@/pages/page404')
    },
    {
      path: '*',
      redirect: '/404'
    }
  ]
})

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
