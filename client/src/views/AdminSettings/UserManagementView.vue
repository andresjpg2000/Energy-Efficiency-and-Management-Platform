<template>
  <v-container class="mt-4">
    <v-row justify="space-between" align="center" class="mb-4">
      <h1 class="text-h5">User Management</h1>
      <v-btn color="primary" @click="openDialog = true">Add User</v-btn>
    </v-row>

    <v-data-table
      :headers="headers"
      :items="users"
      item-value="id"
      class="elevation-1"
    >
      <template #item.actions="{ item }">
        <v-icon small class="me-2" @click="editUser(item)">mdi-pencil</v-icon>
        <v-icon small color="red" @click="deleteUser(item)">mdi-delete</v-icon>
      </template>
    </v-data-table>

    <!-- Dialog for Adding/Editing User -->
    <v-dialog v-model="openDialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h6">{{ editingUser ? 'Edit User' : 'Add User' }}</span>
        </v-card-title>

        <v-card-text>
          <v-text-field v-model="form.name" variant="outlined" label="Name" required></v-text-field>
          <v-text-field v-model="form.email" variant="outlined" label="Email" required></v-text-field>
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
export default {

  data() {
    return {
      headers: [
        { title: 'Name', key: 'name' },
        { title: 'Email', key: 'email' },
        { title: 'Actions', key: 'actions', sortable: false },
      ],
      // Trocar quando o backend estiver pronto
      users: [
        { id: 1, name: 'Alice Smith', email: 'alice@example.com' },
        { id: 2, name: 'Bob Johnson', email: 'bob@example.com' },
      ],
      openDialog: false,
      editingUser: null,
      form: {
        name: "",
        email: "",
      },
    };
  },
  methods: {
    editUser(user) {
      this.editingUser = user;
      this.form.name = user.name;
      this.form.email = user.email;
      this.openDialog = true;
    },
    deleteUser(user) {
      this.users = this.users.filter(u => u.id !== user.id);
    },
    saveUser() {
      if (this.editingUser) {
        this.editingUser.name = this.form.name;
        this.editingUser.email = this.form.email;
      } else {
        const newUser = {
          // Trocar isto quando o backend estiver pronto, o id deve ser gerado pelo backend
          id: Date.now(),
          name: this.form.name,
          email: this.form.email,
        };
        this.users.push(newUser);
      }
      this.closeDialog();
    },
    closeDialog() {
      this.openDialog = false;
      this.editingUser = null;
      this.form.name = '';
      this.form.email = '';
    },
  },
};
</script>
