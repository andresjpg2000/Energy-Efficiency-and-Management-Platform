<template>
  <v-container class="py-6 px-6">
    <v-row justify="space-between" align="center" class="mb-4">
      <h1 class="text-h5 pl-2">Notificações de Alerta</h1>
    </v-row>

    <v-card class="pa-4">

      <v-table density="comfortable">
        <thead>
          <tr>
            <th class="text-left">Notificaction</th>
            <th class="text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="alert in alerts" :key="alert.id_notification">
            <td>{{ alert.message }}</td>
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

          <tr v-if="alerts.length === 0 && loaded">
            <td colspan="2" class="text-grey">Sem alertas no momento.</td>
          </tr>
        </tbody>
      </v-table>

      <div v-if="!loaded" class="text-center my-4">
        <v-progress-circular indeterminate color="primary" />
      </div>
    </v-card>
  </v-container>
</template>

<script>
import { useAuthStore } from "@/stores/auth";

export default {
  data() {
    return {
      alerts: [
        {
          id_notification: 1,
          type: "Alert",
          message: "Consumo elevado: 94.8 kWh registados em 15/05/2025.",
        },
        {
          id_notification: 2,
          type: "Alert",
          message: "Custo energético estimado atingiu 16,32€ com este consumo.",
        },
        {
          id_notification: 3,
          type: "Alert",
          message:
            "Produção insuficiente: apenas 19.5 kWh gerados em 16/05/2025.",
        },
        {
          id_notification: 4,
          type: "Alert",
          message: "Consumo elevado: 105.2 kWh registados em 14/05/2025.",
        },
      ],
      loaded: false,
    };
  },

  methods: {
    async fetchAlerts() {
      const authStore = useAuthStore();

      try {
        const response = await fetch(
          `/users/${authStore.user.id_user}/notifications`,
          {
            headers: {
              Authorization: `Bearer ${authStore.token}`,
            },
          }
        );

        const json = await response.json();
        this.loaded = true;

        if (!response.ok) {
          console.error("Erro ao buscar notificações:", json.message);
          return;
        }

        const all = json.data?.notifications || [];
        this.alerts = all.filter((n) => n.type === "Alert");
      } catch (err) {
        this.loaded = true;
        console.error("Erro ao buscar notificações:", err);
      }
    },

    async deleteAlert(id) {
      try {
        const authStore = useAuthStore();

        const res = await fetch(`/notifications/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        });

        if (res.ok) {
          this.alerts = this.alerts.filter((a) => a.id_notification !== id);
          this.$toast?.success("Alerta eliminado.");
        } else {
          this.$toast?.error("Erro ao eliminar alerta.");
        }
      } catch (err) {
        console.error("Erro ao eliminar alerta:", err);
        this.$toast?.error("Erro ao eliminar alerta.");
      }
    },
  },

  mounted() {
    this.fetchAlerts();
  },
};
</script>

<style scoped></style>
