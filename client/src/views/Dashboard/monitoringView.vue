<template>
  <v-container fluid>
    <!-- Botão para adicionar equipamento -->
    <v-btn
      density="comfortable"
      class="mt-4"
      color="success"
      rounded="lg"
      @click="openAddEquipmentDialog"
      prepend-icon="mdi-plus"
      >Add Equipment
    </v-btn>

    <!-- Tabela de equipamentos -->
    <v-card class="mt-4" v-if="equipments.length">
      <v-data-table :headers="headers" :items="equipments" class="elevation-1">
        <template #item.actions="{ item }">
          <v-icon small class="me-2" @click="editEquipment(item)">
            mdi-pencil
          </v-icon>
          <v-icon small color="red" @click="deleteEquipment(item)">
            mdi-delete
          </v-icon>
        </template>
      </v-data-table>
    </v-card>

    <v-alert v-else type="info" class="mt-4">
      No equipment found for this house.
    </v-alert>

    <!-- Modal adicionar/editar equipamento -->
    <v-dialog v-model="openDialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h6"
            >{{ isEditMode ? "Edit" : "Add" }} Equipment</span
          >
        </v-card-title>

        <v-card-text>
          <v-text-field
            v-model="equipment.name"
            label="Name"
            variant="outlined"
            required
          />
          <v-select
            v-model="equipment.energy_type"
            :items="energyTypes"
            item-title="label"
            item-value="id"
            label="Energy Type"
            variant="outlined"
            :disabled="isEditMode"
          />
          <v-text-field
            v-model="equipment.capacity"
            label="Capacity (kW)"
            type="number"
            variant="outlined"
            required
            :disabled="isEditMode"
          />
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn text @click="closeDialog">Cancel</v-btn>
          <v-btn color="primary" @click="saveEquipment">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { useHousingsStore } from "@/stores/housings";
import { useEquipmentsStore } from "@/stores/equipmentsStore";
import { useMessagesStore } from "@/stores/messages";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import { URL } from "@/utils/constants";

export default {
  data() {
    return {
      housingsStore: useHousingsStore(),
      equipmentsStore: useEquipmentsStore(),
      messagesStore: useMessagesStore(),

      openDialog: false,
      isEditMode: false,

      equipment: {
        id_equipment: null,
        name: "",
        energy_type: "",
        capacity: 0,
      },

      energyTypes: [
        { id: 1, label: "Solar" },
        { id: 2, label: "Wind" },
        { id: 3, label: "Hydro" },
        { id: 4, label: "Biomass" },
      ],

      headers: [
        { title: "Name", key: "name" },
        { title: "Type", key: "energy_type" },
        { title: "Capacity (kW)", key: "capacity" },
        { title: "Actions", key: "actions", sortable: false },
      ],
    };
  },

  computed: {
    selectedHouseId() {
      return this.housingsStore.selectedHousingId;
    },
    equipments() {
      return this.equipmentsStore.equipments;
    },
  },

  methods: {
    async fetchEquipments() {
      try {
        await this.equipmentsStore.fetchEquipments();
      } catch (err) {
        this.messagesStore.add({
          color: "error",
          text: "Failed to load equipments.",
        });
      }
    },

    openAddEquipmentDialog() {
      this.isEditMode = false;
      this.equipment = {
        name: "",
        energy_type: "",
        capacity: 0,
        id_equipment: null,
      };
      this.openDialog = true;
    },

    editEquipment(item) {
      this.isEditMode = true;
      this.equipment = {
        id_equipment: item.id_equipment,
        name: item.name,
        energy_type: item.energy_type,
        capacity: item.capacity,
      };
      this.openDialog = true;
    },

    async saveEquipment() {
      try {
        if (this.isEditMode) {
          const res = await fetchWithAuth(
            `${URL}/energy-equipments/${this.equipment.id_equipment}`,
            {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ name: this.equipment.name }),
            }
          );

          if (!res.ok) throw new Error("Failed to update equipment.");
          this.messagesStore.add({
            color: "success",
            text: "Equipment name updated.",
          });
        } else {
          const payload = {
            energy_type: this.equipment.energy_type,
            capacity: this.equipment.capacity,
            housing: this.selectedHouseId,
            name: this.equipment.name || null,
          };

          const res = await fetchWithAuth(`${URL}/energy-equipments`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

          if (!res.ok) {
            const err = await res.json();
            throw new Error(err.message || "Failed to add equipment.");
          }

          this.messagesStore.add({
            color: "success",
            text: "Equipment added successfully.",
          });
        }

        this.closeDialog();
        await this.fetchEquipments();
      } catch (err) {
        this.messagesStore.add({
          color: "error",
          text: err.message || "Error saving equipment.",
        });
      }
    },

    async deleteEquipment(item) {
      try {
        const res = await fetchWithAuth(
          `${URL}/energy-equipments/${item.id_equipment}`,
          {
            method: "DELETE",
          }
        );

        if (!res.ok) throw new Error("Failed to delete equipment.");

        this.messagesStore.add({
          color: "success",
          text: "Equipment deleted.",
        });
        await this.fetchEquipments();
      } catch (err) {
        this.messagesStore.add({
          color: "error",
          text: err.message || "Error deleting equipment.",
        });
      }
    },

    closeDialog() {
      this.openDialog = false;
    },
  },

  watch: {
    selectedHouseId() {
      this.fetchEquipments();
    },
  },

  mounted() {
    if (this.selectedHouseId) {
      this.fetchEquipments();
    }
  },
};
</script>

<style scoped></style>
