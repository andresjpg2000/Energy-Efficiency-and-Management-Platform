<script>
import AppShell from '@/components/AppShell.vue';

export default {
  name: 'DashboardView',
  components: {
    AppShell
  },
  data() {
    return {
      items: [
        {
          title: 'User Management',
          prependIcon: 'mdi-account-outline', // View all users(table), Edit user, delete user, see user activity*
          to: '/admin/user-management',
          exact: true,
        },
        {
          title: 'System Settings',
          prependIcon: 'mdi-cog-outline', // Manage system settings, configure system parameters, manage system updates, like first time setup messages etc...
          to: '/admin/system-settings',
        },
      ],
    };
  },
  methods: {
    // Define your methods here
  },
  mounted() {

  },
} 
</script>


<template>
  <AppShell :items="items" :showSettings="false">
    <router-view></router-view>
  </AppShell>
</template>

<style>
.container {
  max-width: 1200px;
}
</style>
