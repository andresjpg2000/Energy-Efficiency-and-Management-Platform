<template>
  <div class="main-container">
    <v-row class="d-flex justify-center align-center" style="height: 100vh;">
      <v-col cols="12" md="8" lg="6">
        <v-card class="pa-4 formContainer">
          <v-card-title class="text-h5">Account Information</v-card-title>
          <v-divider></v-divider>
          
            <v-form ref="form" class="mt-8" @submit.prevent="formSubmit">
              <v-row>
                <v-col>
                  
                    <v-text-field variant="outlined" label="First Name" density="default" v-model="FirstName" placeholder="John" type="text" hint="" :persistent-hint="false" class="" name="First Name" :rules="firstNameRules" counter required>
                    </v-text-field>
                  
                </v-col>
                <v-col>
                  
                    <v-text-field variant="outlined" label="Last Name" density="default" v-model="LastName" placeholder="Doe" type="text" hint="" :persistent-hint="false" class="" name="Last Name":rules="lastNameRules" counter required>
                    </v-text-field>
                  
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                 
                    <v-text-field variant="outlined" label="Email" density="default" v-model="Email" placeholder="example@example.com" type="text" hint="" :persistent-hint="false" class="" name="Email" :rules="emailRules" counter required>
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
      }
    },
    methods: {
      formSubmit() {
        // Handle form submission logic here
        if (this.$refs.form.validate()) {
          const fullName = `${this.FirstName.trim()} ${this.LastName.trim()}`.trim();

          if (fullName.length > 40 || fullName.length < 4) {
            console.error("Full name must be less than 40 characters and more than 4.");
            return;
          }
          if (this.Email.length > 45 || this.Email.length < 4) {
            console.error("Email must be less than 45 characters and more than 4.");
            return;
          }
          
          this.isSubmitting = true;

          setTimeout(() => {
            this.isSubmitting = false;

            console.log("Form submitted with data:", {
              nome: fullName,
              email: this.Email,
            });
            // Chamar API para atualizar os dados do usuário 
          }, 1500);
          
        } else {
          console.log("Form validation failed.");
        }

      },
    },
    mounted() {
      console.log('✅ AccountInformationView mounted!');
    }
  }
</script>

<style scoped>
  .formContainer {
    /* background-color: transparent; */
  }
</style>