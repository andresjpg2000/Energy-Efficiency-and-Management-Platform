import { defineStore } from "pinia"
import { fetchWithAuth } from "@/utils/fetchWithAuth"
import { useEquipmentsStore } from "./equipmentsStore"
import { URL } from "../utils/constants.js"

export const useProductionsStore = defineStore("productions", {
  state: () => ({
    data: [],
  }),
  getters: {
    getProductionsByEquipment: (state) => (equipmentId) =>
      state.data.filter((p) => p.id_equipment === equipmentId),

    getProductionToday: (state) => (id) => {
      const today = new Date().toISOString().split("T")[0]
      return state.data
        .filter((p) => p.date.startsWith(today) && p.id_equipment == id)
        .map((p) => p.value)
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
      this.data = []
      const equipmentsStore = useEquipmentsStore()

      const end = new Date() // hoje

      const start = new Date()
      start.setFullYear(end.getFullYear())
      start.setMonth(0) // janeiro
      start.setDate(1) // dia 1
      start.setHours(1, 0, 0, 0) // 00:00:00.000

      try {
        const fetches = equipmentsStore.equipments.map((eq) =>
          fetchWithAuth(
            `${URL}/energy-equipments/${
              eq.id_equipment
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
            `${URL}/energy-equipments/${
              eq.id_equipment
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
        })
        return data
      } catch (error) {
        throw error
      }
    },
    resetData() {
      this.data = []
    },
  },
  persist: {
    storage: sessionStorage,
    paths: ["data"],
  },
})
