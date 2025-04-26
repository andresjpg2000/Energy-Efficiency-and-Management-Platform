import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'

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
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
      // meta: {
      //   requiresAuth: true,
      // },
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/ProfileSettingsView.vue'),
      children: [
        { path: '', redirect: 'settings/account-information' },
        { path: 'account-information', name: 'account-information', component: () => import('../views/AccountInformation.vue') },
        { path: 'energy-preferences', name: 'energy-preferences', component: () => import('../views/EnergyPreferences.vue') },
        { path: 'notification-settings', name: 'notification-settings', component: () => import('../views/NotificationSettings.vue') },
        { path: 'security-settings', name: 'security-settings', component: () => import('../views/SecuritySettings.vue') },
        { path: 'theme-accessibility', name: 'theme-accessibility', component: () => import('../views/ThemeAccessibility.vue') },
      ],
    }
  ],
})

router.beforeEach((to, from, next) => {
  
    //Actualiza o title
    const defaultTitle = 'AMA ';
    document.title = to.meta.title || defaultTitle;

  const isAuthenticated = localStorage.getItem('token') !== null
  if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
    next({ name: 'login' })
  } else {
    next()
  }
});

export default router
