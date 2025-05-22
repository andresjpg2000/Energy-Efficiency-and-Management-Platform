<script >
import { GridStack } from 'gridstack';
import graphicWiget from '@/components/graphic.widget.vue';
import MinisWiget from '@/components/minis.widget.vue';
import SparkChart from '@/components/SparkChart.vue';
import ColumnWiget from '@/components/Column.widget.vue';
import VerticalColumnWidget from '@/components/VerticalColumn.widget.vue';

import { useWidgetsStore } from '@/stores/widgetsStore';

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
        widgetsStore: useWidgetsStore(), 
        gridItems: [
        {
          type: 1,
          title: 'Corrent-Consumption',
          body:{
            name: 'Current Energy Consumption',
            earn: '4,42,236',
            x: 0, y: 0,
            w: 3, h: 2
          }
        },
        {
          type: 1,
          title: 'Energy-Production',
          body:{
            name: 'Renewable Energy Production',
            earn: '78,250',
            x: 3, y: 0,
            w: 3, h: 2
        }
        },
        {
          type: 1,
          title: 'Total-Consumption',
          body:{
            name: 'Total Consumption this year',
            earn: '18,800',
            x: 6, y: 0,
            w: 3, h: 2}
        },
        {
          type: 1,
          title: 'Total-Expenses',
          body:{  
            name: 'Expected Expenses (This Month)',
            earn: '$35,078',
            x: 9, y: 0,
            w: 3, h: 2}
        },
        { type: 5,
          title: "Graphic",
          body:{ x: 0, y: 6, w: 6, h: 3 }
        },
        { type: 2,
          title: "Column",
          body:{ x: 0, y: 9, w: 12, h: 3 }
        },
        { type: 3,
          title: "Vertical-Column",
          body:{ x: 6, y: 3, w: 6 , h: 3 }
        },
        ],
      };
    },
    methods: {
     
    },
    created () {
      // try {
      //   this.widgetsStore.fetchUserWidgets();
      // } catch (error) {
      //   console.error("Error in created lifecycle hook:", error);
      // }
      // console.log("-----------------------created---------------------------------");
      // console.log(this.widgetsStore.userWidgets);
    },
    mounted () {
      // Initialize GridStack
      let grid = GridStack.init({
        float: false,
        cellHeight: '120px',
        columnOpts: {
          breakpointForWindow: true,  // test window vs grid size
          breakpoints: [{w:700, c:1},{w:850, c:1},{w:950, c:6},{w:1100, c:9}]
        },
        disableResize: true,
      })

      
      
      grid.on('dragstop', function(_, el) {
        // You can handle dragstop event here if needed
        // Example: let x = parseInt(el.getAttribute('gs-x')) || 0;
        // let node = el.gridstackNode; // {x, y, width, height, id, ....}

        console.log(el.id);
        console.log(el.gridstackNode);
        let updateWidget = {
          id: el.id,
          body:{
            x: el.gridstackNode.x,
            y: el.gridstackNode.y
          }
        }
        console.log("updateWidget", updateWidget);
        console.log("json: ", JSON.stringify(updateWidget));
        
        
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
            <v-chip-group mandatory class="chips" selected-class="scheduleSelected">
              <v-chip class="scheduleDays" rounded="lg" value="7" >house 1</v-chip>
              <v-chip class="scheduleDays" rounded="lg" value="8" >house 2</v-chip>
              <v-chip class="scheduleDays" rounded="lg" value="9">house 3</v-chip>
            </v-chip-group>
          </v-col>
          <v-col cols="12" md="6" class="d-flex justify-end">
            <v-btn
              class="mx-4"
              color="primary"
            ></v-btn>
            <v-btn
              class="mx-4"
              color="primary"
            >
              <v-icon class="pr-3" left>mdi-pencil</v-icon>
              Edit Mode
            </v-btn>
          </v-col>
        </v-row>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
  <v-sheet
    color="#E0E0E0"
    rounded="lg"
    height="100vh"
    width="100%"
    class="grid-stack"
  >
    
    <div class="grid-stack-item" v-for="(item,i) in widgetsStore.userWidgets" :key="i" :gs-x="item.body.x" :gs-y="item.body.y" :gs-w="item.body.w" :gs-h="item.body.h" :id="item.title">
      <div class="grid-stack-item-content border-1 elevation-2 rounded-xl">
        <!-- <MinisWiget v-if="item.type == 1" :body="item.body"/> -->
        <graphic-wiget v-if="item.type == 5" />
        <SparkChart v-if="item.type == 1" :body="item.body" :earn="item.body.earn" :name="item.body.name"/>
        <ColumnWiget v-if="item.type == 2"/>
        <VerticalColumnWidget v-if="item.type == 3"/>
      </div>
    </div>      
  </v-sheet>
</template>

<style>
  .grid-stack-item-content { 
    position: relative;
    z-index: 1; /* abaixo do overlay */
  }

  .v-overlay-container {
    z-index: 9999 !important;
  }
</style>
