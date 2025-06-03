<script>
import { GridStack } from "gridstack";
import graphicWiget from "@/components/graphic.widget.vue";
import SparkChart from "@/components/SparkChart.vue";
import ColumnWiget from "@/components/Column.widget.vue";
import VerticalColumnWidget from "@/components/VerticalColumn.widget.vue";
import HousingDialog from "@/components/housingDialog.vue";

import { useWidgetsStore } from "@/stores/widgetsStore";
import { useHousingsStore } from "@/stores/housings";
import { useSuppliersStore } from "@/stores/suppliers.js";
import { useAuthStore } from "@/stores/auth.js";

export default {
  name: "DashboardView",
  components: {
    graphicWiget,
    SparkChart,
    ColumnWiget,
    VerticalColumnWidget,
    HousingDialog,
  },
  data() {
    return {
      housingsStore: useHousingsStore(),
      suppliersStore: useSuppliersStore(),
      widgetsStore: useWidgetsStore(),
      authStore: useAuthStore(),
      saveTimeout: null,
      changedWidgets: new Set(), // para armazenar widgets alterados, set so permite valores únicos
      selectHouse: null, // para armazenar a casa selecionada
      grid: null, // para armazenar a instância do GridStack
      doEnable: true,
      float: false, // para controlar o modo de flutuação
      openDialog: false, // para controlar o estado do diálogo
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
      housing.id_user = this.authStore.getUserId;
      try {
        this.housingsStore.addHousing(housing);
      } catch (error) {
        console.error("Error adding housing:", error);
      }
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
    // Carrega os houses do usuário
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
                >{{ house.building_type }}</v-chip
              >
              <v-chip
                :value="null"
                :ripple="false"
                rounded="lg"
                @click="openDialog = true"
                color="primary"
                ><v-icon>mdi-plus</v-icon></v-chip
              >
            </v-chip-group>
          </v-col>
          <v-col cols="12" md="6" class="d-flex justify-end">
            <v-btn
              density="comfortable"
              class="mx-4"
              color="success"
              rounded="lg"
              variant="tonal"
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
        <graphic-wiget lazyLoad v-if="item.type == 5" />
        <SparkChart
          lazyLoad
          v-if="item.type == 1"
          :title="item.title"
          :earn="item.body.earn"
          :name="item.body.name"
        />
        <ColumnWiget lazyLoad v-if="item.type == 2" />
        <VerticalColumnWidget lazyLoad v-if="item.type == 3" />
      </div>
    </div>
  </v-sheet>
  <!-- Dialog for Adding/Editing House -->
  <HousingDialog
    v-model="openDialog"
    :suppliers="suppliers"
    @save="addHousing"
  />
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
