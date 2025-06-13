import { defineStore } from "pinia";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import { URL } from "@/utils/constants.js";
import { useMessagesStore } from "./messages.js";

export const useHousingsStore = defineStore("housings", {
  state: () => ({
    housings: [],
    selectedHousingId: null,
    loaded: false,
    isFirstRun: true,
    selectedSupplierId: null,
  }),
  getters: {
    getSelectedHousing: (state) => {
      if (state.selectedHousingId) {
        return state.housings.find(
          (housing) => housing.id_housing === state.selectedHousingId,
        );
      }
      return null;
    },
  },
  actions: {
    async fetchHousings() {
      if (this.selectedHousingId == null) {
        const messagesStore = useMessagesStore();
        try {
          const response = await fetchWithAuth(`${URL}/housings`, {
            method: "GET",
          });

          if (!response.ok) {
            if (response.status === 404) {
              this.housings = [];
              this.selectedHousingId = null;
              this.loaded = true;
              return;
            }
            const data = await response.json();
            messagesStore.add({
              color: "error",
              text: data.message || "Network response was not ok",
            });
            throw new Error(data.message || "Network response was not ok");
          }
          const data = await response.json();
          this.housings = data.data;
          this.selectedHousingId =
            this.housings.length > 0 ? this.housings[0].id_housing : null;
          this.selectedSupplierId =
            this.housings.length > 0 ? this.housings[0].id_supplier : null;
          console.log("Housings fetched successfully:", this.selectedHousingId);
          console.log("1");


        } catch (error) {
          throw error;
        } finally {
          this.loaded = true;
        }
      }
    },
    async addHousing(housing) {
      console.log("Adding housing:", housing);

      const messagesStore = useMessagesStore();
      try {
        const response = await fetchWithAuth(`${URL}/housings`, {
          method: "POST",
          body: JSON.stringify(housing),
        });

        if (!response.ok) {
          const data = await response.json();
          messagesStore.add({
            color: "error",
            text: data.message || "Network response was not ok",
          });
          throw new Error(data.message || "Network response was not ok");
        }
        const newHousing = await response.json();
        this.housings.push(newHousing.data);
      } catch (error) {
        throw error;
      }
    },
    async updateHousing(housing) {
      const messagesStore = useMessagesStore();

      try {
        const response = await fetchWithAuth(
          `${URL}/housings/${this.selectedHousingId}`,
          {
            method: "PATCH",
            body: JSON.stringify(housing),
          },
        );

        if (!response.ok) {
          const data = await response.json();
          messagesStore.add({
            color: "error",
            text: data.message || "Network response was not ok",
          });
          throw new Error(data.message || "Network response was not ok");
        }

        await this.fetchHousings();
      } catch (error) {
        throw error;
      }
    },
    async deleteHousing(id) {
      const messagesStore = useMessagesStore();
      try {
        const response = await fetchWithAuth(`${URL}/housings/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          const data = await response.json();
          messagesStore.add({
            color: "error",
            text: data.message || "Network response was not ok",
          });
          throw new Error(data.message || "Network response was not ok");
        }

        await this.fetchHousings();
      } catch (error) {
        throw error;
      }
    },
    async fetchLocationByHousingId(id) {
      const messagesStore = useMessagesStore();
      try {
        const response = await fetchWithAuth(`${URL}/housings/${id}/location`, {
          method: "GET",
        });

        if (!response.ok) {
          const data = await response.json();
          messagesStore.add({
            color: "error",
            text: data.message || "Network response was not ok",
          });
          throw new Error(data.message || "Network response was not ok");
        }
        const data = await response.json();
        const location = data.data.location;
        return location;
      } catch (error) {
        throw error;
      }
    },
    resetData() {
      this.housings = [];
      this.selectedHousingId = null;
      this.loaded = false;
      this.isFirstRun = true;
      this.selectedSupplierId = null;
    },
  },
  persist: true,
});
