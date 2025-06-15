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
              placeholder="1"
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
              v-model.number="ThresholdEnergyProduction"
              label="Alert Threshold for Energy Production (kWh)"
              variant="outlined"
              density="default"
              :min="0"
              :max="20"
              :step="0.1"
              placeholder="10"
              hint="You will receive an alert if your energy Production doesn't reach this threshold."
              :persistent-hint="true"
            />
          </v-col>
          <v-col class="d-flex align-center">
            <v-switch
              v-model="ToggleThresholdEnergyProduction"
              color="primary"
              aria-label="Toggle Energy Production Alerts"
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
              placeholder="1"
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
import { useUsersStore } from "@/stores/users";

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
      ThresholdEnergyProduction: 20,
      ToggleThresholdEnergyProduction: true,
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
      const usersStore = useUsersStore();
      this.isSubmitting = true;

      const thresholds = {};
      if (this.ToggleThresholdEnergyConsumption)
        thresholds.consumption = this.ThresholdEnergyConsumption;
      if (this.ToggleThresholdEnergyProduction)
        thresholds.production = this.ThresholdEnergyProduction;
      if (this.ToggleThresholdEnergyCosts)
        thresholds.cost = this.ThresholdCosts;

      const payload = {
        notification_settings: {
          alerts:
            this.ToggleThresholdEnergyConsumption ||
            this.ToggleThresholdEnergyProduction ||
            this.ToggleThresholdEnergyCosts,
          frequency: this.NotificationFrequency,
          thresholds,
        },
      };

      try {
        await usersStore.updateUser(payload);
        await usersStore.fetchUser();

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
    const usersStore = useUsersStore();

    usersStore
      .fetchUser()
      .then(() => {
        const prefs = usersStore.user.notification_settings;
        if (!prefs) return;

        this.NotificationFrequency = prefs.frequency || "instant";

        if (prefs.thresholds) {
          const t = prefs.thresholds;
          this.ToggleThresholdEnergyConsumption = t.consumption != null;
          this.ThresholdEnergyConsumption = t.consumption ?? 100;

          this.ToggleThresholdEnergyProduction = t.production != null;
          this.ThresholdEnergyProduction = t.production ?? 20;

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
      this.ToggleThresholdEnergyProduction = newVal;
    },
  },
};
</script>

<style scoped></style>
