<script>
export default {
    name: 'AuthLogin',
    data() {
      return {
        checkbox: false,
        password: 'admin123',
        username: "info@teste.com",
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
      };
    },
    methods: {
      // Define your methods here
      validate() {
        this.isSubmitting = true;
        setTimeout(() => {
          this.isSubmitting = false;
          this.$router.push('/dashboard');
        }, 2000);
      },
      
    },
    mounted() {
      // Code to run when the component is mounted
    },
    
  }
</script>

<template>
  <div class="d-flex justify-space-between align-center bg-transparent">
    <h3 class="text-h3 text-center mb-0">Login</h3>
    <router-link to="/register" class="text-primary text-decoration-none">Don't Have an account?</router-link>
  </div>
  <v-form @submit="validate" class="mt-7 loginForm bg-transparent" @keydown.enter.prevent >
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
