import { defineStore } from 'pinia'
import { fetchWithAuth } from '@/utils/fetchWithAuth';
import { useHousingsStore } from './housings.js'

export const useConsumptionStore = defineStore('consumption', {
  state: () => ({
    data: {},
    lastUpdateDate: new Date(),// ver mais tarde
  }),
  actions: {
    async fetchConsumption() {
      this.data = {};
      const housingsStore = useHousingsStore();

      const end = new Date(); // hoje

      const start = new Date();
      start.setFullYear(end.getFullYear());
      start.setMonth(0); // janeiro
      start.setDate(1);  // dia 1
      start.setHours(0, 0, 0, 0); // 00:00:00.000

      try {
        const response = await fetchWithAuth(`http://localhost:3000/housings/${housingsStore.selectedHousingId}/energy-consumptions?start=${start.toISOString()}&end=${end.toISOString()}`, {
          method: 'GET',
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.message || 'Network response was not ok')
        }
        const data = await response.json()

        this.data = data.data.consumptions || [];
        this.data.forEach(el => {
          el.value = parseFloat(el.value);
          //el.date = new Date(el.date);
        });
      } catch (error) {
        throw error;
      }
    },
    async fetch2Year() {
      this.data = {};
      const housingsStore = useHousingsStore();

      const now = new Date();
      const lastYear = now.getFullYear() - 1;

      const start = new Date(lastYear, 0, 1, 0, 0, 0, 0);  // 1 Jan
      const end = new Date(lastYear, 11, 31, 23, 59, 59, 999); // 31 Dec

      try {
        const response = await fetchWithAuth(
          `http://localhost:3000/housings/${housingsStore.selectedHousingId}/energy-consumptions?start=${start.toISOString()}&end=${end.toISOString()}`,
          { method: 'GET' }
        );

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || 'Network response was not ok');
        }

        const result = await response.json();

        const newConsumptions = result.data?.consumptions || [];

        this.data.push(...newConsumptions);

      } catch (error) {
        throw error;
      }
    }
  },
  persist: {
    storage: sessionStorage,
    paths: ['data'],
  },
});
