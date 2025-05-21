<template>
  <v-container class="mt-4 container">
    <v-row justify="space-between" align="center" class="mb-4">
      <h1 class="text-h5">User Management</h1>
    </v-row>

    <v-data-table-server
      :headers="headers"
      :items="users"
      :items-per-page="itemsPerPage"
      :items-length="totalItems"
      :loading="loading"
      :page="page"
      @update:page="onPageChange"
      item-value="id_user"
      class="elevation-1 p-0"
    >
      <template #item.actions="{ item }">
        <v-icon small class="me-2" @click="editUser(item)">mdi-pencil</v-icon>
        <v-icon small color="red" @click="deleteUser(item)">mdi-delete</v-icon>
      </template>
    </v-data-table-server>

    <!-- Dialog for Adding/Editing User -->
    <v-dialog v-model="openDialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h6">Edit User</span>
        </v-card-title>

        <v-card-text>
          <v-text-field v-model="form.name" variant="outlined" label="Name" required></v-text-field>
          <v-text-field v-model="form.email" variant="outlined" label="Email" required></v-text-field>
          <v-checkbox
            v-model="form.admin"
            label="Admin"
          />
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="closeDialog">Cancel</v-btn>
          <v-btn color="primary" @click="saveUser">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { useUsersStore } from '@/stores/usersStore';

export default {

  data() {
    return {
      usersStore: useUsersStore(),
      headers: [
        { title: 'ID', key: 'id_user' },
        { title: 'NAME', key: 'name' },
        { title: 'EMAIL', key: 'email' },
        { title: 'ADMIN', key: 'admin' },
        { title: 'ACTIONS', key: 'actions', sortable: false },
      ],
      users: [],
      openDialog: false,
      editingUser: null,
      form: {
        name: "",
        email: "",
        admin: false,
      },
      loading: false,
      totalItems: 0,
      page: 1,
      itemsPerPage: 10,
    };
  },
  methods: {
    async fetchUsers() {
      this.loading = true
      try {
        const response = await fetch(`http://localhost:3000/users?limit=${this.itemsPerPage}&page=${this.page}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${this.usersStore.token}`,
          },
        });

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.message || 'Network response was not ok')
        }
        
        const data = await response.json()

        this.users = data.users;
        this.totalItems = data.total;
      } catch (error) {
        throw error;
      } finally {
        this.loading = false
      }
    },
    editUser(user) {
      this.editingUser = user;
      this.form.name = user.name;
      this.form.email = user.email;
      this.form.admin = user.admin;
      this.openDialog = true;
    },
    async deleteUser(user) {
      // Not working because of relation with housings. Must delete housings from the user first
      
      try {
        const response = await fetch(`http://localhost:3000/users/${user.id_user}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${this.usersStore.token}`,
          },
        });

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.message || 'Network response was not ok')
        }

      } catch (error) {
        throw error;
      } finally {
        this.fetchUsers();
      }
    },
    async saveUser() {
        try {
        const response = await fetch(`http://localhost:3000/users/${this.editingUser.id_user}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${this.usersStore.token}`,
          },
          body: JSON.stringify({
            name: this.form.name,
            email: this.form.email,
            admin: this.form.admin,
          }),
        });

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.message || 'Network response was not ok')
        }
        
      } catch (error) {
        throw error;
      } finally {
        this.fetchUsers();
      }

      this.closeDialog();
    },
    closeDialog() {
      this.openDialog = false;
      this.editingUser = null;
      this.form.name = '';
      this.form.email = '';
      this.form.admin = false;
    },
    onPageChange(newPage) {
      this.page = parseInt(newPage);
      this.fetchUsers();
    },
  },
  mounted() {
    this.fetchUsers();
  },
  watch: {
    itemsPerPage() {
      this.page = 1; 
      this.fetchUsers();
    },
  },
};
</script>

<style scoped>

</style>