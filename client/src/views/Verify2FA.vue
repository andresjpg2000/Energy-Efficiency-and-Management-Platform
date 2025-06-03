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
      code: "",
      isSubmitting: false,
      isVerified: false,
    };
  },
   methods: {
    async verifyCode() {
      this.isSubmitting = true;
      const token = this.$route.query.token;
      try {
        const response = await fetch(`${API_URL}/users/verify-2fa`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token, code: this.code.trim() }),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error("Verification failed:", errorData.message);
          this.isSubmitting = false;
          return;
        }
        const data = await response.json();
        if (data.success) {
          // Store the user data in the auth store
          const authStore = useAuthStore();
          authStore.setUser(data);
          this.isVerified = true;
          this.$router.push({ path: '/' });
        } else {
          // Handle verification failure
          this.$router.push({ path: '/login' });
        }
      } catch (error) {
        console.error("Error during 2FA verification:", error);
        this.$router.push({ path: '/login' });
      }
    },
  
  }
}
</script>

<template>
  <v-row class="bg-containerBg position-relative" no-gutters>
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
            <v-col cols="6" md="6" xl="6">
              <v-card elevation="0" class="loginBox">
                <v-card
                  elevation="24"
                  class="bg-transparent border-md border-primary"
                >
                  <v-card-text class="pa-sm-10 pa-6">
                    <div class="bg-transparent" id="textVerify2FA">
                      <h3 class="text-h4 text-center mb-0" v-if="!isVerified">Please enter the code sent to your email</h3>
                      <h3 class="text-h4 text-center mb-0" v-else>Account Verified Successfully, you can close this window</h3>
                    </div>
                    <v-form @submit.prevent="verifyCode" class="mt-7 loginForm bg-transparent" @keydown.enter.prevent >
                      <div class="mb-6">
                        <v-label>Two Factor Authentication Code</v-label>
                        <v-text-field
                          aria-label="2 factor authentication code"
                          v-model="code"
                          class="mt-2"
                          required
                          type="text"
                          hide-details="auto"
                          variant="outlined"
                          color="primary"
                          autocomplete="one-time-code"
                        ></v-text-field>
                      </div>
                        <v-btn v-if="!isVerified" color="primary" :loading="isSubmitting" block class="mt-4" variant="flat" size="large" @click="verifyCode">Submit</v-btn>
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
<style scoped>
.blur-logo {
  position: absolute;
  filter: blur(18px);
  bottom: 0;
  transform: inherit;
  z-index: 1;
}
#textVerify2FA {
  z-index: 1000;
}
</style>
