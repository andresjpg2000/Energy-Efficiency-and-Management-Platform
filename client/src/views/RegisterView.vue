<script>
import AuthRegister from '../components/AuthRegister.vue';
import AuthFooter from '../components/AuthFooter.vue';
export default {
  name: 'LoginView',
  components: {
    AuthRegister,
    AuthFooter
  },
  data() {
    return {
      // Define your data properties here
      logo: new URL("../assets/logo.svg", import.meta.url).href,
    };
  },
  methods: {
    // Define your methods here
  },
  mounted() {
    // Code to run when the component is mounted
  }
};
</script>


<template>
  <v-row class="bg-containerBg position-relative" no-gutters>
    <div class="blur-logo">
      <img :src="logo" alt="logo" width="512" height="512"/>
    </div>
    <v-col cols="12">
      <div class="pt-6 pl-6">
        <!-- <Logo /> -->
        <img :src="logo" alt="logo" width="48" height="48" />
      </div>
    </v-col>
    <!---Register Part-->
    <v-col cols="12" lg="12" class="d-flex align-center">
      <v-container>
        <div class="d-flex align-center justify-center" style="min-height: calc(100vh - 148px)">
          <v-row justify="center">
            <v-col cols="12" md="12">
              <v-card elevation="0" class="loginBox">
                <v-card elevation="24">
                  <v-card-text class="pa-sm-10 pa-6">
                    <!---Register Form-->
                    <AuthRegister />
                    <!---Register Form-->
                  </v-card-text>
                </v-card>
              </v-card>
            </v-col>
          </v-row>
        </div>
      </v-container>
    </v-col>
    <!---Register Part-->
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
  border-radius: 18px;
}
.blur-logo {
  position: absolute;
  filter: blur(18px);
  bottom: 0;
  transform: inherit;
}
</style>
