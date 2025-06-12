import { defineStore } from "pinia"

export const useColorsStore = defineStore("colors", {
  state: () => ({
    consumptionColor: "",
    productionColor: "",
    givenEnergyColor: "",
    firstTime: true,
  }),
  getters: {
    getAllColors: (state) => {
      return [
        state.consumptionColor,
        state.productionColor,
        state.givenEnergyColor,
      ];
    },
    getProdAndGivenColors: (state) => {
      return [state.productionColor, state.givenEnergyColor];
    },
  },
  actions: {
    init() {
      if (this.firstTime) {
        this.consumptionColor = "#FF0000"; // Red
        this.productionColor = "#00FF00"; // Green
        this.givenEnergyColor = "#0000FF"; // Blue  
        this.firstTime = false;
      }
    }

  },
  persist: true,
})
