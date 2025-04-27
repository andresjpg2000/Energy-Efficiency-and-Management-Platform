<script >

  export default {
    name: 'DashboardView',
    components: {

    },
    data() {
      return {
        drawer: true,
        rail: true ,
        items:[
          {
            title: 'Account information',
            prependIcon: 'mdi-account-outline',
            link: '/settings/account-information',
          },
          {
            title: 'Energy Preferences',
            prependIcon: 'mdi-lightning-bolt-outline',
            link: '/settings/energy-preferences',
          },
          {
            title: 'Notification Settings',
            prependIcon: 'mdi-bell-outline',
            link: '/settings/notification-settings',
          },
          {
            title: 'Security Settings',
            prependIcon: 'mdi-shield-outline',
            link: '/settings/security-settings',
          },
          {
            title: 'Theme & Accessibility',
            prependIcon: 'mdi-palette-outline',
            link: '/settings/theme-accessibility',
          },
          
        ],
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
      
      <v-list density="compact" nav>
        <v-list-item
          v-for="item in items"
          :key="item.link"
          :to="item.link"
          link
          nav
        >
          <template #prepend>
            <v-icon>{{ item.prependIcon }}</v-icon>
          </template>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>

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
   
      <v-container fluid class="main-container">
        <router-view />
      </v-container>
  
    </v-main>
  </v-layout>
</v-app>
</template>

<style>
  .v-overlay-container {
    z-index: 9999 !important;
  }
  .main-container {
    background-color: #f5f5f5;  /* Trocar por variavel */
    height: auto;
    min-height: 100vh;
  }
</style>
