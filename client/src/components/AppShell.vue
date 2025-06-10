<!-- Main skeleton for the application -->
<template>
  <v-app>
    <v-layout>
      <v-navigation-drawer
        v-if="showDrawer"
        v-model="drawer"
        expand-on-hover
        :permanent="!isMobile"
        :temporary="isMobile"
        :floating="!isMobile"
        :rail="!isMobile && rail"
      >
        <!-- <div class="px-4 py-8">
        <router-link to="/" style="text-decoration: none; color: inherit;padding: 0;">
          <h5>AMA</h5>
        </router-link>
        
      </div> -->

        <v-list density="compact" mandatory item-props :items="items" nav />

        <template v-if="showDrawer" v-slot:prepend >
          <router-link
          to="/"
          :style="{
            textDecoration: 'none',
            color: 'inherit',
          }"
          >
            <div class="d-flex flex-row align-center mx-3">
              <img :src="logo" alt="logo" width="32" height="32" class="mr-4 "/>
              <h1 class="text-h5">GreenGrid</h1>
            </div>
          </router-link>  
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
        <v-app-bar-nav-icon
          variant="text"
          @click.stop="clickApp()"
        ></v-app-bar-nav-icon>

        <!-- <router-link
          to="/"
          :style="{
            textDecoration: 'none',
            color: 'inherit',
            marginLeft: showDrawer ? '0' : '32px',
          }"
        >
          <div class="d-flex flex-row align-center ga-2">
            <img :src="logo" alt="logo" width="32" height="32" />
            <v-app-bar-title>GreenGrid</v-app-bar-title>
          </div>
        </router-link> -->

        <template #append>
          <router-link
            v-if="isAdmin && showSettings"
            to="admin"
            :style="{
              textDecoration: 'none',
              color: 'inherit',
              marginLeft: showDrawer ? '0' : '32px',
            }"
          >
            <v-app-bar-title>Manage system</v-app-bar-title>
          </router-link>

          <v-btn class="mx-1" icon="mdi-bell"></v-btn>

          <!-- <span v-if="username" class="mr-4">{{ username }}</span> -->

          <v-btn class="text-none mr-4" height="48" icon slim>
            <!-- <v-avatar color="surface-light" class="profileAvatar" image="https://cdn.vuetifyjs.com/images/john.png" size="32" /> -->
            <v-avatar
              color="surface-light"
              class="profileAvatar"
              text=""
              size="small"
            >
              <span class="initialsText">{{ userInitials }}</span>
            </v-avatar>

            <v-menu activator="parent">
              <v-list density="compact" nav>
                <h3 class="text-center">{{ username }}</h3>
                <v-divider class="my-2"></v-divider>
                <v-list-item
                  v-if="showSettings"
                  append-icon="mdi-cog-outline"
                  link
                  title="Settings"
                  :to="{ path: '/settings' }"
                  router
                />
                <v-list-item
                  @click="logout()"
                  append-icon="mdi-logout"
                  link
                  title="Logout"
                />
              </v-list>
            </v-menu>
          </v-btn>
        </template>
      </v-app-bar>

      <v-main>
        <v-container fluid class="main-container">
          <slot />
        </v-container>
      </v-main>
    </v-layout>
  </v-app>
</template>

<script>
import { useAuthStore } from "@/stores/auth";
import { useDisplay } from "vuetify";
import { watch } from "vue";
import { useWidgetsStore } from "@/stores/widgetsStore";

export default {
  name: "AppShell",
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
      rail: true,
      drawer: true,
      isMobile: false,
      authStore: useAuthStore(),
      logo: new URL("../assets/logo.svg", import.meta.url).href,

    };
  },
  computed: {
    username() {
      return this.authStore.getUsername || "";
    },
    isAdmin() {
      return this.authStore.isAdmin || false;
    },
    userInitials() {
      return this.username
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase();
    },
     clickApp() {
      if (this.isMobile) {
        this.drawer = !this.drawer;
      } else {
        this.rail = !this.rail;
      }
    },
  },
  methods: {
    logout() {
      this.authStore.logout();

      const widgetsStore = useWidgetsStore();

      widgetsStore.updateDBWidgets();
      
      localStorage.clear();
      sessionStorage.clear();

      setTimeout(() => {
        this.$router.push("/login");
      }, 100);
    },
  },
  created() {
    // usar o helper de Vuetify
    const { smAndDown } = useDisplay();

    // setar o valor inicial
    this.isMobile = smAndDown.value;

    // Definir drawer conforme o dispositivo
    this.drawer = !this.isMobile; // <- fechado se for mobile

    // observar mudanças de breakpoint
    watch(smAndDown, (newVal) => {
      this.isMobile = newVal;
      if (newVal) {
        this.drawer = false;
      }
    });
  },
};
</script>

<style>
.v-overlay-container {
  z-index: 9999 !important;
}
.main-container {
  border-top-left-radius: 1rem;
  height: auto;
  min-height: 100svh -
    calc(var(--v-app-bar-height) + var(--v-navigation-drawer-width));
}
.initialsText {
  font-size: 0.75rem;
  font-weight: 500;
}
</style>
