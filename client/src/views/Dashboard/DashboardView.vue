<script >
import { GridStack } from 'gridstack';
import graphicWiget from '@/components/graphic.wiget.vue';
import MinisWiget from '@/components/minis.wiget.vue';

  export default {
    name: 'DashboardView',
    components: {
      graphicWiget,
      MinisWiget
    },
    data() {
      return {
        gridItems: [
        {
          type: 1,
          corpo:{
            name: 'Total Page Views',
            earn: '4,42,236',
            percent: '59.3%',
            color: 'primary',
            icon: "mdi-arrow-top-right",
            text: '35,000',
            x: 0, y: 0,
            w: 3, h: 2
          }
        },
        {
          type: 1,
          corpo:{
            name: 'Total Users',
            earn: '78,250',
            percent: '70.5%',
            color: 'success',
            icon: "mdi-arrow-top-right",
            text: '8,900',
            x: 3, y: 0,
            w: 3, h: 2
        }
        },
        {
          type: 1,
          corpo:{
            name: 'Total Order',
            earn: '18,800',
            percent: '27.4%',
            color: 'warning',
            icon: "mdi-arrow-top-right",
            text: '1,943',
            x: 6, y: 0,
            w: 3, h: 2}
        },
        {
          type: 1,
          corpo:{  
            name: 'Total Sales',
            earn: '$35,078',
            percent: '27.4%',
            color: 'error',
            icon: "mdi-arrow-top-right",
            text: '$20,395',
            x: 9, y: 0,
            w: 3, h: 2}
        },
        { type: 5,
          corpo:{ x: 0, y: 6, w: 6, h: 3 }
        },
        ],
      };
    },
    methods: {
      // Define your methods here
    },
    mounted () {
      let grid = GridStack.init({
          float: false,
          cellHeight: '110',
          columnOpts: {
            breakpointForWindow: true,  // test window vs grid size
            breakpoints: [{w:700, c:1},{w:850, c:3},{w:950, c:6},{w:1100, c:8}]
          },
          disableResize: true,
        });
    },
  } 
</script>


<template>
      <div color="surface-light" class="pa-4">
        <v-sheet
          color="surface-light"
          height="100vh"
          rounded="lg"
          width="100%"
          class="grid-stack"
        >
          
          <div class="grid-stack-item" v-for="(item,i) in gridItems" :key="i" :gs-x="item.corpo.x" :gs-y="item.corpo.y" :gs-w="item.corpo.w" :gs-h="item.corpo.h">
            <div class="grid-stack-item-content border-1 elevation-2 rounded-xl">
              <MinisWiget v-if="item.type == 1" :body="item.corpo"/>
              <graphic-wiget v-if="item.type == 5" />
            </div>
          </div>      
        </v-sheet>
      </div>
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
