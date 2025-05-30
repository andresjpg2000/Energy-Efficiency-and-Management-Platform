import { defineStore } from 'pinia'
import { fetchWithAuth } from '@/utils/fetchWithAuth';
import { useHousingsStore } from './housings.js'

export const useEquipmentsStore = defineStore('equipments', {
  state: () => ({
    equipments: [],
  }),
  persist: true,
  actions: {
    async fetchEquipments() {
      try {
        const housingsStore = useHousingsStore();
        const response = await fetchWithAuth(`http://localhost:3000/housings/${housingsStore.selectedHousingId}/equipments`, {
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

  },
});
