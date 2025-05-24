<template>
  <v-container class="container">
    <v-row justify="space-between" align="center" class="mb-4">
      <h1 class="text-h5 pl-4">Suppliers Management</h1>
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
import { useMessagesStore } from '@/stores/messages.js';
import { useSuppliersStore } from '@/stores/suppliers.js';

export default {
  data() {
    return {
      headers: [
        { title: 'ID', key: 'id' },
        { title: 'ENTERPRISE', key: 'enterprise' },
        { title: 'COST_KWH', key: 'cost_kWh' },
        { title: 'ACTIONS', key: 'actions', sortable: false },
      ],
      openDialog: false,
      editingSupplier: null,
      form: {
        enterprise: "",
        cost_kWh: "",
      },
      messagesStore: null,
      suppliersStore: null,
    };
  },
  computed: {
    Suppliers() {
      return this.suppliersStore.suppliers;
    },
  },
  methods: {
    editSupplier(Supplier) {
      this.editingSupplier = Supplier;
      this.form.enterprise = Supplier.enterprise;
      this.form.cost_kWh = Supplier.cost_kWh;
      this.openDialog = true;
    },
    async deleteSupplier(Supplier) {
      try {
          await this.suppliersStore.deleteSupplier(Supplier.id);
          this.messagesStore.add({
            color: 'success',
            text: 'Supplier deleted successfully!',
          });

        } catch (error) {
          this.messagesStore.add({
              color: 'error',
              text: error.message || 'Error editing supplier',
          });
        }
    },
    async saveSupplier() {
      try {
        if (this.editingSupplier) {
          await this.suppliersStore.updateSupplier({
            id: this.editingSupplier.id,
            enterprise: this.form.enterprise,
            cost_kWh: this.form.cost_kWh,
          });
          this.messagesStore.add({
            color: 'success',
            text: 'Supplier updated successfully!',
          });
        } else {
          await this.suppliersStore.addSupplier({
            enterprise: this.form.enterprise,
            cost_kWh: this.form.cost_kWh,
          });
          this.messagesStore.add({
            color: 'success',
            text: 'Supplier added successfully!',
          });
        }
      } catch (error) {
        this.messagesStore.add({
          color: 'error',
          text: error.message || 'Error saving supplier',
        });
      } finally {
        this.closeDialog();
      }
    },
    closeDialog() {
      this.openDialog = false;
      this.editingSupplier = null;
      this.form.enterprise = '';
      this.form.cost_kWh = '';
    },
  },
  mounted() {
    
  },
  async created() {
    this.messagesStore = useMessagesStore();
    this.suppliersStore = useSuppliersStore();
    await this.suppliersStore.fetchSuppliers();
  },
};
</script>

<style scoped>



</style>