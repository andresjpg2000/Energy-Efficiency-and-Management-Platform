<!-- Main skeleton for the application -->
<template>
<v-app>
  <v-layout>
    <v-navigation-drawer 
      v-if="showDrawer" 
      v-model="drawer"
      :permanent="!isMobile"
      :temporary="isMobile"
      :floating="!isMobile"
      :rail="!isMobile && rail"
      @click="rail = true">
    <!-- <div class="px-4 py-8">
        tirar comentario se for para adicionar o logo
        <router-link to="/" style="text-decoration: none; color: inherit;padding: 0;">
          <h5>AMA</h5>
        </router-link>
        
      </div> -->
      
      <v-list density="compact" mandatory item-props :items="items" nav />

      <template v-if="showDrawer" v-slot:prepend>
        <v-list-item
          v-if="!isMobile"
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

      <v-app-bar-nav-icon v-if="isMobile" variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

      <router-link to="/" :style="{textDecoration: 'none', color: 'inherit',marginLeft: showDrawer ? '0' : '32px'}">
        <div class="d-flex flex-row align-center ga-2">
          <svg width="32px" height="32px" viewBox="0 0 250 250" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMidYMid">
          <defs>
            <linearGradient x1="50.000371%" y1="2.10915516e-14%" x2="50.000371%" y2="99.9970316%" id="linearGradient-1">
              <stop stop-color="#EA5F29" offset="0%"></stop>
              <stop stop-color="#FABD1F" offset="100%"></stop>
            </linearGradient>
            <linearGradient x1="49.9966606%" y1="99.9985158%" x2="49.9966606%" y2="0.000742098506%" id="linearGradient-2">
              <stop stop-color="#ABD33C" offset="0%"></stop>
              <stop stop-color="#6CB02F" offset="100%"></stop>
            </linearGradient>
          </defs>
          <g>
            <path d="M91.7941754,237.859248 C31.0187494,237.859248 -2.84217094e-14,202.798335 -2.84217094e-14,137.336471 L-2.84217094e-14,137.336471 L-2.84217094e-14,91.608836 L-2.84217094e-14,-5.68434189e-14 L59.5345348,59.691632 L59.5345348,129.455135 C59.5345348,156.574697 66.709816,173.83244 90.7809869,177.706915 L90.7809869,177.706915 C99.1900987,179.353788 116.69143,178.776588 127.818853,178.776588 L127.818853,178.776588 L127.818853,137.354122 C127.818853,136.976383 127.870042,136.3021 127.967124,135.956134 L127.967124,135.956134 C128.43312,134.279254 129.947608,133.050718 131.740987,133.047188 L131.740987,133.047188 C132.755941,133.045423 133.705584,133.573199 134.685235,134.540494 L134.685235,134.540494 L237.857482,237.843361 L168.604104,237.859248 L91.7941754,237.859248 L91.7941754,237.859248 Z" fill="url(#linearGradient-1)" transform="translate(118.928741, 118.929624) scale(1, -1) translate(-118.928741, -118.929624) "></path>
            <path d="M196.200253,196.452668 L196.200253,126.69093 C196.200253,99.571368 189.023207,82.3118601 164.953801,78.4373848 L164.953801,78.4373848 C156.544689,76.7922773 139.043358,77.369477 127.915935,77.369477 L127.915935,77.369477 L127.915935,118.790178 C127.915935,119.166152 127.864746,119.842199 127.767664,120.188166 L127.767664,120.188166 C127.301668,121.866811 125.788945,123.093581 123.993801,123.097112 L123.993801,123.097112 C122.978847,123.100642 122.029204,122.571101 121.049553,121.605571 L121.049553,121.605571 L17.8773055,18.3027035 L87.1306837,18.2868172 L163.940613,18.2868172 C224.716039,18.2868172 255.734788,53.34773 255.734788,118.807829 L255.734788,118.807829 L255.734788,164.537229 L255.734788,256.1443 L196.200253,196.452668 L196.200253,196.452668 Z" fill="url(#linearGradient-2)" transform="translate(136.806047, 137.215558) scale(1, -1) translate(-136.806047, -137.215558) "></path>
          </g>
        </svg>
        <v-app-bar-title>AMA</v-app-bar-title>
        </div>
      </router-link>

      <template #append>

        <router-link v-if="isAdmin && showSettings" to="admin" :style="{textDecoration: 'none', color: 'inherit',marginLeft: showDrawer ? '0' : '32px'}">
          <v-app-bar-title>Manage system</v-app-bar-title>
        </router-link>
        
        <v-btn class="mx-1" icon="mdi-bell"></v-btn>

        <!-- <span v-if="username" class="mr-4">{{ username }}</span> -->

        <v-btn class="text-none mr-4" height="48" icon slim>
          
          <!-- <v-avatar color="surface-light" class="profileAvatar" image="https://cdn.vuetifyjs.com/images/john.png" size="32" /> -->
          <v-avatar color="surface-light" class="profileAvatar" text="" size="small">
            <span class="initialsText">{{ userInitials }}</span>
          </v-avatar> 

          <v-menu activator="parent">
            <v-list density="compact" nav>
              <h3 class="text-center">{{ username }}</h3>
              <v-divider class="my-2"></v-divider>
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
import { useDisplay } from 'vuetify'
import { watch } from 'vue'

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
        drawer: true,
        usersStore: null,
        isMobile: false,
      };
    },
    computed: {
      username () {
        return this.usersStore.getUsername || '';
      },
      isAdmin () {
        return this.usersStore.isAdmin || false;
      },
      userInitials () {
        return this.username.split(' ').map(word => word[0]).join('').toUpperCase();
      },
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

      // usar o helper de Vuetify
      const { smAndDown } = useDisplay()

      // setar o valor inicial
      this.isMobile = smAndDown.value

       // Definir drawer conforme o dispositivo
      this.drawer = !this.isMobile  // <- fechado se for mobile

      // observar mudanças de breakpoint
      watch(smAndDown, (newVal) => {
        this.isMobile = newVal
        if (newVal) {
          this.drawer = false
        }
      })
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
  .initialsText {
    font-size: 0.75rem;
    font-weight: 500;
  }
</style>
