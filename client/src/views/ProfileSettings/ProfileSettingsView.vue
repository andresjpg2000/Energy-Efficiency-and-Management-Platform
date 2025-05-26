<template>
  <AppShell :items="items" :showSettings="false">
    <router-view></router-view>
  </AppShell>
</template>

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
            title: 'Account information',
            prependIcon: 'mdi-account-outline',
            to: '/settings/account-information',
            exact: true,
          },
          {
            title: 'Security Settings',
            prependIcon: 'mdi-shield-outline',
            to: '/settings/security-settings',
          },
          {
            title: 'Energy Preferences',
            prependIcon: 'mdi-lightning-bolt-outline',
            to: '/settings/energy-preferences',
          },
          {
            title: 'Notification Settings',
            prependIcon: 'mdi-bell-outline',
            to: '/settings/notification-settings',
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

<style>
.container {
  max-width: 1200px;
}
</style>
