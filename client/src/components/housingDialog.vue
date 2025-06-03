<template>
  <v-dialog v-model="internalDialog" max-width="500px">
    <v-card>
      <v-card-title>
        <span class="text-h6">{{ isEditMode ? 'Edit Housing' : 'Add Housing' }}</span>
      </v-card-title>

      <v-card-text>
        <v-text-field
          v-model="localHousing.address"
          variant="outlined"
          label="Address"
          required
        />
        <v-text-field
          v-model="localHousing.pc"
          variant="outlined"
          label="Postal Code"
          required
        />
        <v-text-field
          v-model="localHousing.location"
          variant="outlined"
          label="Location"
          required
        />
        <v-select
          v-model="localHousing.selectedSupplier"
          :items="formattedSuppliers"
          item-title="title"
          item-value="value"
          variant="outlined"
          label="Energy Suppliers"
          placeholder="Choose your current energy supplier"
        />
        <v-select
          v-model="localHousing.building_type"
          :items="['flat', 'house', 'studio']"
          variant="outlined"
          label="Building Type"
          placeholder="Choose the type of building"
        />
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn text @click="closeDialog">Cancel</v-btn>
        <v-btn color="primary" @click="saveHousing">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { useAuthStore } from "@/stores/auth";
import { useHousingsStore } from "@/stores/housings";

export default {
  name: "HousingDialog",
  props: {
    modelValue: Boolean,
    suppliers: Array,
    housing: Object, // Optional prop for editing existing housing
  },
  data() {
    return {
      isEditMode: false,
      internalDialog: this.value,
      localHousing: {
        address: "",
        pc: "",
        location: "",
        selectedSupplier: null,
        building_type: "",
        id_user: null,
      },
      twoFACode: "",
      authStore: useAuthStore(),
      housingsStore: useHousingsStore(),
    };
  },
  watch: {
    modelValue(val) {
      this.internalDialog = val;
      if (val && this.housing) {
        this.isEditMode = true;
        this.localHousing = { ...this.housing }; // Clone the housing object for editing
      } else {
        this.isEditMode = false;
        this.resetForm();
      }
    },
    internalDialog(val) {
      this.$emit("update:modelValue", val);
    },
  },
  computed: {
    formattedSuppliers() {
      return this.suppliers.map((s) => ({
        title: `${s.enterprise} - ${s.cost_kWh} €/kWh`,
        value: s.id,
      }));
    },
  },
  methods: {
    closeDialog() {
      this.internalDialog = false;
      this.resetForm();
      this.isEditMode = false;
    },
    saveHousing() {
      this.localHousing.id_user = this.authStore.getUserId;
      if (this.isEditMode) {
        this.housingsStore.updateHousing(this.localHousing);
      } else {
        this.housingsStore.addHousing(this.localHousing);
      }
      this.closeDialog();
    },
    resetForm() {
      this.localHousing = {
        address: "",
        pc: "",
        location: "",
        selectedSupplier: null,
        building_type: "",
        id_user: null,
      };
    },
  },
};

</script>
