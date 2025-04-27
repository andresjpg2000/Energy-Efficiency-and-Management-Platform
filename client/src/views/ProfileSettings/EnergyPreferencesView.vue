<template>
  <div class="main-container">
    <v-row class="d-flex justify-center align-center" style="height: 100vh;">
      <v-col cols="12" md="8" lg="6">
        <v-card class="pa-4 formContainer">
          <v-card-title class="text-h5">Energy Preferences</v-card-title>
          <v-divider></v-divider>
          
            <v-form ref="form" class="mt-8" @submit.prevent="formSubmit">
              <v-row>
                <v-col>
                  
                  <v-select variant="outlined" label="Energy Suppliers" density="default" v-model="selectedSupplier" :clearable="false" :multiple="false" placeholder="Choose your current energy supplier" :items="suppliers" class="" name="Suppliers" :rules="supplierRules">
                    
                  </v-select>
                  
                </v-col>
    
              </v-row>

              <v-row>
                <v-col>
                 
                  <v-btn color="primary" :loading="isSubmitting" block class="mt-4" variant="flat" size="large" @click="formSubmit">Save Changes</v-btn>
                  
                </v-col>
              </v-row>
            </v-form>
         
        </v-card>
      </v-col>
    </v-row>
    
  </div>
</template>

<script>
  export default {
    data() {
      return {
        form: null,
        isSubmitting: false,
        suppliers: [],
        selectedSupplier: null,
        supplierRules: [
          (v) => !!v || "Energy supplier is required",
        ],
      }
    },
    methods: {
      formSubmit() {
        // Handle form submission logic here
        if (this.$refs.form.validate()) {
          
          if (!this.selectedSupplier) {
            console.log("Please select an energy supplier.");
            return;
          }

          this.isSubmitting = true;

          setTimeout(() => {
            this.isSubmitting = false;

            console.log("Form submitted with data:", {
              empresa: this.selectedSupplier,
            });
            // Chamar API para atualizar os dados do usuário 
          }, 1500);
          
        } else {
          console.log("Form validation failed.");
        }

      },
      // async fetchSuppliers() {
      //   try {
      //     const response = await fetch('http://localhost:3000/api/suppliers');
      //     if (!response.ok) {
      //       throw new Error('Network response was not ok');
      //     }
      //     const data = await response.json();
      //     this.suppliers = data;
      //   } catch (error) {
      //     console.error('Error fetching suppliers:', error);
      //   }
      // },
    },
    mounted() {
      
      // this.fetchSuppliers();
      
      console.log('✅ EnergyPreferenceView mounted!');
    }
  }
</script>

<style scoped>

</style>