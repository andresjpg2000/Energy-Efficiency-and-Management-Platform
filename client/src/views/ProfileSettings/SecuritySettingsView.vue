<template>
  <div class="main-container">
    <v-row class="d-flex justify-center align-center" style="height: 100vh;">
      <v-col cols="12" md="8" lg="6">
        <v-card class="pa-4 formContainer">
          <v-card-title class="text-h5">Security Settings</v-card-title>
          <v-divider></v-divider>
          
            <v-form ref="form" class="mt-8" @submit.prevent="formSubmit">
              <v-row>
                <v-col>
                  
                  <v-text-field variant="outlined" label="Current Password" density="default" v-model="CurrentPassword" placeholder="" type="password" hint="Password must be less than 10 characters" :persistent-hint="false" class="" autocomplete="new-password" name="Current Password" :rules="passwordRules">
                  </v-text-field>
                  
                </v-col>
                <v-col>
                  
                  <v-text-field variant="outlined" label="New Password" density="default" v-model="NewPassword" placeholder="" type="password" hint="Password must be less than 10 characters" :persistent-hint="false" class="" autocomplete="new-password" name="New Password" :rules="passwordRules">
                  </v-text-field>
                  
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
        CurrentPassword: "",
        NewPassword: "",
        passwordRules: [
          (v) => !!v || 'Password is required',
          (v) => v === v.trim() || 'Password cannot start or end with spaces',
          (v) => v.length <= 10 || 'Password must be less than 10 characters'
        ],
      }
    },
    methods: {
      formSubmit() {
        // Handle form submission logic here
        if (this.$refs.form.validate()) {
          
          // Trocar isto para verificar se o campo é igual à password na base de dados
          if (this.CurrentPassword.length > 10 || this.CurrentPassword.length == 0) {
            console.error("Email must be less than 10 characters and cannot be empty.");
            return;
          }

          if (this.NewPassword.length > 10 || this.NewPassword.length == 0) {
            console.error("Email must be less than 10 characters and cannot be empty.");
            return;
          }

          this.isSubmitting = true;

          setTimeout(() => {
            this.isSubmitting = false;

            console.log("Form submitted with data:", {
              password: this.NewPassword,
            });
            // Chamar API para atualizar os dados do usuário 
          }, 1500);
          
        } else {
          console.log("Form validation failed.");
        }

      },
    },
    mounted() {
      console.log('✅ SecuritySettingsView mounted!');
    }
  }
</script>

<style scoped>

</style>