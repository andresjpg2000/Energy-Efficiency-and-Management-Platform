<!-- Main skeleton for the application -->

<template>
<v-app>
  <v-layout>
    <v-navigation-drawer v-model="drawer" floating permanent @click="rail = false" :rail="rail">
      <div class="px-4 py-8">
            <h5>AMA</h5>
      </div>
      
      <v-list density="compact" mandatory item-props :items="items" nav />

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
              <v-list-item v-if="showSettings" append-icon="mdi-cog-outline" link title="Settings" :to="{ path: '/settings' }" router/>
              <v-list-item append-icon="mdi-logout" link title="Logout" />
            </v-list>
          </v-menu>
        </v-btn>
      </template>
    </v-app-bar>

    <v-main>
   
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
    background-color: #f5f5f5;  /* Trocar por variavel */
    height: auto;
    min-height: 100vh;
  }
</style>
