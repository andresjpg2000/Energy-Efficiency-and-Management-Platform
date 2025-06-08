<template>
  <v-container fluid class="py-6 px-6">
    <v-row justify="space-between" align="center" class="mb-4">
      <h1 class="text-h5 pl-2">Alert Notifications</h1>
    </v-row>

    <v-card class="pa-4">
      <v-table density="comfortable">
        <thead>
          <tr>
            <th class="text-left text-subtitle-1">Notification</th>
            <th class="text-left text-subtitle-1">Date</th>
            <th class="text-left text-subtitle-1">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="alert in alerts" :key="alert.id_notification">
            <td>{{ alert.message }}</td>
            <td>{{ formatDate(alert.createdAt) }}</td>
            <td>
              <v-btn
                icon
                variant="text"
                color="red-darken-1"
                @click="deleteAlert(alert.id_notification)"
                title="Eliminar alerta"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </td>
          </tr>
          <tr v-if="alerts.length === 0 && !isLoading">
            <td colspan="2" class="text-grey">Sem alertas no momento.</td>
          </tr>
        </tbody>
      </v-table>

      <div v-if="isLoading" class="text-center my-4">
        <v-progress-circular indeterminate color="primary" />
      </div>
    </v-card>
  </v-container>
</template>

<script>
import { useNotificationsStore } from "@/stores/notifications";

export default {
  data() {
    return {
      store: useNotificationsStore(),
    };
  },

  computed: {
    alerts() {
      return this.store.alerts;
    },
    isLoading() {
      return this.store.isLoading;
    },
  },

  methods: {
    async deleteAlert(id) {
      try {
        await this.store.deleteAlert(id);
      } catch (error) {
        console.error("Error deleting alert:", error);
      }
    },
    formatDate(dateStr) {
      const date = new Date(dateStr);
      return date.toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    },
  },

  mounted() {
    this.store.fetchAlerts();
  },
};
</script>

<style scoped></style>
