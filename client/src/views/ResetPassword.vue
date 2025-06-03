<script>
import AuthFooter from "../components/AuthFooter.vue";
import { useAuthStore } from "../stores/auth";
import { useMessagesStore } from "../stores/messages";
import { URL as API_URL } from "../utils/constants";

export default {
  name: "LoginView",
  components: {
    AuthFooter,
  },
  data() {
    return {
      logo: new URL("../assets/logo.svg", import.meta.url).href,
      password: "",
      confirmPassword: "",
      passwordRules: [
        (v) => !!v || 'Password is required',
        (v) => v === v.trim() || 'Password cannot start or end with spaces',
        (v) => v.length <= 100 || 'Password must be equal or less than 100 characters'
      ],
      isSubmitting: false,
    };
  },
   methods: {
      async validate() {
        this.isSubmitting = true;
        const authStore = useAuthStore();
        const messagesStore = useMessagesStore();

        if (this.password !== this.confirmPassword) {
          this.isSubmitting = false;
          messagesStore.add({
            text: 'Passwords do not match',
            color: 'error',
          });
          return;
        }

        try {
          
          const response = await fetch(`${API_URL}/users/reset-password`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                newPassword: this.password,
                token: this.$route.query.token || null,
              }),
          });

          const data = await response.json();

          if (!response.ok) {
            messagesStore.add({
              text: data.message || 'Error changing password',
              color: 'error',
              timeout: 3000,
            });

            throw new Error(data.message || 'Error changing password');
          }

          messagesStore.add({
            text: data.message || 'Password changed successfully',
            color: 'success',
          });
          
          await authStore.setUser(data);
          this.$router.push('/');
        } catch (error) {
          console.log(error);
        } finally {
          this.isSubmitting = false;
        }
      
    },
  },
}
</script>

<template>
  <v-row class="bg-containerBg position-relative" no-gutters>
    <div class="blur-logo">
      <!-- <svg
        width="100%"
        height="calc(100vh - 175px)" -->
      <img :src="logo" alt="logo" width="512" height="512"/>
    </div>
    <v-col cols="12">
      <div class="pt-6 pl-6">
        <!-- <Logo /> -->
        <img :src="logo" alt="logo" width="48" height="48" />
      </div>
    </v-col>
    <!---Login-->
    <v-col cols="12" lg="12" class="d-flex align-center">
      <v-container>
        <div
          class="d-flex align-center justify-center"
          style="min-height: calc(100vh - 148px)"
        >
          <v-row justify="center">
            <v-col cols="12" md="12">
              <v-card elevation="0" class="loginBox">
                <v-card
                  elevation="24"
                  class="bg-transparent border-md border-primary"
                >
                  <v-card-text class="pa-sm-10 pa-6">
                    <div class="d-flex justify-space-between align-center bg-transparent">
                      <h3 class="text-h3 text-center mb-0">Reset Password</h3>
                    </div>
                    <v-form @submit.prevent="validate" class="mt-7 loginForm bg-transparent" @keydown.enter.prevent >
                      <div class="mb-6">
                        <v-label>New password</v-label>
                        <v-text-field
                          aria-label="new password"
                          v-model="password"
                          :rules="passwordRules"
                          class="mt-2"
                          required
                          type="password"
                          hide-details="auto"
                          variant="outlined"
                          color="primary"
                          autocomplete="newpassword"
                        ></v-text-field>
                      </div>
                      <div>
                        <v-label>Confirm Password</v-label>
                        <v-text-field
                          aria-label="confirm password"
                          v-model="confirmPassword"
                          :rules="passwordRules"
                          required
                          variant="outlined"
                          color="primary"
                          type="password"
                          hide-details="auto"
                          class="mt-2"
                          autocomplete="new-password"
                        >   
                        </v-text-field>
                      </div>
                        <v-btn color="primary" :loading="isSubmitting" block class="mt-4" variant="flat" size="large" @click="validate">Submit</v-btn>
                      </v-form>
                  </v-card-text>
                </v-card>
              </v-card>
            </v-col>
          </v-row>
        </div>
      </v-container>
    </v-col>
    <!---Footer-->
    <v-col cols="12">
      <v-container class="pt-0 pb-6">
        <AuthFooter />
      </v-container>
    </v-col>
  </v-row>
</template>
<style>
.loginBox {
  max-width: 475px;
  margin: 0 auto;
}
.blur-logo {
  position: absolute;
  filter: blur(18px);
  bottom: 0;
  transform: inherit;
}
</style>
