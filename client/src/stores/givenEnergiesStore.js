import { defineStore } from 'pinia'
import { fetchWithAuth } from '@/utils/fetchWithAuth';
import { useEquipmentsStore } from './equipmentsStore';
import { URL } from '../utils/constants.js';

export const useGivenEnergiesStore = defineStore('givenEnergies', {
  state: () => ({
    data: [],
  }),
  actions: {
    async fetchGivenEnergies() {
      this.data = [];
      const equipmentsStore = useEquipmentsStore();

      let end = new Date(); // hoje

      const start = new Date(end.getFullYear(), end.getMonth(), 1); // 1º dia do mês, 00:00

      try {
        const fetches = equipmentsStore.equipments.map((eq) =>
          fetchWithAuth(`${URL}/energy-equipments/${eq.id_equipment}/given-energies?start=${start.toISOString()}&end=${end.toISOString()}`)
            .then(async (res) => {
              if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'Network response was not ok');
              }
              const data = await res.json();

              return data.data.givenEnergy || [];
            })
        );

        // Espera todos os fetchs ao mesmo tempo
        const results = await Promise.all(fetches);

        // Junta todos os dados num único array
        this.data = results.flat();
        this.data.forEach(el => {
          el.value = parseFloat(el.value);
        });

      } catch (error) {
        throw error;
      }
    },
    async fetchGivenEnergiesByDate(date) {
      const equipmentsStore = useEquipmentsStore();

      const start = new Date(date);
      start.setHours(0, 0, 0, 0); // 00:00:00.000
      const end = new Date(start);
      end.setDate(end.getDate() + 1); // dia seguinte

      try {
        const fetches = equipmentsStore.equipments.map((eq) =>
          fetchWithAuth(`${URL}/energy-equipments/${eq.id_equipment}/given-energies?start=${start.toISOString()}&end=${end.toISOString()}`)
            .then(async (res) => {
              if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'Network response was not ok');
              }
              const data = await res.json();
              return data.data.givenEnergy || [];
            })
        );

        // Espera todos os fetchs ao mesmo tempo
        const results = await Promise.all(fetches);

        // Junta todos os dados num único array
        let data = results.flat();
        data.forEach(el => {
          el.value = parseFloat(el.value);
        });
        return data;
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
