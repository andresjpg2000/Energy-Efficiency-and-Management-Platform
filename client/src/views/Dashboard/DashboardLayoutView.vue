<template>
  <AppShell  :items="items" :showSettings="true">
    <div v-if="isReady">
      <router-view/>
    </div>
  </AppShell>
</template>

<script >
import AppShell from '@/components/AppShell.vue';
import { useWidgetsStore } from '@/stores/widgetsStore';
  export default {
    name: 'DashboardLayoutView',
    components: {
      AppShell
    },
    data() {
      return {
        isReady: false,
        widgetsStore: useWidgetsStore(),
        items: [
          {
            title: 'My Dashboard',
            prependIcon: 'mdi-view-dashboard-outline',
            to: { name: "Dashboard" },  // Corrigido para objeto de rota
            exact: true,
          },
          {
            title: 'Monitoring',
            prependIcon: 'mdi-monitor-dashboard',
            to: { name: "Monitoring" },  // Corrigido para objeto de rota
          },
          {
            title: 'Forecasts',
            prependIcon: 'mdi-chart-line',
            to: { name: 'Forecasts' },  // Corrigido para objeto de rota

          },
          {
            title: 'Reports',
            prependIcon: 'mdi-file-document-outline',
            to: { name: 'Reports' },  // Corrigido para objeto de rota

          },
          {
            title: 'Resource Allocation',
            prependIcon: 'mdi-account-cog-outline',
            to: { name: 'Resource Allocation' },  // Corrigido para objeto de rota
          },
          {
            title: 'Alerts & Notifications',
            prependIcon: 'mdi-bell-outline',
            to: { name: 'Alerts & Notifications' },  // Corrigido para objeto de rota

          },
        ]
      };
    },
    methods: {
      async loadWidgets() {
      try {
        await this.widgetsStore.fetchUserWidgets();
        this.isReady = true;
      } catch (error) {
        console.error("Erro ao carregar widgets", error);
      }
    }
    },
    mounted () {
    
    },
    created () {
      this.loadWidgets();
      
      console.log("-----------------------created---------------------------------");
      console.log(this.widgetsStore.userWidgets);
    },
  } 
</script>

<style>
  .v-overlay-container {
    z-index: 9999 !important;
  }
</style>
