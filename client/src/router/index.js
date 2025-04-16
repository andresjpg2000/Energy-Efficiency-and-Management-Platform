import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
      meta: {
        requiresAuth: true,
      },
    },
  ],
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('token') !== null
  if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
    next({ name: 'login' })
  } else {
    next()
  }
});

export default router
