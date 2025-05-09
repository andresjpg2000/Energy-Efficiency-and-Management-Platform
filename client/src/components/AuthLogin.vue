<script>
import { useUsersStore } from '@/stores/usersStore';

export default {
    name: 'AuthLogin',
    data() {
      return {
        checkbox: false,
        password: 'passteste',
        username: "teste@email.com",
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
          (v) => v.length <= 100 || 'Password must be equal or less than 100 characters'
        ],
      };
    },
    methods: {
      // Define your methods here
      async validate() {
        this.isSubmitting = true;
        // this.$refs.form.validate(); // Validate the form
        try {
          
          const response = await fetch('http://localhost:3000/login', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email: this.username,
                password: this.password,
              }),
          });

          if (!response.ok) {
            throw new Error('Error processing login');
          }

          const data = await response.json();
          
          const usersStore = useUsersStore();
          usersStore.login(data);

          this.$router.push('/');

        } catch (error) {
          console.log(error);
        } finally {
          this.isSubmitting = false;
        }
      
    },
    mounted() {
      // Code to run when the component is mounted
    },
    
  }
}
</script>

<template>
  <div class="d-flex justify-space-between align-center bg-transparent">
    <h3 class="text-h3 text-center mb-0">Login</h3>
    <router-link to="/register" class="text-primary text-decoration-none">Don't Have an account?</router-link>
  </div>
  <v-form @submit.prevent="validate" class="mt-7 loginForm bg-transparent" @keydown.enter.prevent >
    <div class="mb-6">
      <v-label>Email Address</v-label>
      <v-text-field
        aria-label="email address"
        v-model="username"
        :rules="emailRules"
        class="mt-2"
        required
        hide-details="auto"
        variant="outlined"
        color="primary"
        auto-complete="email"
      ></v-text-field>
    </div>
    <div>
      <v-label>Password</v-label>
      <v-text-field
        aria-label="password"
        v-model="password"
        :rules="passwordRules"
        required
        variant="outlined"
        color="primary"
        hide-details="auto"
        :type="show1 ? 'text' : 'password'"
        class="mt-2"
        auto-complete="current-password"
      >   
      <template v-slot:append-inner>
          <v-btn color="secondary" icon rounded variant="text" @click="show1 = !show1">
            <v-icon size="large" icon="mdi-eye-outline" v-if="show1 == false"></v-icon>
            <v-icon size="large" icon="mdi-eye-off-outline" v-if="show1 == true"></v-icon>
          </v-btn>
      </template>
      </v-text-field>
    </div>

    <div class="d-flex align-center mt-4 mb-7 mb-sm-0">
      <v-checkbox
        v-model="checkbox"
        label="Keep me sign in"
        required
        class="ms-n2"
        hide-details
      ></v-checkbox>
      <div class="ml-auto">
        <router-link to="/login" class="text-darkText link-hover">Forgot Password?</router-link>
      </div>
    </div>
      <v-btn color="primary" :loading="isSubmitting" block class="mt-4" variant="flat" size="large" @click="validate">Login</v-btn>
    </v-form>
</template>
<style>

</style>
