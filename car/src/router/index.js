import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('../views/HomeView.vue'),
      redirect: '/CustomerInfo',
      children:[
        {
          path: '/CustomerInfo',
          name: 'CustomerInfo',
          component: () => import('../views/CustomerInfo.vue')
        },
        {
          path: '/RepairInfo',
          name: 'RepairInfo',
          component: () => import('../views/RepairInfo.vue')
        },
        {
          path: '/Carinfo',
          name: 'carinfo',
          component: () => import('../views/CarInfo.vue')
        },
        {
          path: '/Repairman',
          name: 'repairman',
          component: () => import('../views/Repairman.vue')
        }
      ]
    }  
  ]
})

export default router
