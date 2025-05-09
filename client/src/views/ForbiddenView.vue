<template>
  <AppShell :show-settings="false" :showDrawer="false">
    <v-container fluid class="d-flex flex-column justify-center align-center" style="height: 100vh;">
          <h1 class="display-1 font-weight-bold">403</h1>
          <h2 class="font-weight-light">You dont have access to this page!</h2>
          <v-btn color="primary" @click="$router.push('/')">Go to Home</v-btn>
    </v-container>
  </AppShell>
</template>

<script>
import AppShell from '@/components/AppShell.vue';

  export default {
    name: 'ForbiddenView',
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