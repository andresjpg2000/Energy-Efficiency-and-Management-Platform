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
                  <!-- This field is hidden to improve UX  -->
                  <v-text-field variant="outlined" label="username" density="default" v-model="userEmail" type="text" autocomplete="username" name="username" style="display: none;">
                  </v-text-field>

                  <v-text-field variant="outlined" label="Current Password" density="default" v-model="CurrentPassword" placeholder="" type="password" hint="Password must be less than 10 characters" :persistent-hint="false" class="" autocomplete="new-password" name="Current Password" :rules="passwordRules">
                  </v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col>
                  <v-text-field variant="outlined" label="New Password" density="default" v-model="NewPassword" placeholder="" type="password" hint="Password must be less than 10 characters" :persistent-hint="false" class="" autocomplete="new-password" name="New Password" :rules="passwordRules">
                  </v-text-field>
                </v-col>

                <v-col>
                  <v-text-field variant="outlined" label="Confirm New Password" density="default" v-model="ConfirmPassword" placeholder="" type="password" hint="Password must be less than 10 characters" :persistent-hint="false" class="" autocomplete="new-password" name="Confirm Password" :rules="passwordRules">
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
import { useMessagesStore } from '@/stores/messages';
import { useAuthStore } from '@/stores/auth';
import { getToken } from '@/utils/token.js';

  export default {
    data() {
      return {
        authStore: useAuthStore(),
        useMessagesStore: useMessagesStore(),
        token: getToken(),
        form: null,
        isSubmitting: false,
        userEmail: "",
        CurrentPassword: "",
        NewPassword: "",
        ConfirmPassword: "",
        passwordRules: [
          (v) => !!v || 'Password is required',
          (v) => v === v.trim() || 'Password cannot start or end with spaces',
          (v) => v.length <= 10 || 'Password must be less than 10 characters'
        ],
      }
    },
    methods: {
      async formSubmit() {
        // Handle form submission logic here
        if (this.$refs.form.validate()) {
          
          // Trocar isto para verificar se o campo é igual à password na base de dados
          if (this.CurrentPassword.length > 10 || this.CurrentPassword.length == 0) {
            console.error("Current password must be less than 10 characters and cannot be empty.");
            return;
          }

          if (this.NewPassword.length > 10 || this.NewPassword.length == 0) {
            console.error("New password must be less than 10 characters and cannot be empty.");
            return;
          }

          if (this.ConfirmPassword.length > 10 || this.ConfirmPassword.length == 0) {
            console.error("Confirm password must be less than 10 characters and cannot be empty.");
            return;
          }

          if (this.NewPassword !== this.ConfirmPassword) {
            useMessagesStore().add({
              color: 'error',
              text: 'New password and confirm password do not match.',
            });
            return;
          }

          this.isSubmitting = true;

          this.data = {
            currentPassword: this.CurrentPassword,
            newPassword: this.NewPassword,
          };
          console.log(this.token);
          console.log("Data being sent:",this.data);
          try {
            const response = await fetch(`http://localhost:3000/users/${this.authStore.getUserId}/changePassword`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${this.token}`,
              },
              body: JSON.stringify(this.data),
            });

            if (!response.ok) {
              const data = await response.json();
              throw new Error(data.message || 'Failed to change password');
            }

            this.isSubmitting = false;
            useMessagesStore().add({
              color: 'success',
              text: 'Password changed successfully.',
            });
          } catch (error) {
            let message = error.message || 'An unexpected error occurred.';

            if (error.details) {
              message = error.details.map(detail => `${detail.field}: ${detail.message}`).join(', ');
            }

            useMessagesStore().add({
              color: 'error',
              text: message,
            });

            this.isSubmitting = false;
          }
          
        } else {
          useMessagesStore().add({
            color: 'error',
            text: 'Error changing password.',
          });
        }

      },
    },
    mounted() {
      this.userEmail = this.authStore.getUserEmail;
      console.log('✅ SecuritySettingsView mounted!');
    }
  }
</script>

<style scoped>

</style>