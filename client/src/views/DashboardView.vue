<script >
  export default {
    name: 'DashboardView',
    data() {
      return {
        drawer: true,
        rail: true ,
        items:[
          {
            title: 'My Dashboard',
            prependIcon: 'mdi-view-dashboard-outline',
            link: true,
          },
          {
            title: 'My Houses',
            prependIcon: 'mdi-file-chart-outline',
            link: true,
          },
          {
            title: 'Monitoring',
            prependIcon: 'mdi-account-group',
            link: true,
          },
          {
            title: 'Forecasts',
            prependIcon: 'mdi-briefcase-outline',
            link: true,
          },
          {
            title: 'Reports',
            prependIcon: 'mdi-calendar',
            link: true,
          },
          
        ],
      };
    },
    methods: {
      // Define your methods here
    },
  } 
</script>


<template>
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
              <v-list-item append-icon="mdi-cog-outline" link title="Settings" />

              <v-list-item append-icon="mdi-logout" link title="Logout" />
            </v-list>
          </v-menu>
        </v-btn>
      </template>
    </v-app-bar>

    <v-main>
      <div class="pa-4">
        <v-sheet
          color="surface-light"
          height="100vh"
          rounded="lg"
          width="100%"
        />
      </div>
    </v-main>
  </v-layout>
</template>
