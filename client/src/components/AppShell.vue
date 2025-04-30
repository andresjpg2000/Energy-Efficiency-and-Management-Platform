<!-- Main skeleton for the application -->

<template>
<v-app>
  <v-layout>
    <v-navigation-drawer v-if="showDrawer" v-model="drawer" floating permanent @click="rail = false" :rail="rail">
      <!-- <div class="px-4 py-8">
            
        <router-link to="/" style="text-decoration: none; color: inherit;padding: 0;">
          <h5>AMA</h5>
        </router-link>
        
      </div> -->
      
      <v-list density="compact" mandatory item-props :items="items" nav />

      <template v-if="showDrawer" v-slot:prepend>
        <v-list-item
          @click.stop="rail = !rail"
          class="ma-2"
          nav
          prepend-icon="mdi-menu"
        />
        <!-- <v-app-bar-nav-icon @click.stop="rail = !rail" ></v-app-bar-nav-icon> -->
      </template>
      
      <template #append>
        <v-list-item
          v-if="showSettings"
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

    <v-app-bar class="" flat>
      
      <router-link to="/" style="text-decoration: none; color: inherit;">
        <v-app-bar-title>AMA</v-app-bar-title>
      </router-link>

      <template #append>
        <v-btn class="mx-4" icon="mdi-bell"></v-btn>

        <v-btn class="text-none mr-8" height="48" icon slim>
          <v-avatar color="surface-light" image="https://cdn.vuetifyjs.com/images/john.png" size="32" />

          <v-menu activator="parent">
            <v-list density="compact" nav>
              <v-list-item v-if="showSettings" append-icon="mdi-cog-outline" link title="Settings" :to="{ path: '/settings' }" router/>
              <v-list-item append-icon="mdi-logout" link title="Logout" />
            </v-list>
          </v-menu>
        </v-btn>
      </template>
    </v-app-bar>

    <v-main style=" margin-right: 0.1rem;">
   
      <v-container fluid class="main-container">
        <slot/>
      </v-container>
  
    </v-main>
  </v-layout>
</v-app>
</template>

<script >
  export default {
    name: 'AppShell',
    props: {
      items: {
        type: Array,
      },
      showSettings: {
        type: Boolean,
        default: true,
      },
      showDrawer: {
        type: Boolean,
        default: true,
      },
    },
    data() {
      return {
        drawer: true,
        rail: true ,
      };
    },
    methods: {
      // Define your methods here
    },
    mounted () {
      
    },
    created () {
    },
  } 
</script>

<style>
  .v-overlay-container {
    z-index: 9999 !important;
  }
  .main-container {
    background-color: #E0E0E0;  /* Trocar por variavel */
    border-radius: 1.5rem;
    height: auto;
    min-height: 100svh - calc(var(--v-app-bar-height) + var(--v-navigation-drawer-width));
  }
</style>
