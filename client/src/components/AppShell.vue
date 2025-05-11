<!-- Main skeleton for the application -->
<template>
<v-app>
  <v-layout>
    <v-navigation-drawer v-if="showDrawer" permanent floating @click="rail = true" :rail="rail">
      <!-- <div class="px-4 py-8">
        tirar comentario se for para adicionar o logo
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
    
    <v-app-bar flat>
      
      <router-link to="/" :style="{textDecoration: 'none', color: 'inherit',marginLeft: showDrawer ? '0' : '32px'}">
        <v-app-bar-title>AMA</v-app-bar-title>
      </router-link>

      <template #append>

        <router-link v-if="isAdmin && showSettings" to="admin" :style="{textDecoration: 'none', color: 'inherit',marginLeft: showDrawer ? '0' : '32px'}">
          <v-app-bar-title>Manage system</v-app-bar-title>
        </router-link>
        
        <v-btn class="mx-4" icon="mdi-bell"></v-btn>

        <span v-if="username" class="mr-4">{{ username }}</span>

        <v-btn class="text-none mr-8" height="48" icon slim>
          
          <v-avatar color="surface-light" image="https://cdn.vuetifyjs.com/images/john.png" size="32" />

          <v-menu activator="parent">
            <v-list density="compact" nav>
              <v-list-item v-if="showSettings" append-icon="mdi-cog-outline" link title="Settings" :to="{ path: '/settings' }" router/>
              <v-list-item @click="logout()" append-icon="mdi-logout" link title="Logout" />
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
import { useUsersStore } from '@/stores/usersStore';

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
        rail: true ,
        usersStore: null,
      };
    },
    computed: {
      username () {
        return this.usersStore.userName;
      },
      isAdmin () {
        return this.usersStore.isAdmin;
      }
    },
    methods: {
      logout () {
        
        this.usersStore.logout();
        
        setTimeout(() => {
          this.$router.push('/login');
        }, 100);
        
      },
    },
    created () {
      this.usersStore = useUsersStore();
    },
  } 
</script>

<style>
  .v-overlay-container {
    z-index: 9999 !important;
  }
  .main-container {
    border-top-left-radius: 1rem;
    height: auto;
    min-height: 100svh - calc(var(--v-app-bar-height) + var(--v-navigation-drawer-width));
  }
</style>
