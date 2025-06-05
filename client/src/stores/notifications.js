import { defineStore } from "pinia";
import { useAuthStore } from "./auth";

export const useNotificationsStore = defineStore("notifications", {
  state: () => ({
    alerts: [],
    isLoading: false,
    error: null,
  }),

  actions: {
    async fetchAlerts() {
      this.isLoading = true;
      this.error = null;

      const authStore = useAuthStore();

      try {
        const response = await fetch(`/notifications/mine`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }

        const data = await response.json();
        this.alerts = data.alerts || [];
      } catch (err) {
        this.error = err.message;
        console.error("Error loading alerts:", err);
      } finally {
        this.isLoading = false;
      }
    },

    async deleteAlert(id_notification) {
      const authStore = useAuthStore();

      try {
        const response = await fetch(`/notifications/${id_notification}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to delete alert");
        }

        this.alerts = this.alerts.filter(
          (n) => n.id_notification !== id_notification
        );
      } catch (err) {
        console.error("Error deleting alert:", err);
      }
    },
  },
});
