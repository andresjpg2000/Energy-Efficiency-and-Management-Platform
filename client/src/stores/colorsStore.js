import { defineStore } from "pinia"
import { useWidgetsStore } from "./widgetsStore";
import { URL } from "../utils/constants.js";
import { useMessagesStore } from "./messages";

export const useColorsStore = defineStore("colors", {
  state: () => ({
    consumptionColor: "",
    productionColor: "",
    givenEnergyColor: "",
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
    init(colors) {
      this.consumptionColor = colors.consumptionColor
      this.productionColor = colors.productionColor
      this.givenEnergyColor = colors.givenEnergyColor
    },
    resetColors() {
      this.consumptionColor = ""
      this.productionColor = ""
      this.givenEnergyColor = ""
    },
    async saveColors() {
      const messagesStore = useMessagesStore()
      const widgetsStore = useWidgetsStore()
      const body = {
        consumptionColor: this.consumptionColor,
        productionColor: this.productionColor,
        givenEnergyColor: this.givenEnergyColor,
      }
      const ColorWidget = {
        type: 99,
        title: "Colors",
        body: body,
      }

      try {
        await widgetsStore.deleteWidget("Colors")
        await widgetsStore.addWidget(ColorWidget)

        messagesStore.add({
          color: "success",
          text: "Colors saved successfully!",
        })
      } catch (error) {
        messagesStore.add({
          color: "error",
          text: "Failed to save colors: " + error.message,
        })
      }
    }

  },
  persist: true,
})
