import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import DashboardLayoutView from '@/views/Dashboard/DashboardLayoutView.vue'

import { useAuthStore } from '@/stores/auth'
import { useUsersStore } from '@/stores/users'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: DashboardLayoutView,
      children: [
        { path: '', name: 'Dashboard', component: () => import('@/views/Dashboard/DashboardView.vue') }, // root "/"
        { path: 'Monitoring', name: 'Monitoring', component: () => import('../views/Dashboard/monitoringView.vue') },
        { path: 'Forecasts', name: 'Forecasts', component: () => import('../views/Dashboard/ForecastsView.vue') },
        { path: 'Reports', name: 'Reports', component: () => import('../views/Dashboard/ReportsView.vue') },
        { path: 'Resource-Allocation', name: 'Resource Allocation', component: () => import('../views/Dashboard/Resource-AllocationView.vue') }, // corrigido
        { path: 'Alerts-Notifications', name: 'Alerts & Notifications', component: () => import('../views/Dashboard/Alerts-NotificationsView.vue') },
      ],
      meta: {
        requiresAuth: true,
      },
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
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/admin',
      component: () => import('../views/AdminSettings/AdminSettingsView.vue'),
      children: [
        { path: '', name: 'admin', redirect: 'admin/user-management'},
        { path: 'user-management', name: 'user-management', component: () => import('../views/AdminSettings/UserManagementView.vue') },
        { path: 'energy-monitoring', name: 'energy-monitoring', component: () => import('../views/AdminSettings/EnergyMonitoringView.vue') },
        { path: 'system-settings', name: 'system-settings', component: () => import('../views/AdminSettings/SystemSettingsView.vue') },
        { path: 'analytics', name: 'analytics', component: () => import('../views/AdminSettings/AnalyticsView.vue') },
      ],
      meta: {
        requiresAuth: true,
        requiresAdmin: true,
      },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('../views/NotFoundView.vue'),
    },
    {
      path: '/forbidden',
      name: 'Forbidden',
      component: () => import('../views/ForbiddenView.vue'),
    },
  ],
})

router.beforeEach(async(to, from, next) => {
  const authStore = useAuthStore();
  const usersStore = useUsersStore();
  // Update the document title based on the route
  const defaultTitle = 'AMA ';
  document.title = to.meta.title || defaultTitle;

  const needsAuth = to.matched.some(record => record.meta.requiresAuth);
  const needsAdmin = to.matched.some(record => record.meta.requiresAdmin);

  try {
    if (authStore.checkToken()) {
      // logout the user if token is expired
      await authStore.logout();
    }

    if (!usersStore.userFetched && authStore.token && !authStore.checkToken()) {  
      await usersStore.fetchUser(); 
    }
    if ((to.name == 'login' || to.name == 'register') && authStore.isLoggedIn) {
    return next({ name: 'home' })
    }
    if (needsAuth && !authStore.isLoggedIn) {
      return next({ name: 'login' })
    } 
    if (needsAdmin && !usersStore.isAdmin) {
      return next({ name: 'Forbidden' })
    }
  
    return next()
    
  } catch (error) {
    console.error('Error in router:', error);
    usersStore.user = null;
    usersStore.userFetched = true;
    if (needsAuth) {
      return next({ name: 'login' });
    } else {
      return next();
    }
  }

});

export default router
