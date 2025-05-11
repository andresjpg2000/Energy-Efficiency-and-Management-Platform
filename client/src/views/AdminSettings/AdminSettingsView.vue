<script >
import AppShell from '@/components/AppShell.vue';

  export default {
    name: 'DashboardView',
    components: {
      AppShell
    },
    data() {
      return {
        items:[
          {
            title: 'User Management',
            prependIcon: 'mdi-account-outline', // View all users(table), Edit user, delete user, see user activity*
            to: '/admin/user-management',
            exact: true,
          },
          {
            title: 'Energy Data Monitoring',
            prependIcon: 'mdi-lightning-bolt-outline', // See aggregated data (global, by region, by household), detect anomalies, export data (csv, or other formats)
            to: '/admin/energy-monitoring',
          },
          {
            title: 'System Settings',
            prependIcon: 'mdi-cog-outline', // Manage system settings, configure system parameters, manage system updates, like first time setup messages etc...
            to: '/admin/system-settings',
          },
          {
            title: 'Analytics Overview', // Visual charts, graphs, and reports, like energy consumption trends, user activity trends, etc.
            prependIcon: 'mdi-chart-line',
            to: '/admin/analytics',
          },
          
        ],
      };
    },
    methods: {
      // Define your methods here
    },
    mounted () {
      
    },
  } 
</script>


<template>
  <AppShell :items="items" :showSettings="false">
    <router-view></router-view>
  </AppShell>
</template>

<style>

</style>
