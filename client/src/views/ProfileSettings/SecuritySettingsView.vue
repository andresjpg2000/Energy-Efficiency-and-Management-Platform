<template>
  <v-container class="container">
    <v-row class="mb-4">
      <h1 class="text-h5 pl-4">Security Settings</h1>
    </v-row>
    <v-card class="pa-4">
      <v-form ref="form" @submit.prevent="formSubmit">
        <p class="text-h6">Protect your data</p>

        <v-row>
          <v-col>
            <v-checkbox v-model="localTwoFactorEnabled" @change="handleToggleTwoFactor"
              label="Enable two factor authentication" class="ms-n2" hide-details></v-checkbox>
          </v-col>
        </v-row>

        <p class="text-h6 mb-4">Change your password</p>
        <v-row>
          <v-col>
            <!-- This field is hidden to improve UX  -->
            <v-text-field variant="outlined" label="username" density="default" v-model="userEmail" type="text"
              autocomplete="username" name="username" style="display: none;">
            </v-text-field>

            <v-text-field variant="outlined" label="Current Password" density="default" v-model="CurrentPassword"
              placeholder="" type="password" hint="Password must be less than 10 characters" :persistent-hint="false"
              class="" autocomplete="new-password" name="Current Password" :rules="passwordRules"
              @input="currentPasswordTouched = true">
              <template v-slot:loader>
                <v-progress-linear :active="currentPasswordTouched" :color="color(CurrentPassword)"
                  :model-value="progress(CurrentPassword)" :indeterminate="isSubmitting" height="7"></v-progress-linear>
              </template>
            </v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-text-field variant="outlined" label="New Password" density="default" v-model="NewPassword" placeholder=""
              type="password" hint="Password must be less than 10 characters" :persistent-hint="false" class=""
              autocomplete="new-password" name="New Password" :rules="passwordRules" @input="newPasswordTouched = true">
              <template v-slot:loader>
                <v-progress-linear :active="newPasswordTouched" :color="color(NewPassword)"
                  :model-value="progress(NewPassword)" :indeterminate="isSubmitting" height="7"></v-progress-linear>
              </template>
            </v-text-field>
          </v-col>

          <v-col>
            <v-text-field variant="outlined" label="Confirm New Password" density="default" v-model="ConfirmPassword"
              placeholder="" type="password" hint="Password must be less than 10 characters" :persistent-hint="false"
              class="" autocomplete="new-password" name="Confirm Password" :rules="passwordRules"
              @input="confirmPasswordTouched = true">
              <template v-slot:loader>
                <v-progress-linear :active="confirmPasswordTouched" :color="color(ConfirmPassword)"
                  :model-value="progress(ConfirmPassword)" :indeterminate="isSubmitting" height="7"></v-progress-linear>
              </template>
            </v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col>

            <v-btn color="success" :loading="isSubmitting" block class="mt-4 mb-4" variant="flat" size="large"
              @click="formSubmit">Save Changes</v-btn>

          </v-col>
        </v-row>
      </v-form>
    </v-card>
  </v-container>
</template>

<script>
import { useMessagesStore } from '@/stores/messages';
import { useAuthStore } from '@/stores/auth';
import { fetchWithAuth } from '@/utils/fetchWithAuth.js';
import { URL } from '@/utils/constants.js';

export default {
  data() {
    const authStore = useAuthStore();
    return {
      authStore,
      useMessagesStore: useMessagesStore(),
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
      localTwoFactorEnabled: authStore.isTwoFactorEnabled || false,
      currentPasswordTouched: false,
      newPasswordTouched: false,
      confirmPasswordTouched: false,
    }
  },
  computed: {
    isTwoFactorEnabled() {
      return this.authStore.isTwoFactorEnabled;
    },
  },
  methods: {
    async formSubmit() {
      // Handle form submission logic here
      if (this.$refs.form.validate()) {
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
        try {
          const response = await fetchWithAuth(`${URL}/users/${this.authStore.getUserId}/changePassword`, {
            method: 'PATCH',
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
    async toggleTwoFactor() {
      this.isSubmitting = true;
      try {
        const response = await fetchWithAuth(`${URL}/users/${this.authStore.getUserId}/toggle-2fa`, {
          method: 'PATCH',
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || 'Failed to toggle two-factor authentication');
        }

        const updatedUser = await response.json();
        this.authStore.updateUserState(updatedUser);

        useMessagesStore().add({
          color: 'success',
          text: `Two-factor authentication ${this.localTwoFactorEnabled ? 'enabled' : 'disabled'} successfully.`,
        });
      } catch (error) {
        useMessagesStore().add({
          color: 'error',
          text: error.message || 'An unexpected error occurred.',
        });
      } finally {
        this.isSubmitting = false;
      }
    },
    async handleToggleTwoFactor() {
      await this.toggleTwoFactor();
      this.localTwoFactorEnabled = this.authStore.isTwoFactorEnabled;
    },
    progress(password) {
      if (!password) return 0;
      if (password.length <= 2) {
        return 20;
      }
      if (password.length <= 5) {
        return 50;
      }
      return 100;
    },
    color(password) {
      if (!password) return 'grey';
      if (password.length <= 2) return 'error';
      if (password.length <= 5) return 'warning';
      return 'success';
    },
  },
  mounted() {
    this.userEmail = this.authStore.getUserEmail;
    console.log('✅ SecuritySettingsView mounted!');
  }
}
</script>

<style scoped></style>