import { createRouter, createWebHistory } from "vue-router";

import { useAuthStore } from "@/stores/auth";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("@/views/Dashboard/DashboardLayoutView.vue"),
      children: [
        {
          path: "",
          name: "Dashboard",
          component: () => import("@/views/Dashboard/DashboardView.vue"),
          meta: {
            title: "Dashboard - GreenGrid",
          },
        }, // root "/"
        {
          path: "Monitoring",
          name: "Monitoring",
          component: () => import("../views/Dashboard/monitoringView.vue"),
          meta: {
            title: "Monitoring - GreenGrid",
          },
        },
        {
          path: "Forecasts",
          name: "Forecasts",
          component: () => import("../views/Dashboard/ForecastsView.vue"),
          meta: {
            title: "Forecasts - GreenGrid",
          },
        },

        {
          path: "Consumption-data",
          name: "dataConsumption",
          component: () =>
            import("../views/DataTables/dataConsumptionView.vue"),
          meta: {
            title: "Consumption Data - GreenGrid",
          },
        },
        {
          path: "Production-data",
          name: "dataProduction",
          component: () => import("../views/DataTables/dataProductionView.vue"),
          meta: {
            title: "Production Data - GreenGrid",
          },
        },
        {
          path: "givenEnergies-data",
          name: "dataGivenEnergies",
          component: () =>
            import("../views/DataTables/dataGivenEnergiesView.vue"),
          meta: {
            title: "Given Energies Data - GreenGrid",
          },
        },
        {
          path: "Alerts-Notifications",
          name: "Alerts & Notifications",
          component: () =>
            import("../views/Dashboard/Alerts-NotificationsView.vue"),
          meta: {
            title: "Alerts & Notifications - GreenGrid",
          },
        },
      ],
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/about",
      name: "about",
      component: () => import("../views/AboutView.vue"),
    },
    {
      path: "/login",
      name: "login",
      component: () => import("@/views/LoginView.vue"),
      meta: {
        title: "Login - GreenGrid",
      },
    },
    {
      path: "/register",
      name: "register",
      component: () => import("@/views/RegisterView.vue"),
      meta: {
        title: "Register - GreenGrid",
      },
    },
    {
      path: "/settings",
      name: "settings",
      component: () =>
        import("../views/ProfileSettings/ProfileSettingsView.vue"),
      children: [
        { path: "", name: "default", redirect: "settings/account-information" },
        {
          path: "account-information",
          name: "account-information",
          component: () =>
            import("../views/ProfileSettings/AccountInformationView.vue"),
          meta: {
            title: "Account Information - GreenGrid",
          }
        },
        {
          path: "energy-preferences",
          name: "energy-preferences",
          component: () =>
            import("../views/ProfileSettings/EnergyPreferencesView.vue"),
          meta: {
            title: "Energy Preferences - GreenGrid",
          },
        },
        {
          path: "notification-settings",
          name: "notification-settings",
          component: () =>
            import("../views/ProfileSettings/NotificationSettingsView.vue"),
          meta: {
            title: "Notification Settings - GreenGrid",
          },
        },
        {
          path: "security-settings",
          name: "security-settings",
          component: () =>
            import("../views/ProfileSettings/SecuritySettingsView.vue"),
          meta: {
            title: "Security Settings - GreenGrid",
          },
        },
      ],
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/admin",
      component: () => import("../views/AdminSettings/AdminSettingsView.vue"),
      children: [
        { path: "", name: "admin", redirect: "admin/user-management" },
        {
          path: "user-management",
          name: "user-management",
          component: () =>
            import("../views/AdminSettings/UserManagementView.vue"),
        },
        {
          path: "system-settings",
          name: "system-settings",
          component: () =>
            import("../views/AdminSettings/SystemSettingsView.vue"),
        },
        {
          path: "analytics",
          name: "analytics",
          component: () => import("../views/AdminSettings/AnalyticsView.vue"),
        },
      ],
      meta: {
        requiresAuth: true,
        requiresAdmin: true,
      },
    },
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: () => import("../views/NotFoundView.vue"),
      meta: {
        title: "Page Not Found - GreenGrid",
      },
    },
    {
      path: "/forbidden",
      name: "Forbidden",
      component: () => import("../views/ForbiddenView.vue"),
    },
    {
      path: "/reset-password",
      name: "reset-password",
      component: () => import("../views/ResetPassword.vue"),
    },
    {
      path: "/verify-2fa",
      name: "verify-2fa",
      component: () => import("../views/Verify2FA.vue"),
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  // Update the document title based on the route
  const defaultTitle = "GreenGrid - Smart Energy Management";
  document.title = to.meta.title || defaultTitle;

  const needsAuth = to.matched.some((record) => record.meta.requiresAuth);
  const needsAdmin = to.matched.some((record) => record.meta.requiresAdmin);
  const isTokenExpired = authStore.isTokenExpired();

  try {
    if (isTokenExpired && authStore.refreshToken) {
      const refreshed = await authStore.refreshAccessToken();
      if (!refreshed) {
        // logout the user if token is expired
        await authStore.logout();
      }
    }
    if (
      (to.name == "login" ||
        to.name == "register" ||
        to.name == "reset-password") &&
      authStore.isLoggedIn
    ) {
      return next({ name: "home" });
    }
    if (needsAuth && !authStore.isLoggedIn) {
      return next({ name: "login" });
    }
    if (needsAdmin && !authStore.isAdmin) {
      return next({ name: "Forbidden" });
    }

    return next();
  } catch (error) {
    console.error("Error in router:", error);
    authStore.user = null;
    authStore.userFetched = true;
    if (needsAuth) {
      return next({ name: "login" });
    } else {
      return next();
    }
  }
});

export default router;
