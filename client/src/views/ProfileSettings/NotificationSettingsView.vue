<template>
  <v-container class="container">
    <v-row justify="space-between" align="center" class="mb-4">
      <h1 class="text-h5 pl-4">Notification Settings</h1>
    </v-row>
    <v-card class="pa-4">
      <p class="text-subtitle-1 mb-4">Choose your notification preferences</p>
      <v-form ref="form" @submit.prevent="formSubmit">

        <v-row class="mt-8">
          <v-col>
            <v-select
              variant="outlined"
              label="Notification Frequency"
              density="default"
              v-model="NotificationFrequency"
              :clearable="false"
              :multiple="false"
              placeholder="Instant"
              :items="NotificationFrequencyItems"
              hint="Choose how often you would like to receive notifications."
              :persistent-hint="true"
              name="NotificationFrequency"
            />
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
            <v-switch
              v-model="ToggleThresholdEnergyConsumption"
              aria-label="Toggle Energy Consumption Alerts"
              :inset="false"
              :indeterminate="false"
              hint="Enable or disable this alert"
            />
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
            />
          </v-col>
          <v-col class="d-flex align-center">
            <v-switch
              v-model="ToggleThresholdEnergyGeneration"
              aria-label="Toggle Energy Generation Alerts"
              :inset="false"
              :indeterminate="false"
              hint="Enable or disable this alert"
            />
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
            <v-switch
              v-model="ToggleThresholdEnergyCosts"
              aria-label="Toggle Energy Cost Alerts"
              :inset="false"
              :indeterminate="false"
              hint="Enable or disable this alert"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-btn
              color="primary"
              :loading="isSubmitting"
              block
              class="mt-4"
              variant="flat"
              size="large"
              @click="formSubmit"
            >
              Save Changes
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card>
  </v-container>
</template>

<script>
import { useAuthStore } from "@/stores/auth";

export default {
  data() {
    return {
      form: null,
      isSubmitting: false,
      Alerts: true,
      NotificationFrequencyItems: [
        { title: "Every 15 minutes", value: "15_min" },
        { title: "Every 30 minutes", value: "30_min" },
        { title: "Hourly", value: "hourly" },
        { title: "Daily", value: "daily" },
        { title: "Weekly", value: "weekly" },
        { title: "Monthly", value: "monthly" },
        { title: "Instantly", value: "instant" },
      ],
      NotificationFrequency: "instant",
      ThresholdEnergyConsumption: 100,
      ToggleThresholdEnergyConsumption: true,
      ThresholdCosts: 50,
      ToggleThresholdEnergyCosts: true,
      ThresholdEnergyGeneration: 20,
      ToggleThresholdEnergyGeneration: true,
    };
  },

  methods: {
    async formSubmit() {
      if (this.$refs.form.validate()) {
        this.isSubmitting = true;

        const authStore = useAuthStore();

        const thresholds = {};
        if (this.ToggleThresholdEnergyConsumption) {
          thresholds.consumption = this.ThresholdEnergyConsumption;
        }
        if (this.ToggleThresholdEnergyGeneration) {
          thresholds.generation = this.ThresholdEnergyGeneration;
        }
        if (this.ToggleThresholdEnergyCosts) {
          thresholds.cost = this.ThresholdCosts;
        }

        const payload = {
          notification_settings: {
            alerts: this.Alerts,
            frequency: this.NotificationFrequency,
            thresholds,
          },
        };

        try {
          const response = await fetch(`/users/${authStore.user.id_user}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authStore.token}`,
            },
            body: JSON.stringify(payload),
          });

          if (!response.ok) {
            throw new Error(`Server responded with status ${response.status}`);
          }

          this.$toast?.success("Notification preferences updated!");
        } catch (err) {
          console.error("Failed to update preferences:", err);
          this.$toast?.error("Failed to update preferences.");
        } finally {
          this.isSubmitting = false;
        }
      } else {
        console.log("Form validation failed.");
      }
    },
  },

  mounted() {
    const authStore = useAuthStore();

    fetch(`/users/${authStore.user.id_user}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authStore.token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch user data: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        const prefs = data.notification_settings;
        if (!prefs) return;

        this.Alerts = prefs.alerts ?? true;
        this.NotificationFrequency = prefs.frequency ?? "instant";

        if (prefs.thresholds) {
          this.ToggleThresholdEnergyConsumption =
            prefs.thresholds.consumption != null;
          this.ThresholdEnergyConsumption = prefs.thresholds.consumption ?? 100;

          this.ToggleThresholdEnergyGeneration =
            prefs.thresholds.generation != null;
          this.ThresholdEnergyGeneration = prefs.thresholds.generation ?? 20;

          this.ToggleThresholdEnergyCosts = prefs.thresholds.cost != null;
          this.ThresholdCosts = prefs.thresholds.cost ?? 50;
        }
      })
      .catch((err) => {
        console.error("Error loading notification preferences:", err);
        this.$toast?.error("Failed to load notification settings.");
      });
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

<style scoped></style>
