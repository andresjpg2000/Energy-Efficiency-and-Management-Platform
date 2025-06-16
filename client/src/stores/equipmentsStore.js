import { defineStore } from 'pinia'
import { fetchWithAuth } from '@/utils/fetchWithAuth';
import { useHousingsStore } from './housings.js'
import { URL } from '../utils/constants.js';

export const useEquipmentsStore = defineStore('equipments', {
  state: () => ({
    equipments: [],
  }),
  persist: true,
  getters: {
    getEquipmentsByHousingId: (state) => (housingId) =>
      state.equipments.filter((e) => e.id_housing === housingId),
    getEquipmentNameById: (state) => (id) => {
      const equipment = state.equipments.find((e) => e.id_equipment === id);
      return equipment ? equipment.name : '';
    }
  },
  actions: {
    async fetchEquipments() {
      try {
        const housingsStore = useHousingsStore();
        console.log("3");
        console.log(`Fetching equipments for housing ID: ${housingsStore.selectedHousingId}`);
               
        const response = await fetchWithAuth(`${URL}/housings/${housingsStore.selectedHousingId}/equipments`, {
          method: 'GET',
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.message || 'Network response was not ok')
        }
        const data = await response.json()
        console.log('Equipments fetched successfully:', data.data);

        this.equipments = data.data.equipments || [];

      } catch (error) {
        throw error;
      }
    },
    resetData() {
      this.equipments = [];
    }
  },
});
