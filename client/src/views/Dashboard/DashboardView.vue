<script >
import { GridStack } from 'gridstack';
import graphicWiget from '@/components/graphic.widget.vue';
import MinisWiget from '@/components/minis.widget.vue';
import SparkChart from '@/components/SparkChart.vue';
import ColumnWiget from '@/components/Column.widget.vue';
import VerticalColumnWidget from '@/components/VerticalColumn.widget.vue';

import { useWidgetsStore } from '@/stores/widgetsStore';
import { useHousingsStore } from '@/stores/housings';
import { useSuppliersStore } from '@/stores/suppliers.js';
import { useAuthStore } from '@/stores/auth.js';

  export default {
    name: 'DashboardView',
    components: {
      graphicWiget,
      SparkChart,
      MinisWiget,
      ColumnWiget,
      VerticalColumnWidget
    },
    data() {
      return {
        housingsStore: useHousingsStore(),
        suppliersStore: useSuppliersStore(),
        widgetsStore: useWidgetsStore(),
        authStore: useAuthStore(), 
        saveTimeout: null,
        changedWidgets: new Set(),// para armazenar widgets alterados, set so permite valores únicos
        selectHouse: null, // para armazenar a casa selecionada
        grid: null, // para armazenar a instância do GridStack
        doEnable: true,
        float: false, // para controlar o modo de flutuação
        openDialog: false, // para controlar o estado do diálogo
        housing: {
          address: '',
          pc: '',
          location: '',
          selectedSupplier: null,
          building_type: '',
          id_user: null,
        },
      };
    },
    computed: {
      suppliers() {
        return this.suppliersStore.suppliers;
      },
      formattedSuppliers() {
        return this.suppliers.map(supplier => ({
          title: `${supplier.enterprise} - ${supplier.cost_kWh} €/kWh`,
          value: supplier.id,
        }));
      },
    },
    methods: {
      remove(){
        this.doEnable = !this.doEnable; // alterna o estado de remoção
        this.grid.movable(this.doEnable); // define se os widgets são estáticos ou não
        
      },
      alterFloat() {
        this.float = !this.float; // alterna o estado de flutuação
        this.grid.float(this.float); 
        console.log("Float mode:", this.float);
        
      },
      addHousing() {
        this.housing.id_user = this.authStore.getUserId;        try {
          this.housingsStore.addHousing(this.housing)
        } catch (error) {
          console.error("Error adding housing:", error);
          return;
        } finally {
          this.openDialog = false;
          this.housing = {
            address: '',
            pc: '',
            location: '',
            selectedSupplier: null,
            building_type: '',
          };
        }
      },
      closeDialog() {
        this.openDialog = false;
        this.housing = {
          address: '',
          pc: '',
          location: '',
          selectedSupplier: null,
          building_type: '',
        };
      },
    },
    beforeRouteLeave(to, from, next) {
      if (this.saveTimeout) {
        clearTimeout(this.saveTimeout);
        this.saveTimeout = null; // limpa o estado
        this.widgetsStore.updateDBWidgets([...this.changedWidgets])
          .then(() => {
            console.log("Widgets atualizados com sucesso.");
            this.changedWidgets.clear(); // Limpa o Set após salvar
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
    created () {
      // Carrega os houses do usuário
      this.housingsStore.fetchHousings()
        .then(() => {
          console.log("Houses loaded");
        })
        .catch(error => {
          console.error("Error loading houses:", error);
        });
    },
    
    mounted () {      
      // Fetch suppliers
      this.suppliersStore.fetchSuppliers("id,enterprise,cost_kWh");
      // Initialize GridStack
      this.grid = GridStack.init({
        float: false,
        cellHeight: '120px',
        columnOpts: {
          breakpoints: [{w:700, c:1},{w:850, c:1},{w:950, c:6},{w:1100, c:9}]
        },
      })

      this.grid.on('change', (event, items) => { 
        items.forEach(item => {
          console.log("Item moved:", item.el.id, "to", item.x, item.y);
          
          this.widgetsStore.updateWidget(item.x, item.y, item.el.id);
          
          this.changedWidgets.add(item.el.id);
        });

        clearTimeout(this.saveTimeout);
        this.saveTimeout = setTimeout(() => {
          this.widgetsStore.updateDBWidgets([...this.changedWidgets]); // converter Set para Array
          this.changedWidgets.clear(); // Limpa o Set após salvar
        }, 10000);
      });
    },
  } 
</script>


<template>
  <v-expansion-panels>
    <v-expansion-panel
      rounded="lg"
      title="Dashboard Settings"
    >
      <v-expansion-panel-text>
        <v-row>
          <v-col cols="12" md="6">
            <v-chip-group mandatory selected-class="text-success" v-model="housingsStore.selectedHousingId">
              <v-chip filter selected v-for="house in housingsStore.housings" :key="house.id_housing" rounded="lg" :value="house.id_housing" >{{ house.building_type }}</v-chip>
              <v-chip :value="null" :ripple="false" rounded="lg" @click="openDialog=true" color="primary"><v-icon>mdi-plus</v-icon></v-chip>
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
              {{ doEnable ? 'Disable Edit mode' : 'Enable Edit mode' }}
            </v-btn>
          </v-col>
        </v-row>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
  <v-sheet
    color="#E0E0E0"
    rounded="lg"
    width="100%"
    class="grid-stack"
  >
    
    <div class="grid-stack-item widgets" v-for="(item,i) in widgetsStore.userWidgets" 
    :key="i" 
    :gs-x="item.body.x" 
    :gs-y="item.body.y" 
    :gs-w="item.body.w" 
    :gs-h="item.body.h" 
    :id="item.title">
      <div class="grid-stack-item-content border-1 elevation-2 rounded-xl">
        <!-- <MinisWiget v-if="item.type == 1" :body="item.body"/> -->
        <graphic-wiget lazyLoad v-if="item.type == 5" />
        <SparkChart lazyLoad v-if="item.type == 1" :body="item.body" :earn="item.body.earn" :name="item.body.name"/>
        <ColumnWiget lazyLoad v-if="item.type == 2"/>
        <VerticalColumnWidget lazyLoad v-if="item.type == 3"/>
      </div>
    </div>      
  </v-sheet>
  <!-- Dialog for Adding/Editing House -->
  <v-dialog v-model="openDialog" max-width="500px">
    <v-card>
      <v-card-title>
        <span class="text-h6">Add Housing</span>
      </v-card-title>

      <v-card-text>
        <v-text-field v-model="housing.address" variant="outlined" label="Address" required></v-text-field>
        <v-text-field v-model="housing.pc" variant="outlined" label="Postal Code" required></v-text-field>
        <v-text-field v-model="housing.location" variant="outlined" label="Location" required></v-text-field>
        <v-select 
          variant="outlined" 
          label="Energy Suppliers" 
          density="default" 
          v-model="housing.selectedSupplier" 
          :clearable="false" 
          :multiple="false" 
          placeholder="Choose your current energy supplier" 
          :items="formattedSuppliers" item-title="title" 
          item-value="value" name="Suppliers" 
        >
        </v-select>
        <v-select 
          variant="outlined" 
          label="Building Type" 
          density="default" 
          v-model="housing.building_type" 
          :clearable="false" 
          :multiple="false" 
          placeholder="Choose the type of building"
          :items="['flat', 'house', 'studio']" 
        ></v-select>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="closeDialog">Cancel</v-btn>
        <v-btn color="primary" @click="addHousing">Save</v-btn>
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
