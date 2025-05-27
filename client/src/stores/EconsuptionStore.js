import { defineStore } from 'pinia'
import { fetchWithAuth } from '@/utils/fetchWithAuth';
import { useHousingsStore } from './housings.js'

export const useEconsumptionStore = defineStore('Econsumption', {
  state: () => ({
    data: {},
  }),
  actions: {
    async fetchEconsumption() {
      const housingsStore = useHousingsStore();
      try {
        const response = await fetchWithAuth(`http://localhost:3000/${housingsStore.selectedHousingId}`, {
          method: 'GET',
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.message || 'Network response was not ok')
        }
        const data = await response.json()
        this.housings = data.data;
      } catch (error) {
        throw error;
      } finally {
        this.loading = false
      }
    },
    async updateHousing(housing) {
      let id_housing = this.selectedHousingId;
      try {
        const response = await fetchWithAuth(`http://localhost:3000/housings/${id_housing}`, {
          method: 'PATCH',
          body: JSON.stringify(housing),
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.message || 'Network response was not ok')
        }

        await this.fetchHousings();

      } catch (error) {
        throw error
      }
    },
  },
  persist: {
    storage: sessionStorage,
    paths: ['data'],
  },
});
