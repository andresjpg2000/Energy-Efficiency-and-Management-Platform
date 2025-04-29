<template>
  <AppShell :show-settings="false" :showDrawer="false">
    <!-- <v-container fluid class="d-flex flex-column justify-space-between" style="height: 100vh;">   
      <v-row>
        <v-col class="text-center">
          <h1>Clean the non renewable energy from the screen to go back to the homepage</h1>
        </v-col>
      </v-row>

      <v-row>
        <v-col class="text-center">
          <div class="secret">
            <v-btn color="primary" @click="$router.push('/')">Go to Home</v-btn>
          </div>
        </v-col>
      </v-row>

    </v-container> -->
    <v-container fluid class="d-flex flex-column justify-center align-center" style="height: 100vh;">
          <h1 class="display-1 font-weight-bold">404</h1>
          <h2 class="font-weight-light">Page Not Found</h2>
          <v-btn color="primary" @click="$router.push('/')">Go to Home</v-btn>
    </v-container>
  </AppShell>
</template>

<script>
import AppShell from '@/components/AppShell.vue';

  export default {
    name: 'NotFoundView',
    components: {
      AppShell
    },
    data() {
      return {
        
      };
    },
    methods: {
      
    },
    mounted() {
      
    },
  }
</script>

<style scoped>

</style>