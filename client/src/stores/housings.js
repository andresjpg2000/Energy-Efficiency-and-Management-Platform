import { defineStore } from "pinia";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import { URL } from "@/utils/constants.js";
import { handleApiError } from "@/utils/handleApiErrors.js";

export const useHousingsStore = defineStore("housings", {
  state: () => ({
    housings: [],
    selectedHousingId: null,
    loaded: false,
    isFirstRun: true,
    selectedSupplierId: null,
    triggerOpenDialog: false,
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
    openAddHousingDialog() {
      this.triggerOpenDialog = true;
    },
    closeAddHousingDialog() {
      this.triggerOpenDialog = false;
    },
    async fetchHousings() {
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
          handleApiError(data);
          throw new Error("Request failed");
        }
        const data = await response.json();
        this.housings = data.data;
        // Only set selected if it's currently null or no longer valid
        const stillExists = this.housings.some(
          (h) => h.id_housing === this.selectedHousingId,
        );
        if (!stillExists) {
          this.selectedHousingId =
            this.housings.length > 0 ? this.housings[0].id_housing : null;
          this.selectedSupplierId =
            this.housings.length > 0 ? this.housings[0].id_supplier : null;
        }
      } catch (error) {
        throw error;
      } finally {
        this.loaded = true;
      }
    },
    async addHousing(housing) {
      try {
        const response = await fetchWithAuth(`${URL}/housings`, {
          method: "POST",
          body: JSON.stringify(housing),
        });

        if (!response.ok) {
          const data = await response.json();
          handleApiError(data);
          throw new Error("Request failed");
        }
        const newHousing = await response.json();
        this.housings.push(newHousing.data);
        this.fetchHousings();
        this.selectedHousingId = newHousing.data.id_housing;
        this.selectedSupplierId = newHousing.data.id_supplier;
      } catch (error) {
        throw error;
      }
    },
    async updateHousing(housing) {
      const response = await fetchWithAuth(
        `${URL}/housings/${this.selectedHousingId}`,
        {
          method: "PATCH",
          body: JSON.stringify(housing),
        },
      );

      if (!response.ok) {
        const data = await response.json();
        handleApiError(data);
        throw new Error("Request failed");
      }

      await this.fetchHousings();
      this.selectedHousingId = housing.id_housing;
      this.selectedSupplierId = housing.id_supplier;
      console.log("selectedHousingId", this.selectedHousingId);
    },
    async deleteHousing(id) {
      try {
        const response = await fetchWithAuth(`${URL}/housings/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          const data = await response.json();
          handleApiError(data);
          throw new Error("Request failed");
        }
        // Remove the housing from the local state
        this.housings = this.housings.filter(
          (housing) => housing.id_housing !== id,
        );

        if (this.selectedHousingId === id) {
          this.selectedHousingId = null;
          this.selectedSupplierId = null;
        }

        // If there are still housings, select the first one
        if (this.housings.length > 0) {
          this.selectedHousingId = this.housings[0].id_housing;
          this.selectedSupplierId = this.housings[0].id_supplier;
          await this.fetchHousings();
        }
      } catch (error) {
        throw error;
      }
    },
    async fetchLocationByHousingId(id) {
      try {
        const response = await fetchWithAuth(`${URL}/housings/${id}/location`, {
          method: "GET",
        });

        if (!response.ok) {
          const data = await response.json();
          handleApiError(data);
          throw new Error("Request failed");
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
      this.triggerOpenDialog = false;
    },
  },
  persist: true,
});
