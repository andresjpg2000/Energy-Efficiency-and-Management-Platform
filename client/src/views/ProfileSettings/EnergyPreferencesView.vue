<template>
  <v-container>
    <v-row class="mb-4">
      <h1 class="text-h5 pl-4">Energy Preferences</h1>
    </v-row>
    <v-card class="pa-4">
      <v-row class="mb-4">
        <div>
          <h1 class="text-body-1 pl-4 mt-1">
            Customize the colors used to represent different types of energy in the application.
          </h1>
        </div>
      </v-row>
      <v-form ref="form" v-model="form" class="mb-4" @submit.prevent="formSubmit">
        <v-row>
          <v-col cols="12" class="d-flex flex-wrap gap-4 justify-content-between">
            <v-menu v-model="menu1" :close-on-content-click="false" max-width="300">
              <template #activator="{ props }">
                <v-text-field hint persistent-hint variant="outlined" v-model="consumptionColor" label="Consumption Color"
                  readonly v-bind="props" >
                <div class="color rounded-circle" :style="{ backgroundColor: consumptionColor }"></div>
                </v-text-field>
              </template>
              <v-color-picker :modes="['hex', 'hexa']" show-swatches v-model="consumptionColor" />
            </v-menu>
            <v-menu v-model="menu2" :close-on-content-click="false" max-width="300">
              <template #activator="{ props }">
                <v-text-field variant="outlined" class="mx-2" v-model="productionColor"
                  label="Production Color" readonly v-bind="props">
                <div class="color rounded-circle" :style="{ backgroundColor: productionColor }"></div>
                </v-text-field>
              </template>
              <v-color-picker :modes="['hex', 'hexa']" show-swatches v-model="productionColor" />
            </v-menu>
            <v-menu v-model="menu3" :close-on-content-click="false" max-width="300">
              <template #activator="{ props }">
                <v-text-field hint persistent-hint variant="outlined" v-model="givenEnergyColor" label="Given Energy Color"
                  readonly v-bind="props">
                <div class="color rounded-circle" :style="{ backgroundColor: givenEnergyColor }"></div>
                </v-text-field>
              </template>
              <v-color-picker :modes="['hex', 'hexa']" show-swatches v-model="givenEnergyColor" />
            </v-menu>
          </v-col>
        </v-row>
      </v-form>
      <v-row>
        <v-col>
          <v-btn color="success" :loading="isSubmitting" block class="mt-4" variant="flat" size="large"
            @click="formSubmit">
            Save Changes
          </v-btn>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
import { useMessagesStore } from "@/stores/messages.js";
import { useColorsStore } from "@/stores/colorsStore";
export default {

  data() {
    return {
      menu1: false,
      menu2: false,
      menu3: false,
      consumptionColor:"",
      productionColor: "",
      givenEnergyColor: "",
      messagesStore: useMessagesStore(),
      colorsStore: useColorsStore(),
      form: null,
      isSubmitting: false,
    };
  },
  computed: {

  },
  beforeMount() {
    this.consumptionColor = this.colorsStore.consumptionColor;
    this.productionColor = this.colorsStore.productionColor;
    this.givenEnergyColor = this.colorsStore.givenEnergyColor;
  },
  methods: {
    formSubmit() {
      this.isSubmitting = true;
      this.colorsStore
        .saveColors(this.consumptionColor, this.productionColor, this.givenEnergyColor)
        .then(() => {
          this.messagesStore.add({
            color: "success",
            text: "Energy preferences updated successfully!",
          });
        })
        .catch((error) => {
          console.error("Error updating energy preferences:", error);
          this.messagesStore.add({
            color: "error",
            text: "Failed to update energy preferences.",
          });
        })
        .finally(() => {
          this.isSubmitting = false;
        });
    },
  },
  mounted() {
    console.log("✅ EnergyPreferenceView mounted!");
  },
};
</script>

<style >
.color {
  width: 1.2rem;
  height: 1.2rem;
  margin-right: 0.5rem;
}
</style>
