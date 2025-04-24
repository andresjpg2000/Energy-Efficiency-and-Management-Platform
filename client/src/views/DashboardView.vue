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
        drawer: true,
        rail: true ,
        items:[
          {
            title: 'My Dashboard',
            prependIcon: 'mdi-view-dashboard-outline',
            link: true,
          },
          {
            title: 'My Houses',
            prependIcon: 'mdi-file-chart-outline',
            link: true,
          },
          {
            title: 'Monitoring',
            prependIcon: 'mdi-account-group',
            link: true,
          },
          {
            title: 'Forecasts',
            prependIcon: 'mdi-briefcase-outline',
            link: true,
          },
          {
            title: 'Reports',
            prependIcon: 'mdi-calendar',
            link: true,
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
<v-app>
  <v-layout>
    <v-navigation-drawer v-model="drawer" floating permanent @click="rail = false" :rail="rail">
      <div class="px-4 py-8">
            <h5>AMA </h5>
      </div>
      <v-list density="compact" item-props :items="items" nav />

      <template #append>
        <v-list-item
          class="ma-2"
          link
          nav
          prepend-icon="mdi-cog-outline"
          title="Settings"
        />
      </template>
    </v-navigation-drawer>

    <v-app-bar class="ps-4" flat>
      <template v-slot:prepend>
        <v-app-bar-nav-icon @click.stop="rail = !rail" ></v-app-bar-nav-icon>
      </template>

      <v-app-bar-title>AMA</v-app-bar-title>

      <template #append>
        <v-btn class="mx-4" icon="mdi-bell"></v-btn>

        <v-btn class="text-none mr-8" height="48" icon slim>
          <v-avatar color="surface-light" image="https://cdn.vuetifyjs.com/images/john.png" size="32" />

          <v-menu activator="parent">
            <v-list density="compact" nav>
              <v-list-item append-icon="mdi-cog-outline" link title="Settings" />

              <v-list-item append-icon="mdi-logout" link title="Logout" />
            </v-list>
          </v-menu>
        </v-btn>
      </template>
    </v-app-bar>

    <v-main>
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
    </v-main>
  </v-layout>
</v-app>
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
