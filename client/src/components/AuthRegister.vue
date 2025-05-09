<script>
import { useMessagesStore } from '@/stores/messages.js';

export default {
  name: 'HomeView',
    data() {
      return {
        checkbox: false,
        password: '',
        username: "",
        email: "",
        firstname: "",
        lastname: "",
        show1: false,
        isSubmitting: false,
        emailRules: [
          (v) => !!v.trim() || 'E-mail is required',
          (v) => {
            const trimmedEmail = v.trim();
            return !/\s/.test(trimmedEmail) || 'E-mail must not contain spaces';
          },
          (v) => /.+@.+\..+/.test(v.trim()) || 'E-mail must be valid'
        ],
        passwordRules: [
          (v) => !!v || 'Password is required',
          (v) => v === v.trim() || 'Password cannot start or end with spaces',
          (v) => v.length <= 10 || 'Password must be less than 10 characters'
        ],
        firstRules: [(v) => !!v || 'First Name is required'],
        lastRules: [(v) => !!v || 'Last Name is required'],
      };
    },
    methods: {
      async validate() {
        this.isSubmitting = true;
        const messagesStore = useMessagesStore();
        
        try {
          
          const response = await fetch('http://localhost:3000/users', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: this.email,
              name: this.firstname + ' ' + this.lastname,
              password: this.password
            }),
          });

          if (!response.ok) {
            messagesStore.add({
              text: data.message || 'Error processing registration',
              color: 'error',
              timeout: 3000,
            });

            throw new Error('Error processing registration');
          }

          messagesStore.add({
              text: 'Registration successful, please login',
              color: 'success',
              timeout: 3000,
            });

          setTimeout(() => {
            this.$router.push('/login');
          }, 100);

        } catch (error) {
          console.log(error);
        } finally {
          this.isSubmitting = false;
        }
      
      },
    },
};

</script>

<template>
  <div class="d-flex justify-space-between align-center">
    <h3 class="text-h3 text-center mb-0">Sign up</h3>
    <router-link to="/login" class="text-primary text-decoration-none">Already have an account?</router-link>
  </div>
  <v-form @submit="validate" lazy-validation class="mt-7 loginForm">
    <v-row class="my-0">
      <v-col cols="12" sm="6" class="py-0">
        <div class="mb-6">
          <v-label>First Name*</v-label>
          <v-text-field
            v-model="firstname"
            :rules="firstRules"
            hide-details="auto"
            required
            variant="outlined"
            class="mt-2"
            color="primary"
            placeholder="John"
          ></v-text-field>
        </div>
      </v-col>
      <v-col cols="12" sm="6" class="py-0">
        <div class="mb-6">
          <v-label>Last Name*</v-label>
          <v-text-field
            v-model="lastname"
            :rules="lastRules"
            hide-details="auto"
            required
            variant="outlined"
            class="mt-2"
            color="primary"
            placeholder="Doe"
          ></v-text-field>
        </div>
      </v-col>
    </v-row>
    <div class="mb-6">
      <v-label>Email Address*</v-label>
      <v-text-field
        v-model="email"
        :rules="emailRules"
        placeholder="user@company.com"
        class="mt-2"
        required
        hide-details="auto"
        variant="outlined"
        color="primary"
        @input="email"
      ></v-text-field>
    </div>
    <div class="mb-6">
      <v-label>Password</v-label>
      <v-text-field
        v-model="password"
        :rules="passwordRules"
        placeholder="*****"
        required
        variant="outlined"
        color="primary"
        hide-details="auto"
        :type="show1 ? 'text' : 'password'"
        class="mt-2"
        @input="password"
      >
        <template v-slot:append-inner>
          <v-btn color="secondary" icon rounded variant="text" @click="show1 = !show1">
            <v-icon size="large" icon="mdi-eye-outline" v-if="show1 == false"></v-icon>
            <v-icon size="large" icon="mdi-eye-off-outline" v-if="show1 == true"></v-icon>
          </v-btn>
        </template>
      </v-text-field>
    </div>

    <div class="d-sm-inline-flex align-center mt-2 mb-7 mb-sm-0 font-weight-bold">
      <h6 class="text-caption">
        By Signing up, you agree to our
        <router-link to="/register" class="text-primary link-hover font-weight-medium">Terms of Service </router-link>
        and
        <router-link to="/register" class="text-primary link-hover font-weight-medium">Privacy Policy</router-link>
      </h6>
    </div>
    <v-btn color="primary" block class="mt-4" variant="flat" size="large" @click="validate()">Create Account</v-btn>
  </v-form>
</template>
