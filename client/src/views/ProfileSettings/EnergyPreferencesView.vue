<template>
  <v-container class="container">
    <v-row justify="space-between" align="center" class="mb-4">
      <h1 class="text-h5 pl-4">Energy Preferences</h1>
    </v-row>
    <v-card class="pa-4">
      <p class="text-subtitle-1 mb-4">Select your current energy supplier</p>
      <v-form ref="form" @submit.prevent="formSubmit">
        <v-row>
          <v-col>
            <v-select 
              variant="outlined" 
              label="Energy Suppliers" 
              density="default" 
              v-model="selectedSupplier" 
              :clearable="false" 
              :multiple="false" 
              placeholder="Choose your current energy supplier" 
              :items="formattedSuppliers" item-title="title" 
              item-value="value" name="Suppliers" 
              :rules="supplierRules"
            >
            </v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn color="primary" :loading="isSubmitting" block class="mt-4" variant="flat" size="large" @click="formSubmit">
              Save Changes
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card>
  </v-container>
</template>

<script>
import { useSuppliersStore } from "@/stores/suppliers.js";
import { useHousingsStore } from "@/stores/housings.js";
import { useMessagesStore } from "@/stores/messages.js";
  export default {
    data() {
      return {
        suppliersStore: useSuppliersStore(),
        housingsStore: useHousingsStore(),
        messagesStore: useMessagesStore(),
        form: null,
        isSubmitting: false,
        selectedSupplier: null,
        supplierRules: [
          (v) => !!v || "Energy supplier is required",
        ],
      }
    },
    computed: {
      suppliers() {
        return this.suppliersStore.suppliers;
      },
      formattedSuppliers() {
        return this.suppliers.map(supplier => ({
          title: `${supplier.enterprise} - ${supplier.cost_kWh} €/kWh`,
          value: supplier.id,
        }));
      },
    },
    methods: {
      formSubmit() {
        this.isSubmitting = true;
        // Handle form submission logic here
        if (this.$refs.form.validate()) {
          
          if (!this.selectedSupplier) {
            this.messagesStore.add({
              color: 'error',
              text: 'Please select an energy supplier.',
            });
            this.isSubmitting = false;
            return;
          }

          try {
            this.housingsStore.updateHousing({id_supplier: this.selectedSupplier})
            this.messagesStore.add({
              color: 'success',
              text: 'Energy supplier updated successfully.',
            });
            this.isSubmitting = false;
          } catch (error) {
            this.messagesStore.add({
              color: 'error',
              text: 'Failed to update energy supplier. Please try again.',
            });
            this.isSubmitting = false;
          }
        
        } else {
          this.messagesStore.add({
            color: 'error',
            text: 'Please correct the errors in the form.',
          });
          this.isSubmitting = false;
          return;
        }

      },
    },
    mounted() {
      this.suppliersStore.fetchSuppliers("id,enterprise,cost_kWh");
      console.log('✅ EnergyPreferenceView mounted!');
    }
  }
</script>

<style scoped>

</style>