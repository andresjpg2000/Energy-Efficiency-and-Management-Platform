import { defineStore } from "pinia"
import { fetchWithAuth } from "@/utils/fetchWithAuth"
import { useEquipmentsStore } from "./equipmentsStore"
import { URL } from "../utils/constants.js"
import { useMessagesStore } from './messages.js';
import { useAuthStore } from './auth';

export const useProductionsStore = defineStore("productions", {
  state: () => ({
    data: [],
    lastUpdateDate: null,
  }),
  getters: {
    getProductionsByEquipment: (state) => (equipmentId) =>
      state.data.filter((p) => p.id_equipment === equipmentId),

    getProductionToday: (state) => (id) => {
      const today = new Date().toISOString().split("T")[0]
      return state.data
        .filter((p) => p.date.startsWith(today) && p.id_equipment == id)
    },
    getAllProductionToday: (state) => {
      const today = new Date().toISOString().split("T")[0]
      return state.data.filter((p) => p.date.startsWith(today))
    },
    getProductionThisMonth: (state) => {
      const month = new Date().toISOString().split("T")[0].slice(0, 7)
      return state.data
        .filter((c) => c.date.startsWith(month))
        .reduce((sum, c) => sum + c.value, 0)
    },
  },
  actions: {
    async fetchProductions() {
      const equipmentsStore = useEquipmentsStore()

      const end = new Date() // hoje

      let start;

      if (this.lastUpdateDate == null) {
        start = new Date();
        start.setFullYear(end.getFullYear());
        start.setMonth(0); // janeiro
        start.setDate(1);  // dia 1
        start.setHours(1, 0, 0, 0); // 00:00:00.000
        this.lastUpdateDate = end;
      } else {
        start = new Date(this.lastUpdateDate);
      }

      try {
        const fetches = equipmentsStore.equipments.map((eq) =>
          fetchWithAuth(
            `${URL}/energy-equipments/${eq.id_equipment
            }/energy-productions?start=${start.toISOString()}&end=${end.toISOString()}`
          ).then(async (res) => {
            if (!res.ok) {
              const data = await res.json()
              throw new Error(data.message || "Network response was not ok")
            }
            const data = await res.json()
            return data.data.EnergyProductions || []
          })
        )

        // Espera todos os fetchs ao mesmo tempo
        const results = await Promise.all(fetches)

        // Junta todos os dados num único array
        this.data = results.flat()
        this.data.forEach((el) => {
          el.value = parseFloat(el.value)
        })
      } catch (error) {
        throw error
      }
    },
    async fetchProductionsByDate(date) {
      const equipmentsStore = useEquipmentsStore()

      const start = new Date(date)
      console.log("start", start)

      start.setHours(1, 0, 0, 0) // 00:00:00.000
      const end = new Date(start)
      end.setDate(end.getDate() + 1) // dia seguinte

      try {
        const fetches = equipmentsStore.equipments.map((eq) =>
          fetchWithAuth(
            `${URL}/energy-equipments/${eq.id_equipment
            }/energy-productions?start=${start.toISOString()}&end=${end.toISOString()}`
          ).then(async (res) => {
            if (!res.ok) {
              const data = await res.json()
              throw new Error(data.message || "Network response was not ok")
            }
            const data = await res.json()
            return data.data.EnergyProductions || []
          })
        )

        // Espera todos os fetchs ao mesmo tempo
        const results = await Promise.all(fetches)

        // Junta todos os dados num único array
        let data = results.flat()
        data.forEach((el) => {
          el.value = parseFloat(el.value)
          this.data.push(el)
        })
        return data
      } catch (error) {
        throw error
      }
    },
    resetData() {
      this.data = []
      this.lastUpdateDate = null;
    },
    async fetchProdutionTable(size, page, startDate, endDate, equipmentId, houseId) {
      const authStore = useAuthStore();
      let link = `${URL}/energy-productions?userId=${authStore.getUserId}`;
      if (!startDate) {
        startDate = new Date(0);
      } else {
        startDate = new Date(startDate);
      }
      if (!endDate) {
        endDate = new Date();
      } else {
        endDate = new Date(endDate);
      }
      link += `&start=${startDate.toISOString()}`;
      link += `&end=${endDate.toISOString()}`;
      if (equipmentId) link += `&equipmentId=${equipmentId}`;
      if (houseId) link += `&houseId=${houseId}`;
      if (page) link += `&page=${page}`;
      if (size) link += `&size=${size}`;

      console.log('link', link);
      try {
        const response = await fetchWithAuth(link, {
          method: 'GET',
        })
        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.message || 'Network response was not ok')
        }

        const results = await response.json()

        // Junta todos os dados num único array
        console.log('data', results.data);

        results.data.forEach(el => {
          delete el.id_production;
          el.value = parseFloat(el.value);
          el.date = new Date(el.date).toISOString;
        });
        return results;
      } catch (error) {
        throw error;
      }
    },
  },
  persist: {
    storage: sessionStorage,
    paths: ["data"],
  },
})
