<template>
  <div class="main-container">
    <v-row class="d-flex justify-center align-center" style="height: 100vh;">
      <v-col cols="12" md="8" lg="6">
        <v-card class="pa-4 formContainer">
          <v-card-title class="text-h5">Analytics</v-card-title>
          <v-divider></v-divider>
          
            <v-form ref="form" class="mt-8" @submit.prevent="formSubmit">
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
      console.log('✅ AnalyticsView mounted!');
    }
  }
</script>

<style scoped>

</style>