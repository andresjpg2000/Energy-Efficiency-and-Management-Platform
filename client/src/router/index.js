import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import DashboardView from '@/views/Dashboard/DashboardView.vue'
import DashboardLayoutView from '@/views/Dashboard/DashboardLayoutView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: DashboardLayoutView,
      children: [
        { path: '', name: 'Dashboard', component: DashboardView }, // root "/"
        { path: 'Monitoring', name: 'Monitoring', component: () => import('../views/Dashboard/monitoringView.vue') },
        { path: 'Forecasts', name: 'Forecasts', component: () => import('../views/Dashboard/ForecastsView.vue') },
        { path: 'Reports', name: 'Reports', component: () => import('../views/Dashboard/ReportsView.vue') },
        { path: 'Resource-Allocation', name: 'Resource Allocation', component: () => import('../views/Dashboard/Resource-AllocationView.vue') }, // corrigido
        { path: 'Alerts-Notifications', name: 'Alerts & Notifications', component: () => import('../views/Dashboard/Alerts-NotificationsView.vue') },
      ],
      // meta: {
      //   requiresAuth: true,
      // },
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
      path: '/settings',
      name: 'settings',
      component: () => import('../views/ProfileSettings/ProfileSettingsView.vue'),
      children: [
        { path: '', name: 'default', redirect: 'settings/account-information' },
        { path: 'account-information', name: 'account-information', component: () => import('../views/ProfileSettings/AccountInformationView.vue') },
        { path: 'energy-preferences', name: 'energy-preferences', component: () => import('../views/ProfileSettings/EnergyPreferencesView.vue') },
        { path: 'notification-settings', name: 'notification-settings', component: () => import('../views/ProfileSettings/NotificationSettingsView.vue') },
        { path: 'security-settings', name: 'security-settings', component: () => import('../views/ProfileSettings/SecuritySettingsView.vue') },
        { path: 'theme-accessibility', name: 'theme-accessibility', component: () => import('../views/ProfileSettings/ThemeAccessibilityView.vue') },
      ],
      // meta: {
      //   requiresAuth: true,
      // },
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/AdminSettings/AdminSettingsView.vue'),
      children: [
        { path: '', redirect: 'admin/user-management'},
        { path: 'user-management', name: 'user-management', component: () => import('../views/AdminSettings/UserManagementView.vue') },
        { path: 'energy-monitoring', name: 'energy-monitoring', component: () => import('../views/AdminSettings/EnergyMonitoringView.vue') },
        { path: 'system-settings', name: 'system-settings', component: () => import('../views/AdminSettings/SystemSettingsView.vue') },
        { path: 'account-settings', name: 'adminAccountSettings', component: () => import('../views/AdminSettings/AdminAccountSettingsView.vue') },
        { path: 'analytics', name: 'analytics', component: () => import('../views/AdminSettings/AnalyticsView.vue') },
      ],
      // meta: {
      //   requiresAuth: true,
      // },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('../views/NotFoundView.vue'),
    },
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
