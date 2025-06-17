<template>
  <v-container class="container">
    <v-row class="mb-4">
      <h1 class="text-h5 pl-4">Account information</h1>
    </v-row>
    <v-card class="pa-4">
      <p class="text-subtitle-1 mb-4">Update your account information</p>
      <v-form ref="form" @submit.prevent="formSubmit">
        <v-row>
          <v-col>
            <v-text-field variant="outlined" label="First Name" density="default" v-model="FirstName"
              autocomplete="given-name" placeholder="John" type="text" hint="" :persistent-hint="false" class=""
              name="First Name" :rules="firstNameRules" counter required>
            </v-text-field>
          </v-col>
          <v-col>
            <v-text-field variant="outlined" label="Last Name" density="default" v-model="LastName"
              autocomplete="family-name" placeholder="Doe" type="text" hint="" :persistent-hint="false" class=""
              name="Last Name" :rules="lastNameRules" counter required>
            </v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field variant="outlined" label="Email" density="default" v-model="Email" autocomplete="email"
              placeholder="example@example.com" type="text" hint="" :persistent-hint="false" class="" name="Email"
              :rules="emailRules" counter required>
            </v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn color="success" :loading="isSubmitting" block class="mt-4" variant="flat" size="large"
              @click="formSubmit">Save Changes</v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card>
  </v-container>
</template>

<script>
import { useMessagesStore } from '@/stores/messages';
import { useUsersStore } from '@/stores/users';
import { useAuthStore } from '@/stores/auth';

export default {
  data() {
    return {
      useUsersStore: useUsersStore(),
      useAuthStore: useAuthStore(),
      form: null,
      FirstName: "",
      LastName: "",
      Email: "",
      isSubmitting: false,
      emailRules: [
        (v) => !!v || "Email is required",
        (v) => /.+@.+\..+/.test(v) || "Email must be valid",
        (v) => v.length <= 45 || "Email must be less than 45 characters",
      ],
      firstNameRules: [
        (v) => !!v || "First Name is required",
        (v) => v.length <= 20 || "First Name must be less than 20 characters",
        (v) => v.length >= 4 || "First Name must be more than 4 characters",
      ],
      lastNameRules: [
        (v) => !!v || "Last Name is required",
        (v) => v.length <= 20 || "Last Name must be less than 20 characters",
        (v) => v.length >= 4 || "Last Name must be more than 4 characters",
      ],
      data: {
        firstName: "",
        lastName: "",
        email: "",
      },
    }
  },
  methods: {
    async formSubmit() {
      // Handle form submission logic here
      if (this.$refs.form.validate()) {
        if (this.FirstName.length > 20 || this.FirstName.length < 4) {
          useMessagesStore().add({
            color: 'error',
            text: 'First name must be less than 20 characters and more than 4.',
          });
          return;
        }

        if (this.LastName.length > 20 || this.LastName.length < 4) {
          useMessagesStore().add({
            color: 'error',
            text: 'Last name must be less than 20 characters and more than 4.',
          });
          return;
        }

        const fullName = `${this.FirstName.trim()} ${this.LastName.trim()}`.trim();

        if (fullName.length > 40 || fullName.length < 4) {
          useMessagesStore().add({
            color: 'error',
            text: 'Full name must be less than 40 characters and more than 4.',
          });
          return;
        }
        if (this.Email.length > 45 || this.Email.length < 4) {
          useMessagesStore().add({
            color: 'error',
            text: 'Email must be less than 45 characters and more than 4.',
          });
          return;
        }

        this.isSubmitting = true;

        this.data = {
          name: fullName,
          email: this.Email,
        };

        try {
          await this.useUsersStore.updateUser(this.data);
          this.isSubmitting = false;
          useMessagesStore().add({
            color: 'success',
            text: 'Account information updated successfully.',
          });
          this.isSubmitting = false;
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
          text: 'Error updating account information.',
        });
      }

    },
  },
  mounted() {
    console.log('✅ AccountInformationView mounted!');
    const fullName = this.useAuthStore.user.name || '';
    const first = fullName.split(' ')[0];
    const last = fullName.split(' ')[1];
    this.FirstName = first || '';
    this.LastName = last || '';
    this.Email = this.useAuthStore.user.email || '';
  },
}
</script>

<style></style>