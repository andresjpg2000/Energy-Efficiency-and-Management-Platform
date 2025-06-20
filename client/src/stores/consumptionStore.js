import { defineStore } from "pinia"
import { fetchWithAuth } from "@/utils/fetchWithAuth"
import { useHousingsStore } from "./housings.js"
import { URL } from "../utils/constants.js"

export const useConsumptionStore = defineStore("consumption", {
  state: () => ({
    data: [], // array of consumptions
    lastUpdateDate: null, // ver mais tarde
  }),
  getters: {
    getConsumptionToday: (state) => {
      const today = new Date().toISOString().split("T")[0]

      return state.data
        .filter((c) => c.date.startsWith(today))
    },
    getConsumptionThisYear: (state) => {
      const thisYear = new Date().getFullYear()
      return state.data.filter((el) => {
        const date = new Date(el.date)
        return date.getFullYear() === thisYear
      })
    },
    getSumConsumption: (state) => {
      return state.getConsumptionToday.reduce((sum, el) => sum + el.value, 0)
    },
    getConsumptionThisMonth: (state) => {
      const month = new Date().toISOString().split("T")[0].slice(0, 7)
      return state.data
        .filter((c) => c.date.startsWith(month))
        .reduce((sum, c) => sum + c.value, 0)
    },
  },
  actions: {
    async fetchConsumption() {
      const housingsStore = useHousingsStore()

      const end = new Date() // hoje
      let start

      if (this.lastUpdateDate == null) {
        start = new Date(end.getFullYear(), 0, 1, 0, 0, 0, 0)
        this.lastUpdateDate = end
      } else {
        start = new Date(this.lastUpdateDate)
      }

      try {
        const response = await fetchWithAuth(
          `${URL}/housings/${housingsStore.selectedHousingId
          }/energy-consumptions?start=${start.toISOString()}&end=${end.toISOString()}`,
          {
            method: "GET",
          }
        )

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.message || "Network response was not ok")
        }
        const result = await response.json()
        const newConsumptions = result.data.consumptions || []

        newConsumptions.forEach((el) => {
          el.value = parseFloat(el.value)
          this.data.push(el)
        })
      } catch (error) {
        throw error
      }
    },
    async fetch2Year() {
      const housingsStore = useHousingsStore()

      const now = new Date()
      const lastYear = now.getFullYear() - 1

      const start = new Date(lastYear, 0, 1, 0, 0, 0, 0) // 1 Jan
      const end = new Date(lastYear, 11, 31, 23, 59, 59, 999) // 31 Dec

      try {
        const response = await fetchWithAuth(
          `${URL}/housings/${housingsStore.selectedHousingId
          }/energy-consumptions?start=${start.toISOString()}&end=${end.toISOString()}`,
          { method: "GET" }
        )

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.message || "Network response was not ok")
        }

        const result = await response.json()

        const newConsumptions = result.data?.consumptions || []

        newConsumptions.forEach((el) => {
          el.value = parseFloat(el.value)
          this.data.push(el)
        })
      } catch (error) {
        throw error
      }
    },
    resetData() {
      this.data = []
      this.lastUpdateDate = null
    },
    async fetchConsumptionDay(date) {
      const housingsStore = useHousingsStore()

      const start = new Date(date)

      start.setHours(1, 0, 0, 0) // Início do dia

      const end = new Date(date)
      end.setHours(24, 59, 59, 999) // Fim do dia
      try {
        const response = await fetchWithAuth(
          `${URL}/housings/${housingsStore.selectedHousingId
          }/energy-consumptions?start=${start.toISOString()}&end=${end.toISOString()}`,
          {
            method: "GET",
          }
        )

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.message || "Network response was not ok")
        }

        const result = await response.json()
        let data = result.data.consumptions || []

        data.forEach((el) => {
          el.value = parseFloat(el.value)
        })

        return data
      } catch (error) {
        throw error
      }
    },

    async fetchConsumptionByDate(date, endDate, page = 1, size = 10) {
      const housingsStore = useHousingsStore()

      if (!date) {
        date = new Date(0);
      } else {
        date = new Date(date);
      }
      date.setHours(1, 0, 0, 0);
      if (!endDate) {
        endDate = new Date();
      } else {
        endDate = new Date(endDate);
      }
      endDate.setHours(24, 59, 59, 999);

      try {
        const response = await fetchWithAuth(
          `${URL}/housings/${housingsStore.selectedHousingId
          }/energy-consumptions?start=${date.toISOString()}&end=${endDate.toISOString()}&page=${page}&size=${size}`,
          {
            method: "GET",
          }
        )

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.message || "Network response was not ok")
        }

        const result = await response.json()

        result.data.consumptions.forEach((el) => {
          el.value = parseFloat(el.value)
        });

        return result
      } catch (error) {
        throw error
      }
    },
  },
  persist: {
    storage: sessionStorage,
    paths: ['data', 'lastUpdateDate'],
  },
})
