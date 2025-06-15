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
          <v-row>
            <v-col class="d-flex flex-row align-center scroll">
              <v-btn
                density="comfortable"
                color="success"
                rounded="lg"
                variant="outlined"
                class="mr-2"
                @click="addHousing"
                ><v-icon>mdi-home-plus add</v-icon></v-btn
              >
              <v-btn
                density="comfortable"
                color="success"
                rounded="lg"
                variant="outlined"
                class="mr-2"
                @click="editHouse"
                ><v-icon>mdi-home-edit</v-icon></v-btn
              >
              <v-chip-group
                mandatory
                selected-class="text-success"
                v-model="housingsStore.selectedHousingId"
              >
                <v-tooltip
                  v-for="house in labeledHousings"
                  :text="house.address"
                  :key="house.id_housing"
                  location="bottom"
                >
                  <template v-slot:activator="{ props }">
                    <v-chip
                      filter
                      selected
                      :="props"
                      :key="house.id_housing"
                      rounded="lg"
                      :value="house.id_housing"
                      @click="changingHouse(house.id_housing)"
                      >{{ house.label }}</v-chip
                    >
                  </template>
                </v-tooltip>
              </v-chip-group>
            </v-col>
          </v-row>
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
            <v-app-bar-title><v-icon>mdi-tools</v-icon></v-app-bar-title>
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
import { useConsumptionStore } from "@/stores/consumptionStore";
import { useProductionsStore } from "@/stores/productionsStore";
import { useGivenEnergiesStore } from "@/stores/givenEnergiesStore";
import { useEquipmentsStore } from "@/stores/equipmentsStore";

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
    labeledHousings() {
      // Create the labels for the v-chips
      const typeCount = {};
      const labeled = [];

      this.housingsStore.housings.forEach((housing) => {
        const type = housing.building_type;
        typeCount[type] = (typeCount[type] || 0) + 1;

        const label = `${housing.building_type} (${typeCount[type]})`;
        labeled.push({
          label: label,
          ...housing,
        });
      });

      return labeled;
    },
  },
  methods: {
    changingHouse(housingId) {
      this.housingsStore.selectedHousingId = housingId;
      this.$emit("changeHouse", true);
    },
    logout() {
      const widgetsStore = useWidgetsStore();
      const consumptionStore = useConsumptionStore();
      const productionStore = useProductionsStore();
      const givenStore = useGivenEnergiesStore();
      const equipmentsStore = useEquipmentsStore();

      this.housingsStore.resetData();

      this.authStore.logout();

      widgetsStore.updateDBWidgets();
      widgetsStore.userWidgets = [];
      consumptionStore.resetData();
      productionStore.resetData();
      givenStore.resetData();
      equipmentsStore.resetData();

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
    async saveHousing() {
      if (!this.housing.id_user) {
        this.housing.id_user = this.authStore.getUserId;
      }
      if (this.isEditMode) {
        await this.housingsStore.updateHousing(this.housing);
      } else {
        console.log("Adding new housing:", this.housing);
        await this.housingsStore.addHousing(this.housing);
      }

      await this.housingsStore.resetData(); // Reset housings data
      await this.housingsStore.fetchHousings(); // Fetch updated housings
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
    async deleteHousing() {
      await this.housingsStore.deleteHousing(this.housing.id_housing);
      this.housingsStore.resetData(); // Reset housings data
      this.housingsStore.selectedHousingId = null; // Reset selected housing
      this.housingsStore.fetchHousings();

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

.scroll {
  overflow-x: auto;
  white-space: nowrap;
  padding-top: 0;
  padding-bottom: 0;
}

.scroll > * {
  flex-shrink: 0;
}

@media (max-width: 610px) {
  .scroll {
    max-width: 350px;
    margin-right: 1rem;
  }

  .v-icon {
    font-size: 18px;
  }
}

@media (max-width: 550px) {
  .scroll {
    max-width: 250px;
    margin-right: 1rem;
  }
}

@media (max-width: 450px) {
  .scroll {
    max-width: 150px;
    margin-right: 1rem;
  }
}
</style>
