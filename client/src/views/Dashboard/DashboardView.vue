<script>
import { GridStack } from "gridstack";
import graphicWiget from "@/components/graphic.widget.vue";
import SparkChart from "@/components/SparkChart.vue";
import ColumnWiget from "@/components/Column.widget.vue";
import VerticalColumnWidget from "@/components/VerticalColumn.widget.vue";

import { useWidgetsStore } from "@/stores/widgetsStore";
import { useAuthStore } from "@/stores/auth.js";

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
      widgetsStore: useWidgetsStore(),
      saveTimeout: null,
      changedWidgets: new Set(), // para armazenar widgets alterados, set so permite valores únicos
      grid: null, // para armazenar a instância do GridStack
      doEnable: true,
      float: false, // para controlar o modo de flutuação
    };
  },
  computed: {

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

  },
  beforeRouteLeave(to, from, next) {
    //const authStore = useAuthStore();

    //authStore.lastUser = authStore.user.id_user; // salva o usuário atual antes de sair

    if (this.saveTimeout && window.innerWidth > 950) {
      clearTimeout(this.saveTimeout);
      this.saveTimeout = null;

      this.widgetsStore
        .updateDBWidgets([...this.changedWidgets])
        .then(() => {
          console.log("Widgets atualizados com sucesso.");
          this.changedWidgets.clear();
          this.widgetsStore.userWidgets = [];
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

  mounted() {
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
          <v-col cols="12" md="6" class="d-flex justify-end">
            <v-btn density="comfortable" class="mx-4" color="success" rounded="lg" variant="outlined"
              @click="alterFloat" :text="float ? 'Disable Float' : 'Enable Float'"></v-btn>
            <v-btn density="comfortable" class="mx-4" color="success" rounded="lg" variant="outlined" @click="remove">
              <v-icon class="pr-3" left>mdi-pencil</v-icon>
              {{ doEnable ? "Disable Edit mode" : "Enable Edit mode" }}
            </v-btn>
          </v-col>
        </v-row>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
  <v-sheet color="#E0E0E0" rounded="lg" width="100%" class="grid-stack">
    <div class="grid-stack-item widgets" v-for="(item, i) in widgetsStore.userWidgets" :key="i" :gs-x="item.body.x"
      :gs-y="item.body.y" :gs-w="item.body.w" :gs-h="item.body.h" :id="item.title">
      <div class="grid-stack-item-content border-1 elevation-2 rounded-xl">
        <!-- <MinisWiget v-if="item.type == 1" :body="item.body"/> -->
        <graphic-wiget v-if="item.type == 5" />
        <SparkChart v-if="item.type == 1" :title="item.title" :earn="item.body.earn" :name="item.body.name" />
        <ColumnWiget v-if="item.type == 2" />
        <VerticalColumnWidget v-if="item.type == 3" />
      </div>
    </div>
  </v-sheet>
</template>

<style>
.grid-stack-item-content {
  position: relative;
  z-index: 1;
  /* abaixo do overlay */
}

.v-overlay-container {
  z-index: 9999 !important;
}

.selected {
  background-color: #00863a !important;
}
</style>
