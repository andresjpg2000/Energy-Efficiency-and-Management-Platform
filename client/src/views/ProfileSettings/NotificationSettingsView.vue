<template>
  <v-container class="container">
    <v-row justify="space-between" align="center" class="mb-4">
      <h1 class="text-h5 pl-4">Notification Settings</h1>
    </v-row>
    <v-card class="pa-4">
      <p class="text-subtitle-1 mb-4">Choose your notification preferences</p>
      <v-form ref="form" @submit.prevent="formSubmit">
        <v-row>
          <v-col>
            <v-switch v-model="Alerts" label="Alerts" :inset="false" :indeterminate="false" hint="Would you like to receive alerts?" :persistent-hint="true">
            </v-switch>
          </v-col>
          <v-col>
            <v-switch v-model="Information" label="Information" :inset="false" :indeterminate="false" color="undefined" hint="Would you like to receive informative notifications?" :persistent-hint="true">
            </v-switch>
          </v-col>
        </v-row>
        <v-row class="mt-8">
          <v-col>
            <v-select variant="outlined" label="Notification Frequency" density="default" v-model="NotificationFrequency" :clearable="false" :multiple="false" placeholder="Instant" :items="NotificationFrequencyItems" hint="Choose how often you would like to receive notifications." :persistent-hint="true" class="" name="NotificationFrequency">
            </v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-number-input
              v-model.number="ThresholdEnergyConsumption"
              label="Alert Threshold for Energy Consumption (kWh)"
              name="ThresholdEnergyConsumption"
              variant="outlined"
              density="default"
              hint="You will receive an alert if your consumption exceeds this threshold."
              :persistent-hint="true"
              :min="0"
              :max="1000"
              :step="10"
              placeholder="100"
              class="mt-4"
              style="width: 100%"
            />
          </v-col>
          <v-col class="d-flex align-center">
            <v-switch v-model="ToggleThresholdEnergyConsumption" aria-label="Toggle Energy Consumption Alerts" :inset="false" :indeterminate="false" color="undefined" hint="Would you like to receive Threshold Energy Consumption alerts?" :persistent-hint="false">
            </v-switch>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-number-input
              v-model.number="ThresholdEnergyGeneration"
              label="Alert Threshold for Energy Generation (kWh)"
              name="ThresholdEnergyGeneration"
              variant="outlined"
              density="default"
              hint="You will receive an alert if your energy generation doesn't reach this threshold."
              :persistent-hint="true"
              :min="0"
              :max="1000"
              :step="10"
              placeholder="100"
              class=""
            />
          </v-col>
          <v-col class="d-flex align-center">
            <v-switch v-model="ToggleThresholdEnergyGeneration" aria-label="Toggle Energy Generation Alerts" :inset="false" :indeterminate="false" color="undefined" hint="Would you like to receive Threshold Energy Generation alerts?" :persistent-hint="false">
            </v-switch>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-number-input
              v-model.number="ThresholdCosts"
              label="Alert Threshold for energy costs (€)"
              name="ThresholdCosts"
              variant="outlined"
              density="default"
              hint="You will receive an alert if your costs exceed this threshold."
              :persistent-hint="true"
              :min="0"
              :max="500"
              :step="10"
              placeholder="50"
              class="mt-4"
            />
          </v-col>
          <v-col class="d-flex align-center">
            <v-switch v-model="ToggleThresholdEnergyCosts" aria-label="Toggle Energy Cost Alerts" :inset="false" :indeterminate="false" color="undefined" hint="Would you like to receive Threshold Energy Cost alerts?" :persistent-hint="false">
            </v-switch>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn color="primary" :loading="isSubmitting" block class="mt-4" variant="flat" size="large" @click="formSubmit">Save Changes</v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card>
  </v-container> 
</template>

<script>
  export default {
    data() {
      return {
        form: null,
        isSubmitting: false,
        Alerts: true,
        Information: true,
        NotificationFrequencyItems: [
          { title: 'Every 15 minutes', value: '15_min' },
          { title: 'Every 30 minutes', value: '30_min' },
          { title: 'Hourly', value: 'hourly' },
          { title: 'Daily', value: 'daily' },
          { title: 'Weekly', value: 'weekly' },
          { title: 'Monthly', value: 'monthly' },
          { title: 'Instantly', value: 'instant' },
        ],
        NotificationFrequency: 'instant',
        ThresholdEnergyConsumption: 100,
        ToggleThresholdEnergyConsumption: true,
        ThresholdCosts: 50,
        ToggleThresholdEnergyCosts: true,
        ThresholdEnergyGeneration: 20,
        ToggleThresholdEnergyGeneration: true,
      };
    },
    methods: {
      formSubmit() {
        // Handle form submission logic here
        if (this.$refs.form.validate()) {
          this.isSubmitting = true;

          setTimeout(() => {
            this.isSubmitting = false;

            console.log("Form submitted with data:", {
              Alerts: this.Alerts,
              Information: this.Information,
              NotificationFrequency: this.NotificationFrequency,
              ThresholdEnergyConsumption: this.ThresholdEnergyConsumption,
              ToggleThresholdEnergyConsumption: this.ToggleThresholdEnergyConsumption,
              ThresholdCosts: this.ThresholdCosts,
              ToggleThresholdEnergyCosts: this.ToggleThresholdEnergyCosts,
              ThresholdEnergyGeneration: this.ThresholdEnergyGeneration,
              ToggleThresholdEnergyGeneration: this.ToggleThresholdEnergyGeneration,
            });

            // Store the updated values in local storage
            localStorage.setItem(
              'NotificationSettings',
              JSON.stringify({
                Alerts: this.Alerts,
                Information: this.Information,
                NotificationFrequency: this.NotificationFrequency,
                ThresholdEnergyConsumption: this.ThresholdEnergyConsumption,
                ToggleThresholdEnergyConsumption: this.ToggleThresholdEnergyConsumption,
                ThresholdCosts: this.ThresholdCosts,
                ToggleThresholdEnergyCosts: this.ToggleThresholdEnergyCosts,
                ThresholdEnergyGeneration: this.ThresholdEnergyGeneration,
                ToggleThresholdEnergyGeneration: this.ToggleThresholdEnergyGeneration,
              })
            );
          }, 1500);
        } else {
          console.log("Form validation failed.");
        }
      },
    },
    mounted() {
      console.log('✅ NotificationSettingsView mounted!');
    },
    watch: {
      Alerts(newValue) {
        this.ToggleThresholdEnergyConsumption = newValue;
        this.ToggleThresholdEnergyCosts = newValue;
        this.ToggleThresholdEnergyGeneration = newValue;
      },
    },
  };
</script>


<style scoped>

</style>