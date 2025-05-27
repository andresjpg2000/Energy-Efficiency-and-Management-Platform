import { defineStore } from 'pinia'
import { fetchWithAuth } from '@/utils/fetchWithAuth';

export const useHousingsStore = defineStore('housings', {
  state: () => ({
    housings: [],
    selectedHousingId: null,
    loading: false,
    isFirstRun: true,
  }),
  actions: {
    async fetchHousings() {
      this.loading = true
      try {
        const response = await fetchWithAuth(`http://localhost:3000/housings`, {
          method: 'GET',
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.message || 'Network response was not ok')
        }
        const data = await response.json()
        this.housings = data.data;
      } catch (error) {
        throw error;
      } finally {
        this.loading = false
      }
    },
    async addHousing(housing) {
      console.log('housing', housing);
      try {
        const response = await fetchWithAuth('http://localhost:3000/housings', {
          method: 'POST',
          body: JSON.stringify(housing),
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.message || 'Network response was not ok')
        }

        const newHousing = await response.json()
        this.housings.push(newHousing.data);

      } catch (error) {
        throw error
      }
    },
    async updateHousing(housing) {
      let id_housing = this.selectedHousingId;
      try {
        const response = await fetchWithAuth(`http://localhost:3000/housings/${id_housing}`, {
          method: 'PATCH',
          body: JSON.stringify(housing),
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.message || 'Network response was not ok')
        }

        await this.fetchHousings();

      } catch (error) {
        throw error
      }
    },
    // async deleteHousing(id) {
    //   const token = getToken();
    //   try {
    //     const response = await fetch(`http://localhost:3000/housings/${id_housing}`, {
    //       method: 'DELETE',
    //       headers: {
    //         'Content-Type': 'application/json',
    //         'authorization': `Bearer ${token}`,
    //       },
    //     })

    //     if (!response.ok) {
    //       const data = await response.json()
    //       throw new Error(data.message || 'Network response was not ok')
    //     }

    //     await this.fetchHousings();

    //   } catch (error) {
    //     throw error
    //   } 
    // }
  },
  persist: {
    storage: sessionStorage,
    paths: ['housings', 'selectedHousingId'],
  },
});
