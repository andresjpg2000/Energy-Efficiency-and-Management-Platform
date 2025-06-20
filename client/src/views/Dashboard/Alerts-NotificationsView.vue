<template>
  <v-container fluid class="py-6 px-6">
    <v-row class="mb-4">
      <h1 class="text-h5 pl-2">Alert Notifications</h1>
    </v-row>

    <v-card class="pa-4">
      <v-table density="comfortable">
        <thead>
          <tr>
            <th class="text-left text-subtitle-1">Notification</th>
            <th class="text-left text-subtitle-1">Date</th>
            <th class="text-center text-subtitle-1" style="width: 100px;">
              <v-btn variant="text" color="error" @click="openDeleteDialog" :disabled="isLoading"><v-icon
                  class="mr-1">mdi-broom</v-icon>clear all</v-btn>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="alert in filteredAlerts" :key="alert.id_notification">
            <td>{{ alert.message }}</td>
            <td>{{ formatDate(alert.createdAt) }}</td>
            <td class="text-center">
              <v-btn icon variant="text" color="red-darken-1" @click="deleteAlert(alert.id_notification)"
                title="Eliminar alerta">
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

    <!-- Dialog for confirm deletion of alerts -->
    <v-dialog v-model="isDeleteDialogOpen" max-width="500px" style="z-index: 1000;">
      <v-card>
        <v-card-title>Are you sure you want to delete every alert?</v-card-title>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="closeDeleteDialog">Cancel</v-btn>
          <v-btn color="error" @click="clearAlerts()">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { useNotificationsStore } from "@/stores/notifications";
import { useHousingsStore } from "@/stores/housings";

export default {
  data() {
    return {
      store: useNotificationsStore(),
      housingsStore: useHousingsStore(),
      isDeleteDialogOpen: false,
    };
  },

  computed: {
    alerts() {
      return this.store.alerts;
    },
    isLoading() {
      return this.store.isLoading;
    },
    filteredAlerts() {
      const selectedHouseId = this.housingsStore.selectedHousingId;
      return this.alerts.filter(
        (a) => !a.Consumption || a.Consumption.id_housing === selectedHouseId
      );
    },
  },

  methods: {
    openDeleteDialog() {
      this.isDeleteDialogOpen = true;
    },
    closeDeleteDialog() {
      this.isDeleteDialogOpen = false;
    },
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
    async clearAlerts() {
      try {
        const alertIds = this.filteredAlerts.map(alert => alert.id_notification);
        this.store.isLoading = true;

        for (const id of alertIds) {
          await this.deleteAlert(id);
        }
        this.store.isLoading = false;
      } catch (error) {
        console.error("Error clearing alerts:", error);
      }
    }
  },

  mounted() {
    this.store.fetchAlerts();
  },
};
</script>

<style scoped></style>
