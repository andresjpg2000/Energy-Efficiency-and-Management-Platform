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
              variant="outlined"
              density="default"
              :min="0"
              :max="20"
              :step="0.1"
              placeholder="5"
              hint="You will receive an alert if your consumption exceeds this threshold."
              :persistent-hint="true"
              class="mt-4"
            />
          </v-col>
          <v-col class="d-flex align-center">
            <v-switch
              v-model="ToggleThresholdEnergyConsumption"
              color="primary"
              aria-label="Toggle Energy Consumption Alerts"
              hint="Enable or disable this alert"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-number-input
              v-model.number="ThresholdEnergyGeneration"
              label="Alert Threshold for Energy Generation (kWh)"
              variant="outlined"
              density="default"
              :min="0"
              :max="20"
              :step="0.1"
              placeholder="5"
              hint="You will receive an alert if your energy generation doesn't reach this threshold."
              :persistent-hint="true"
            />
          </v-col>
          <v-col class="d-flex align-center">
            <v-switch
              v-model="ToggleThresholdEnergyGeneration"
              color="primary"
              aria-label="Toggle Energy Generation Alerts"
              hint="Enable or disable this alert"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-number-input
              v-model.number="ThresholdCosts"
              label="Alert Threshold for energy costs (€)"
              variant="outlined"
              density="default"
              :min="0"
              :max="10"
              :step="0.1"
              placeholder="2.5"
              hint="You will receive an alert if your costs exceed this threshold."
              :persistent-hint="true"
            />
          </v-col>
          <v-col class="d-flex align-center">
            <v-switch
              v-model="ToggleThresholdEnergyCosts"
              color="primary"
              aria-label="Toggle Energy Cost Alerts"
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
import { useMessagesStore } from "@/stores/messages.js";
import { useAuthStore } from "@/stores/auth";

export default {
  data() {
    return {
      messagesStore: null,
      isSubmitting: false,
      Alerts: true,
      NotificationFrequency: "instant",
      ThresholdEnergyConsumption: 100,
      ToggleThresholdEnergyConsumption: true,
      ThresholdCosts: 50,
      ToggleThresholdEnergyCosts: true,
      ThresholdEnergyGeneration: 20,
      ToggleThresholdEnergyGeneration: true,
      NotificationFrequencyItems: [
        { title: "Every 15 minutes", value: "15_min" },
        { title: "Every 30 minutes", value: "30_min" },
        { title: "Hourly", value: "hourly" },
        { title: "Daily", value: "daily" },
        { title: "Weekly", value: "weekly" },
        { title: "Monthly", value: "monthly" },
        { title: "Instantly", value: "instant" },
      ],
    };
  },

  methods: {
    async formSubmit() {
      const authStore = useAuthStore();
      this.isSubmitting = true;

      const thresholds = {};
      if (this.ToggleThresholdEnergyConsumption)
        thresholds.consumption = this.ThresholdEnergyConsumption;
      if (this.ToggleThresholdEnergyGeneration)
        thresholds.generation = this.ThresholdEnergyGeneration;
      if (this.ToggleThresholdEnergyCosts)
        thresholds.cost = this.ThresholdCosts;

      const payload = {
        notification_settings: {
          alerts:
            this.ToggleThresholdEnergyConsumption ||
            this.ToggleThresholdEnergyGeneration ||
            this.ToggleThresholdEnergyCosts,
          frequency: this.NotificationFrequency,
          thresholds,
        },
      };

      try {
        const res = await fetch(`/users/${authStore.user.id_user}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authStore.token}`,
          },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || "Failed to update preferences.");
        }

        this.messagesStore.add({
          color: "success",
          text: "Notification preferences updated!",
        });
      } catch (err) {
        console.error("Update failed:", err);
        this.messagesStore.add({
          color: "error",
          text: err.message || "Failed to update preferences.",
        });
      } finally {
        this.isSubmitting = false;
      }
    },
  },
  created() {
    this.messagesStore = useMessagesStore();
  },

  mounted() {
    const authStore = useAuthStore();

    fetch(`/users/${authStore.user.id_user}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Status ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const prefs = data.notification_settings;
        if (!prefs) return;

        this.NotificationFrequency = prefs.frequency || "instant";

        if (prefs.thresholds) {
          const t = prefs.thresholds;
          this.ToggleThresholdEnergyConsumption = t.consumption != null;
          this.ThresholdEnergyConsumption = t.consumption ?? 100;

          this.ToggleThresholdEnergyGeneration = t.generation != null;
          this.ThresholdEnergyGeneration = t.generation ?? 20;

          this.ToggleThresholdEnergyCosts = t.cost != null;
          this.ThresholdCosts = t.cost ?? 50;
        }
      })
      .catch((err) => {
        console.error("Failed to load preferences:", err);
        this.messagesStore?.add({
          color: "error",
          text: "Failed to load notification settings.",
        });
      });
  },

  watch: {
    Alerts(newVal) {
      this.ToggleThresholdEnergyConsumption = newVal;
      this.ToggleThresholdEnergyCosts = newVal;
      this.ToggleThresholdEnergyGeneration = newVal;
    },
  },
};
</script>

<style scoped></style>
