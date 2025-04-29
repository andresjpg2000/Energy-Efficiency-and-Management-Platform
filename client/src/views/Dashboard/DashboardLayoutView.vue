<script >
  export default {
    name: 'DashboardLayoutView',
    data() {
      return {
        drawer: true,
        rail: true ,
        items: [
          {
            title: 'My Dashboard',
            prependIcon: 'mdi-view-dashboard-outline',
            to: { name: "Dashboard" },  // Corrigido para objeto de rota
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
      // Define your methods here
    },
    mounted () {
    
    },
  } 
</script>


<template>
<v-app>
  <v-layout>
    <v-navigation-drawer v-model="drawer" floating permanent @click="rail = false" :rail="rail">
      <div class="px-4 py-8">
            <h5>AMA </h5>
      </div>
      <v-list density="compact" item-props :items="items" nav />
      
      <template #append>
        <v-list-item
          class="ma-2"
          link
          :to="{ path: '/settings' }"
          router
          nav
          prepend-icon="mdi-cog-outline"
          title="Settings"
        />
      </template>
    </v-navigation-drawer>

    <v-app-bar class="ps-4" flat>
      <template v-slot:prepend>
        <v-app-bar-nav-icon @click.stop="rail = !rail" ></v-app-bar-nav-icon>
      </template>

      <v-app-bar-title>AMA</v-app-bar-title>

      <template #append>
        <v-btn class="mx-4" icon="mdi-bell"></v-btn>

        <v-btn class="text-none mr-8" height="48" icon slim>
          <v-avatar color="surface-light" image="https://cdn.vuetifyjs.com/images/john.png" size="32" />

          <v-menu activator="parent">
            <v-list density="compact" nav>
              <v-list-item append-icon="mdi-cog-outline" link title="Settings" :to="{ path: '/settings' }" router/>

              <v-list-item append-icon="mdi-logout" link title="Logout" />
            </v-list>
          </v-menu>
        </v-btn>
      </template>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-layout>
</v-app>
</template>

<style>

  .v-overlay-container {
    z-index: 9999 !important;
  }
</style>
