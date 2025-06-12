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
        <v-list density="compact" mandatory item-props :items="items" nav />

        <template v-if="showDrawer" v-slot:prepend>
          <router-link
            to="/"
            :style="{
              textDecoration: 'none',
              color: 'inherit',
            }"
          >
            <div class="d-flex flex-row align-center mx-3">
              <img :src="logo" alt="logo" width="32" height="32" class="mr-4" />
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

        <template v-if="showHouses">
          <v-container cols="12" md="6">
            <v-row class="d-flex align-center ga-0">
              <v-chip-group mandatory selected-class="text-success" v-model="housingsStore.selectedHousingId">
                <v-chip filter selected v-for="house in housingsStore.housings" :key="house.id_housing" rounded="lg"
                  :value="house.id_housing" @click="housingsStore.selectedHousingId = house.id_housing">{{
                    house.building_type }}</v-chip>
              </v-chip-group>
              <v-btn
                density="comfortable"
                class="mx-2"
                color="success"
                rounded="lg"
                variant="outlined"
                @click="addHousing"
                ><v-icon>mdi-plus add</v-icon> add housing</v-btn
              >
              <v-btn
                density="comfortable"
                class="mx-2"
                color="success"
                rounded="lg"
                variant="outlined"
                @click="editHouse"
                ><v-icon>mdi-pencil</v-icon> edit housing</v-btn
              >
            </v-row>
          </v-container>
        </template>

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

          <v-menu offset-y :scrim="true" :close-on-content-click="false">
            <template #activator="{ props }">
              <v-btn icon v-bind="props">
                <v-icon>mdi-bell</v-icon>
              </v-btn>
            </template>

            <div style="max-height: 300px; overflow-y: auto">
              <v-list>
                <v-list-item
                  v-for="notification in notificationsStore.alerts"
                  :key="notification.id_notification"
                >
                  <v-list-item-title>{{
                    notification.message
                  }}</v-list-item-title>
                </v-list-item>

                <v-list-item v-if="notificationsStore.alerts.length === 0">
                  <v-list-item-title>No notifications</v-list-item-title>
                </v-list-item>
              </v-list>
            </div>
          </v-menu>

          <v-btn class="text-none mr-4" height="48" icon slim>
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

      <!-- Dialog for Adding/Editing House -->
      <v-dialog v-model="openDialog" max-width="500px">
        <v-card>
          <v-card-title>
            <span class="text-h6">{{
              isEditMode ? "Edit Housing" : "Add Housing"
            }}</span>
          </v-card-title>

          <v-card-text>
            <v-text-field
              v-model="housing.address"
              variant="outlined"
              label="Address"
              required
            />
            <v-text-field
              v-model="housing.pc"
              variant="outlined"
              label="Postal Code"
              required
            />
            <v-text-field
              v-model="housing.location"
              variant="outlined"
              label="Location"
              required
            />
            <v-select
              v-model="housing.id_supplier"
              :items="formattedSuppliers"
              item-title="title"
              item-value="value"
              variant="outlined"
              label="Energy Suppliers"
              placeholder="Choose your current energy supplier"
            />
            <v-select
              v-model="housing.building_type"
              :items="['flat', 'house', 'studio']"
              variant="outlined"
              label="Building Type"
              placeholder="Choose the type of building"
            />
          </v-card-text>

          <v-card-actions>
            <v-spacer />
            <v-btn
              v-if="isEditMode"
              color="error"
              @click="openDeleteHousingDialog"
              >Delete</v-btn
            >
            <v-btn text @click="closeDialog">Cancel</v-btn>
            <v-btn color="primary" @click="saveHousing">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- Dialog for confirm deletion of House -->
      <v-dialog v-model="openDeleteDialog" max-width="500px">
        <v-card>
          <v-card-title
            >Are you sure you want to delete this housing?</v-card-title
          >
          <v-card-actions>
            <v-spacer />
            <v-btn text @click="closeDeleteHousingDialog">Cancel</v-btn>
            <v-btn color="error" @click="deleteHousing">Delete</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-main>
        <v-container fluid class="main-container">
          <slot />
        </v-container>
      </v-main>
    </v-layout>
  </v-app>
</template>

<script>
import { useHousingsStore } from "@/stores/housings";
import { useMessagesStore } from "@/stores/messages";
import { useSuppliersStore } from "@/stores/suppliers";
import { useAuthStore } from "@/stores/auth";
import { useDisplay } from "vuetify";
import { watch } from "vue";
import { useWidgetsStore } from "@/stores/widgetsStore";
import { useNotificationsStore } from "@/stores/notifications";

export default {
  name: "AppShell",
  emits: ["changeHouse"],
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
    showHouses: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      rail: true,
      drawer: true,
      isMobile: false,
      housingsStore: useHousingsStore(),
      messagesStore: useMessagesStore(),
      suppliersStore: useSuppliersStore(),
      authStore: useAuthStore(),
      notificationsStore: useNotificationsStore(),
      logo: new URL("../assets/logo.svg", import.meta.url).href,
      selectedHouse: null, // para armazenar a casa selecionada
      isEditMode: false,
      openDialog: false, // para controlar o estado do diálogo
      openDeleteDialog: false, // para controlar o estado do diálogo de apagar moradia
      housing: {
        address: "",
        pc: "",
        location: "",
        id_supplier: null,
        building_type: "",
        id_user: null,
      },
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
    suppliers() {
      return this.suppliersStore.suppliers;
    },
    formattedSuppliers() {
      return this.suppliers.map((supplier) => ({
        title: `${supplier.enterprise} - ${supplier.cost_kWh} €/kWh`,
        value: supplier.id,
      }));
    },
  },
  methods: {
    changingHouse(housingId) {
      this.housingsStore.selectedHousingId = housingId;
      this.$emit("changeHouse", true);
    },
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
    addHousing() {
      this.isEditMode = false;
      this.resetForm();
      this.openDialog = true;
    },
    async editHouse() {
      this.isEditMode = true;
      const selected = this.housingsStore.getSelectedHousing;
      if (selected) {
        this.housing = {
          ...selected,
          id_supplier: selected.id_supplier,
        };
        this.housing.location =
          await this.housingsStore.fetchLocationByHousingId(
            selected.id_housing
          );
        this.openDialog = true;
      } else {
        this.messagesStore.add({
          color: "error",
          text: "You need to select a housing to edit.",
        });
      }
    },
    saveHousing() {
      if (!this.housing.id_user) {
        this.housing.id_user = this.authStore.getUserId;
      }
      if (this.isEditMode) {
        this.housingsStore.updateHousing(this.housing);
      } else {
        console.log("Adding new housing:", this.housing);
        this.housingsStore.addHousing(this.housing);
      }
      this.closeDialog();
    },
    closeDialog() {
      this.openDialog = false;
      this.resetForm();
      this.isEditMode = false;
    },
    resetForm() {
      this.housing = {
        address: "",
        pc: "",
        location: "",
        id_supplier: null,
        building_type: "",
        id_user: null,
      };
    },
    deleteHousing() {
      this.housingsStore.deleteHousing(this.housing.id_housing);
      this.closeDeleteHousingDialog();
      this.closeDialog();
      this.messagesStore.add({
        color: "success",
        text: "Housing deleted successfully.",
      });
    },
    openDeleteHousingDialog() {
      this.openDeleteDialog = true;
    },
    closeDeleteHousingDialog() {
      this.openDeleteDialog = false;
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
  mounted() {
    // Fetch suppliers
    this.suppliersStore.fetchSuppliers("id,enterprise,cost_kWh");
    this.notificationsStore.fetchAlerts();
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
