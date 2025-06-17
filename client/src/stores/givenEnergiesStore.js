import { defineStore } from 'pinia'
import { fetchWithAuth } from '@/utils/fetchWithAuth';
import { useEquipmentsStore } from './equipmentsStore';
import { URL } from '../utils/constants.js';
import { useMessagesStore } from './messages.js';
import { useAuthStore } from './auth.js';

export const useGivenEnergiesStore = defineStore('givenEnergies', {
  state: () => ({
    data: [],
    lastUpdateDate: null,
  }),
  getters: {
    getGivenEnergiesByEquipment: (state) => (equipmentId) => state.data.filter((p) => p.id_equipment === equipmentId),

    getGivenEnergyToday: (state) => (id) => {
      const today = new Date().toISOString().split("T")[0];
      return state.data.filter((p) => p.date.startsWith(today) && p.id_equipment == id);
    },
    getAllGivenEnergyToday: (state) => {
      const today = new Date().toISOString().split("T")[0];
      return state.data.filter((p) => p.date.startsWith(today));
    }
  },
  actions: {
    async fetchGivenEnergies() {
      const equipmentsStore = useEquipmentsStore();

      let end = new Date(); // hoje
      let start;

      if (this.lastUpdateDate == null) {
        start = new Date(end.getFullYear(), end.getMonth(), 1); // 1º dia do mês, 00:00
        this.lastUpdateDate = end;
      } else {
        start = new Date(this.lastUpdateDate);
      }

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
        const data = results.flat();
        data.forEach(el => {
          el.value = parseFloat(el.value);
          this.data.push(el);
        });

      } catch (error) {
        throw error;
      }
    },
    async fetchGivenEnergiesByDate(date) {
      const equipmentsStore = useEquipmentsStore();

      const start = new Date(date);

      start.setHours(1, 0, 0, 0); // 00:00:00.000
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
    },
    async fetchGivenEnergiesTable(size, page, startDate, endDate, equipmentId, houseId) {
      const authStore = useAuthStore();
      let link = `${URL}/given-energies?userId=${authStore.getUserId}`;
      if (!startDate) {
        startDate = new Date(0);
      } else {
        startDate = new Date(startDate);
      }
      startDate.setHours(1, 0, 0, 0);
      if (!endDate) {
        endDate = new Date();
      } else {
        endDate = new Date(endDate);
      }
      endDate.setHours(24, 59, 59, 999);
      link += `&start=${startDate.toISOString()}`;
      link += `&end=${endDate.toISOString()}`;
      if (equipmentId) link += `&equipmentId=${equipmentId}`;
      if (houseId) link += `&houseId=${houseId}`;
      if (page) link += `&page=${page}`;
      if (size) link += `&size=${size}`;

      try {
        const response = await fetchWithAuth(link, {
          method: 'GET',
        })
        if (!response.ok) {
          const data = await response.json()
          if (data.message) {
            const messagesStore = useMessagesStore();
            messagesStore.add({
              color: 'error',
              text: data.message,
            });
            return {
              data: [],
              total: 0,
            }
          }
        }

        const results = await response.json()

        results.data.forEach(el => {
          delete el.id;
          el.value = parseFloat(el.value);
          // el.date = new Date(el.date).toLocaleString();
        });
        return results;
      } catch (error) {
        throw error;
      }
    },
    resetData() {
      this.data = [];
    }
  },
  persist: {
    storage: sessionStorage,
    paths: ['data'],
  },
});
