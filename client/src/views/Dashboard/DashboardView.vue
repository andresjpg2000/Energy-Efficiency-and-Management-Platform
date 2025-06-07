<script>
import { GridStack } from "gridstack";
import graphicWiget from "@/components/graphic.widget.vue";
import SparkChart from "@/components/SparkChart.vue";
import ColumnWiget from "@/components/Column.widget.vue";
import VerticalColumnWidget from "@/components/VerticalColumn.widget.vue";

import { useWidgetsStore } from "@/stores/widgetsStore";
import { useHousingsStore } from "@/stores/housings";
import { useSuppliersStore } from "@/stores/suppliers.js";
import { useAuthStore } from "@/stores/auth.js";
import { useMessagesStore } from "@/stores/messages.js";

export default {
  name: "DashboardView",
  components: {
    graphicWiget,
    SparkChart,
    ColumnWiget,
    VerticalColumnWidget,
  },
  data() {
    return {
      housingsStore: useHousingsStore(),
      suppliersStore: useSuppliersStore(),
      widgetsStore: useWidgetsStore(),
      authStore: useAuthStore(),
      messagesStore: useMessagesStore(),
      saveTimeout: null,
      changedWidgets: new Set(), // para armazenar widgets alterados, set so permite valores únicos
      selectedHouse: null, // para armazenar a casa selecionada
      grid: null, // para armazenar a instância do GridStack
      doEnable: true,
      float: false, // para controlar o modo de flutuação
      isEditMode: false,
      openDialog: false, // para controlar o estado do diálogo
      openDeleteDialog: false, // para controlar o estado do diálogo de apagar moradia
      housing: {
        address: "",
        pc: "",
        location: "",
        selectedSupplier: null,
        building_type: "",
        id_user: null,
      },
    };
  },
  computed: {
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
    remove() {
      this.doEnable = !this.doEnable; // alterna o estado de remoção
      this.grid.movable(this.doEnable); // define se os widgets são estáticos ou não
    },
    alterFloat() {
      this.float = !this.float; // alterna o estado de flutuação
      this.grid.float(this.float);
      console.log("Float mode:", this.float);
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
          selectedSupplier: selected.id_supplier,
        };
        this.housing.location = await this.housingsStore.fetchLocationByHousingId(selected.id_housing);
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
        selectedSupplier: null,
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
  beforeRouteLeave(to, from, next) {
    if (this.saveTimeout && window.innerWidth > 950) {
      clearTimeout(this.saveTimeout);
      this.saveTimeout = null;

      this.widgetsStore
        .updateDBWidgets([...this.changedWidgets])
        .then(() => {
          console.log("Widgets atualizados com sucesso.");
          this.changedWidgets.clear();
          next();
        })
        .catch((error) => {
          console.error("Erro ao atualizar widgets antes de sair:", error);
          next();
        });
    } else {
      next();
    }
  },
  created() {
    
  },

  mounted() {
    // Fetch suppliers
    this.suppliersStore.fetchSuppliers("id,enterprise,cost_kWh");
    // Initialize GridStack
    this.grid = GridStack.init({
      float: false,
      cellHeight: "120px",
      columnOpts: {
        breakpoints: [
          { w: 700, c: 1 },
          { w: 850, c: 1 },
          { w: 950, c: 2 },
          { w: 1100, c: 9 },
        ],
      },
    });

    this.grid.on("change", (event, items) => {
      items.forEach((item) => {
        console.log("Item moved:", item.el.id, "to", item.x, item.y);

        this.widgetsStore.updateWidget(item.x, item.y, item.el.id);

        this.changedWidgets.add(item.el.id);
      });

      this.saveTimeout = setTimeout(() => {
        if (window.innerWidth > 950) {
          this.widgetsStore.updateDBWidgets([...this.changedWidgets]);
          this.changedWidgets.clear();
        } else {
          console.log("📱 Mobile width detected. Not saving widget positions.");
        }
      }, 10000);
    });
  },
};
</script>

<template>
  <v-expansion-panels>
    <v-expansion-panel rounded="lg" title="Dashboard Settings">
      <v-expansion-panel-text>
        <v-row>
          <v-col cols="12" md="6">
            <v-row class="d-flex align-center ga-0">
                <v-chip-group
                  mandatory
                  selected-class="text-success"
                  v-model="housingsStore.selectedHousingId"
                >
                  <v-chip
                    filter
                    selected
                    v-for="house in housingsStore.housings"
                    :key="house.id_housing"
                    rounded="lg"
                    :value="house.id_housing"
                    @click="housingsStore.selectedHousingId = house.id_housing"
                    >{{ house.building_type }}</v-chip
                  >
              </v-chip-group>
              <v-btn
                density="comfortable"
                class="mx-2"
                color="success"
                rounded="lg"
                variant="outlined"
                @click="addHousing"
              ><v-icon>mdi-plus add</v-icon> add housing</v-btn>
              <v-btn
                density="comfortable"
                class="mx-2"
                color="success"
                rounded="lg"
                variant="outlined"
                @click="editHouse"
              ><v-icon>mdi-pencil</v-icon> edit housing</v-btn>
            </v-row>
          </v-col>
          <v-col cols="12" md="6" class="d-flex justify-end">
            <v-btn
              density="comfortable"
              class="mx-4"
              color="success"
              rounded="lg"
              variant="outlined"
              @click="alterFloat"
              :text="float ? 'Disable Float' : 'Enable Float'"
            ></v-btn>
            <v-btn
              density="comfortable"
              class="mx-4"
              color="success"
              rounded="lg"
              variant="outlined"
              @click="remove"
            >
              <v-icon class="pr-3" left>mdi-pencil</v-icon>
              {{ doEnable ? "Disable Edit mode" : "Enable Edit mode" }}
            </v-btn>
          </v-col>
        </v-row>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
  <v-sheet color="#E0E0E0" rounded="lg" width="100%" class="grid-stack">
    <div
      class="grid-stack-item widgets"
      v-for="(item, i) in widgetsStore.userWidgets"
      :key="i"
      :gs-x="item.body.x"
      :gs-y="item.body.y"
      :gs-w="item.body.w"
      :gs-h="item.body.h"
      :id="item.title"
    >
      <div class="grid-stack-item-content border-1 elevation-2 rounded-xl">
        <!-- <MinisWiget v-if="item.type == 1" :body="item.body"/> -->
        <graphic-wiget  v-if="item.type == 5" />
        <SparkChart
          v-if="item.type == 1"
          :title="item.title"
          :earn="item.body.earn"
          :name="item.body.name"
        />
        <ColumnWiget v-if="item.type == 2" />
        <VerticalColumnWidget v-if="item.type == 3" />
      </div>
    </div>
  </v-sheet>
  <!-- Dialog for Adding/Editing House -->
  <v-dialog v-model="openDialog" max-width="500px">
    <v-card>
      <v-card-title>
        <span class="text-h6">{{ isEditMode ? 'Edit Housing' : 'Add Housing' }}</span>
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
          v-model="housing.selectedSupplier"
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
        <v-btn v-if="isEditMode" color="error" @click="openDeleteHousingDialog">Delete</v-btn>
        <v-btn text @click="closeDialog">Cancel</v-btn>
        <v-btn color="primary" @click="saveHousing">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <!-- Dialog for confirm deletion of House -->
  <v-dialog v-model="openDeleteDialog" max-width="500px">
    <v-card>
      <v-card-title>Are you sure you want to delete this housing?</v-card-title>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="closeDeleteHousingDialog">Cancel</v-btn>
        <v-btn color="error" @click="deleteHousing">Delete</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style>
.grid-stack-item-content {
  position: relative;
  z-index: 1; /* abaixo do overlay */
}

.v-overlay-container {
  z-index: 9999 !important;
}
.selected {
  background-color: #00863a !important;
}
</style>
