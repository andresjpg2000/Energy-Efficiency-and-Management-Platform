<template>
  <AppShell :items="items" :showSettings="true">
    <div v-if="isReady == true">
      <router-view />
    </div>
    <div v-else class="loading-container">
      <div style="width: 100%" class="d-flex justify-center w-100 gap-4">
        <v-skeleton-loader width="33%" type="card"></v-skeleton-loader>
        <v-skeleton-loader width="33%" type="card"></v-skeleton-loader>
        <v-skeleton-loader width="33%" type="card"></v-skeleton-loader>
      </div>
      <div style="width: 100%" class="d-flex justify-center w-100 gap-4">
        <v-skeleton-loader width="33%" type="card"></v-skeleton-loader>
        <v-skeleton-loader width="33%" type="card"></v-skeleton-loader>
      </div>
      <v-skeleton-loader type="card"></v-skeleton-loader>
    </div>
    <div class="text-center pa-4">
      <v-dialog
        v-model="dialog"
        max-width="400"
        persistent
      >
        <v-card
          prepend-icon="mdi-map-marker"
          text="Add a house to start using the dashboard"
          title="No House Detected"
        >
          <template v-slot:actions>
            <v-spacer></v-spacer>

            <v-btn @click="dialog = false">
              Disagree
            </v-btn>

            <v-btn @click="dialog = false">
              Add House
            </v-btn>
          </template>
        </v-card>
      </v-dialog>
    </div>
  </AppShell>
</template>

<script>
import AppShell from "@/components/AppShell.vue";
import { useWidgetsStore } from "@/stores/widgetsStore";
import { useConsumptionStore } from "@/stores/consumptionStore";
import { useHousingsStore } from "@/stores/housings.js";
import { useEquipmentsStore } from "@/stores/equipmentsStore.js";
import { useProductionsStore } from "@/stores/productionsStore.js";
import { useGivenEnergiesStore } from "@/stores/givenEnergiesStore";

export default {
  name: "DashboardLayoutView",
  components: {
    AppShell,
  },
  data() {
    return {
      isReady: false,
      dialog: false,
      equipmentsStore: useEquipmentsStore(),
      productionsStore: useProductionsStore(),
      widgetsStore: useWidgetsStore(),
      housingsStore: useHousingsStore(),
      consumptionStore: useConsumptionStore(),
      givenEnergiesStore: useGivenEnergiesStore(),
      items: [
        {
          title: "My Dashboard",
          prependIcon: "mdi-view-dashboard-outline",
          to: { name: "Dashboard" }, // Corrigido para objeto de rota
          exact: true,
        },
        {
          title: "Monitoring",
          prependIcon: "mdi-monitor-dashboard",
          to: { name: "Monitoring" }, // Corrigido para objeto de rota
        },
        {
          title: "Forecasts",
          prependIcon: "mdi-chart-line",
          to: { name: "Forecasts" }, // Corrigido para objeto de rota
        },
        {
          title: "Reports",
          prependIcon: "mdi-file-document-outline",
          to: { name: "Reports" }, // Corrigido para objeto de rota
        },
        {
          title: "Resource Allocation",
          prependIcon: "mdi-account-cog-outline",
          to: { name: "Resource Allocation" }, // Corrigido para objeto de rota
        },
        {
          title: "Alerts & Notifications",
          prependIcon: "mdi-bell-outline",
          to: { name: "Alerts & Notifications" }, // Corrigido para objeto de rota
        },
      ],
    };
  },
  watch: {
    'housingsStore.selectedHousingId': {
      immediate: true,
      handler() {
        this.isReady = false;
        this.consumptionStore.resetData();
        this.equipmentsStore.resetData(); 
        this.productionsStore.resetData();
        this.givenEnergiesStore.resetData();

        this.reload(); // sempre que mudar a casa, recarrega dados
      },
    },
  },
  methods: {
    async load() {

      try {
        await this.widgetsStore.fetchUserWidgets();
        await this.housingsStore.fetchHousings();
        if (!this.housingsStore.housings?.length) {
          this.dialog = true; // Exibe o diálogo se não houver casas
          return
        }

        await this.equipmentsStore.fetchEquipments(); 
        await this.productionsStore.fetchProductions();
        await this.consumptionStore.fetchConsumption(); 
        await this.givenEnergiesStore.fetchGivenEnergies();

        this.isReady = true;
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    },
    async reload() {
      try {
        console.log("Recarregando dados...", this.housingsStore.selectedHousingId);
        
        await this.equipmentsStore.fetchEquipments(); 
        await this.productionsStore.fetchProductions();
        await this.consumptionStore.fetchConsumption(); 
        await this.givenEnergiesStore.fetchGivenEnergies();

        this.isReady = true;
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    },
  },
  created() {
    this.load();

    console.log(
      "-----------------------created---------------------------------"
    );
    console.log(this.widgetsStore.userWidgets);
  },
};
</script>

<style>
.v-overlay-container {
  z-index: 9999 !important;
}
</style>
