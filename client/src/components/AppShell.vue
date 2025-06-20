<!-- Main skeleton for the application -->
<template>
  <v-app>
    <v-layout>
      <v-navigation-drawer v-if="showDrawer" v-model="drawer" expand-on-hover :permanent="!isMobile"
        :temporary="isMobile" :floating="!isMobile" :rail="!isMobile && rail">
        <v-list role="list" density="compact" mandatory item-props :items="items" nav />

        <template v-if="showDrawer" v-slot:prepend>
          <router-link to="/" :style="{
            textDecoration: 'none',
            color: 'inherit',
          }">
            <div class="d-flex flex-row align-center mx-3">
              <img :src="logo" alt="logo" width="32" height="32" class="mr-4" />
              <h1 class="text-h5">GreenGrid</h1>
            </div>
          </router-link>
        </template>

        <template #append>
          <v-list role="list" density="compact">
            <v-list-item alt="Settings" role="listitem" v-if="showSettings" class="ma-2" link
              :to="{ path: '/settings' }" router nav prepend-icon="mdi-cog-outline" title="Settings" />
          </v-list>

        </template>
      </v-navigation-drawer>

      <v-app-bar flat>
        <v-app-bar-nav-icon aria-label="Toggle navigation drawer" variant="text"
          @click.stop="clickApp()"></v-app-bar-nav-icon>

        <template v-if="showHouses">
          <v-row>
            <v-col class="d-flex flex-row align-center scroll">
              <v-btn aria-label="add new house" density="comfortable" color="success" rounded="lg" variant="outlined"
                class="mr-2" @click="addHousing"><v-icon>mdi-home-plus add</v-icon></v-btn>
              <v-btn aria-label="edit house" density="comfortable" color="success" rounded="lg" variant="outlined"
                class="mr-2" @click="editHouse"><v-icon>mdi-home-edit</v-icon></v-btn>
              <v-chip-group mandatory selected-class="text-success" v-model="selectedHouse">
                <v-tooltip aria-label="house name" v-for="house in labeledHousings" :text="house.address"
                  :key="house.id_housing" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-chip aria-label="house" filter selected :="props" :key="house.id_housing" rounded="lg"
                      :value="house.id_housing" @click="changingHouse(house.id_housing)">{{ house.label }}</v-chip>
                  </template>
                </v-tooltip>
              </v-chip-group>
            </v-col>
          </v-row>
        </template>

        <template #append>
          <router-link v-if="isAdmin && showSettings" to="admin" aria-label="Admin Panel" :style="{
            textDecoration: 'none',
            color: 'inherit',
            marginLeft: showDrawer ? '0' : '32px',
          }">
            <v-app-bar-title><v-icon>mdi-tools</v-icon></v-app-bar-title>
          </router-link>

          <v-menu offset-y :scrim="true" :close-on-content-click="false">
            <template #activator="{ props }">
              <v-btn aria-label="see notifications" icon v-bind="props">
                <v-icon>mdi-bell</v-icon>
              </v-btn>
            </template>

            <div style="max-height: 300px; overflow-y: auto">
              <v-list role="list">
                <v-list-item role="listitem" v-for="notification in notificationsStore.alerts"
                  :key="notification.id_notification">
                  <v-list-item-title>{{
                    notification.message
                  }}</v-list-item-title>
                </v-list-item>

                <v-list-item role="listitem" v-if="notificationsStore.alerts.length === 0">
                  <v-list-item-title>No notifications</v-list-item-title>
                </v-list-item>
              </v-list>
            </div>
          </v-menu>

          <v-btn aria-label="profile menu" class="text-none mr-4" height="48" icon slim>
            <v-avatar color="surface-light" class="profileAvatar" text="" size="small">
              <span class="initialsText">{{ userInitials }}</span>
            </v-avatar>

            <v-menu activator="parent">
              <v-list density="compact" nav role="list">
                <h3 class="text-center">{{ username }}</h3>
                <v-divider class="my-2"></v-divider>
                <v-list-item role="listitem" v-if="showSettings" aria-label="settings" append-icon="mdi-cog-outline"
                  link title="Settings" :to="{ path: '/settings' }" router />
                <v-list-item role="listitem" @click="logout()" append-icon="mdi-logout" link title="Logout" />
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
            <v-text-field v-model="housing.address" clearable variant="outlined" label="Address" required />
            <v-text-field v-model="housing.pc" clearable variant="outlined" label="Postal Code" required />
            <v-text-field v-model="housing.location" clearable variant="outlined" label="Location" required />
            <v-select v-model="housing.building_type" clearable :items="['flat', 'house', 'studio']" variant="outlined"
              label="Building Type" placeholder="Choose the type of building" />
            <v-select v-model="housing.id_supplier" clearable :items="formattedSuppliers" item-title="title"
              item-value="value" variant="outlined" label="Energy Suppliers"
              placeholder="Choose your current energy supplier" />
            <v-text-field v-model="housing.custom_supplier_price" clearable variant="outlined"
              label="Custom Supplier Cost €/kWh" type="number" min="0" step="0.01"
              hint="Leave blank to use the supplier's default price" persistent-hint />
          </v-card-text>

          <v-card-actions>
            <v-spacer />
            <v-btn aria-label="open delete house dialog" v-if="isEditMode" color="error"
              @click="openDeleteHousingDialog">Delete</v-btn>
            <v-btn aria-label="cancel" text @click="closeDialog">Cancel</v-btn>
            <v-btn aria-label="save" color="primary" @click="saveHousing">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- Dialog for confirm deletion of House -->
      <v-dialog v-model="openDeleteDialog" max-width="500px">
        <v-card>
          <v-card-title>Are you sure you want to delete this housing?</v-card-title>
          <v-card-actions>
            <v-spacer />
            <v-btn aria-label="close" text @click="closeDeleteHousingDialog">Cancel</v-btn>
            <v-btn aria-label="delete" color="error" @click="deleteHousing">Delete</v-btn>
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
        custom_supplier_price: null,
        building_type: "",
        id_user: null,
      },
    };
  },
  computed: {
    selectedHouse() {
      return this.housingsStore.selectedHousingId;
    },
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
    clickApp() {
      if (this.isMobile) {
        this.drawer = !this.drawer;
      } else {
        this.rail = !this.rail;
      }
    },
    changingHouse(housingId) {
      this.housingsStore.selectedHousingId = housingId;
      this.$emit("changeHouse", true);
    },
    async logout() {
      const widgetsStore = useWidgetsStore();
      const consumptionStore = useConsumptionStore();
      const productionStore = useProductionsStore();
      const givenStore = useGivenEnergiesStore();
      const equipmentsStore = useEquipmentsStore();

      this.housingsStore.resetData();
      await givenStore.resetData();
      await widgetsStore.updateDBWidgets();
      widgetsStore.userWidgets = [];
      await consumptionStore.resetData();
      await productionStore.resetData();
      await equipmentsStore.resetData();

      this.authStore.logout();

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
      try {
        if (!this.housing.id_user) {
          this.housing.id_user = this.authStore.getUserId;
        }
        if (this.isEditMode) {
          await this.housingsStore.updateHousing(this.housing);
          this.messagesStore.add({
            color: "success",
            text: "Housing updated successfully.",
          });
        } else {
          await this.housingsStore.addHousing(this.housing);
          this.messagesStore.add({
            color: "success",
            text: "Housing added successfully.",
          });
        }

        this.$emit("changeHouse", true); // Emit event to notify parent component
        this.closeDialog();
      } catch (error) {
        console.warn("Error saving housing:", error.message);
      }
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
        custom_supplier_price: null,
        building_type: "",
        id_user: null,
      };
    },
    async deleteHousing() {
      await this.housingsStore.deleteHousing(this.housing.id_housing);
      this.closeDeleteHousingDialog();
      this.closeDialog();
      this.messagesStore.add({
        color: "success",
        text: "Housing deleted successfully.",
      });
      this.$emit("changeHouse", true); // Emit event to notify parent component
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

    watch(
      () => this.housingsStore.triggerOpenDialog,
      (val) => {
        if (val) {
          this.addHousing();
          this.housingsStore.triggerOpenDialog = false;
        }
      }
    );
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
  min-height: 100svh - calc(var(--v-app-bar-height) + var(--v-navigation-drawer-width));
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

.scroll>* {
  flex-shrink: 0;
}

.v-list-group__items .v-list-item {
  padding-inline-start: 8px !important;
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
