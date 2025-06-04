import { defineStore } from 'pinia'
import { fetchWithAuth } from '@/utils/fetchWithAuth';
import { URL } from '../utils/constants.js';

export const useSuppliersStore = defineStore('suppliers', {
  state: () => ({
    suppliers: [],
    loading: false,
  }),
  persist: true,
  actions: {
    async fetchSuppliers(attributes) {
      const query = attributes ? `?attributes=${encodeURIComponent(attributes)}` : '';
      this.loading = true
      try {
        const response = await fetch(`${URL}/suppliers${query}`)

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.message || 'Network response was not ok')
        }

        const data = await response.json()

        this.suppliers = data.data;

      } catch (error) {
        throw error;
      } finally {
        this.loading = false
      }
    },
    async addSupplier(supplier) {
      try {
        const response = await fetchWithAuth(`${URL}/suppliers`, {
          method: 'POST',
          body: JSON.stringify(supplier),
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.message || 'Network response was not ok')
        }

        const newSupplier = await response.json()
        this.suppliers.push(newSupplier.data);

      } catch (error) {
        throw error
      }
    },
    async updateSupplier(supplier) {
      try {
        const response = await fetchWithAuth(`${URL}/suppliers/${supplier.id}`, {
          method: 'PATCH',
          body: JSON.stringify(supplier),
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.message || 'Network response was not ok')
        }

        await this.fetchSuppliers();

      } catch (error) {
        throw error
      }
    },
    async deleteSupplier(id) {
      try {
        const response = await fetchWithAuth(`${URL}/suppliers/${id}`, {
          method: 'DELETE',
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.message || 'Network response was not ok')
        }

        await this.fetchSuppliers();

      } catch (error) {
        throw error
      }
    }
  },
});
