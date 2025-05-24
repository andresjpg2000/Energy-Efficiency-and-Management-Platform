<template>
  <v-container class="mt-4 container">
    <v-row justify="space-between" align="center" class="mb-4">
      <h1 class="text-h5">Energy Monitoring</h1>
    </v-row>
    <v-card class="pa-4">
      <v-form ref="form" @submit.prevent="formSubmit">
        <v-row>
          <v-col>
        
          </v-col>
          <v-col>
          </v-col>
        </v-row>
        <v-row>
          <v-col>

          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn color="primary" :loading="isSubmitting" block class="mt-4" variant="flat" size="large" @click="formSubmit">Save Changes</v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card>
  </v-container>
</template>

<script>
  export default {
    data() {
      return {
        form: null,
        isSubmitting: false,
        
      }
    },
    methods: {
      formSubmit() {
        // Handle form submission logic here
        if (this.$refs.form.validate()) {
          
          
          this.isSubmitting = true;

          setTimeout(() => {
            this.isSubmitting = false;

            console.log("Form submitted with data:", {
              
            });
            // Chamar API para atualizar os dados do usuário 
          }, 1500);
          
        } else {
          console.log("Form validation failed.");
        }

      },
    },
    mounted() {
      console.log('✅ EnergyMonitoringView mounted!');
    }
  }
</script>

<style>

</style>