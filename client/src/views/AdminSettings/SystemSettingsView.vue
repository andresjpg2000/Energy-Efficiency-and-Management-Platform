<template>
  <v-container class="mt-4 container">
    <v-row justify="space-between" align="center" class="mb-4">
      <h1 class="text-h5">Suppliers Management</h1>
      <v-btn color="primary" @click="openDialog = true">Add Supplier</v-btn>
    </v-row>

    <v-data-table
      :headers="headers"
      :items="Suppliers"
      item-value="id"
      class="elevation-1 p-0"
    >
      <template #item.actions="{ item }">
        <v-icon small class="me-2" @click="editSupplier(item)">mdi-pencil</v-icon>
        <v-icon small color="red" @click="deleteSupplier(item)">mdi-delete</v-icon>
      </template>
    </v-data-table>

    <!-- Dialog for Adding/Editing Supplier -->
    <v-dialog v-model="openDialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h6">{{ editingSupplier ? 'Edit Supplier' : 'Add Supplier' }}</span>
        </v-card-title>

        <v-card-text>
          <v-text-field v-model="form.enterprise" variant="outlined" label="Enteprise" required></v-text-field>
          <v-text-field v-model="form.cost_kWh" variant="outlined" label="Cost_kWh" required></v-text-field>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="closeDialog">Cancel</v-btn>
          <v-btn color="primary" @click="saveSupplier">Save</v-btn>
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
        { title: 'id', key: 'id' },
        { title: 'enterprise', key: 'enterprise' },
        { title: 'cost_kWh', key: 'cost_kWh' },
        { title: 'Actions', key: 'actions', sortable: false },
      ],
      // Trocar quando o backend estiver pronto
      Suppliers: [],
      openDialog: false,
      editingSupplier: null,
      form: {
        enterprise: "",
        cost_kWh: "",
      },
    };
  },
  methods: {
    editSupplier(Supplier) {
      this.editingSupplier = Supplier;
      this.form.enterprise = Supplier.enterprise;
      this.form.cost_kWh = Supplier.cost_kWh;
      this.openDialog = true;
    },
    deleteSupplier(Supplier) {
      this.Suppliers = this.Suppliers.filter(u => u.id !== Supplier.id);
    },
    saveSupplier() {
      if (this.editingSupplier) {
        this.editingSupplier.enterprise = this.form.enterprise;
        this.editingSupplier.cost_kWh = this.form.cost_kWh;
      } else {
        const newSupplier = {
          enterprise: this.form.enterprise,
          cost_kWh: this.form.cost_kWh,
        };
        this.Suppliers.push(newSupplier);
      }
      this.closeDialog();
    },
    closeDialog() {
      this.openDialog = false;
      this.editingSupplier = null;
      this.form.enterprise = '';
      this.form.cost_kWh = '';
    },
    async fetchSuppliers() {
      try {
        const response = await fetch('http://localhost:3000/suppliers');
        if (!response.ok) {
          throw new Error('Failed to fetch suppliers');
        }
        const data = await response.json();
        this.Suppliers = data.data;
      } catch (error) {
        console.error('Error fetching suppliers:', error);
      }
    },
  },
  mounted() {
    this.fetchSuppliers();
  },
};
</script>

<style scoped>



</style>