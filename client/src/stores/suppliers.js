import { defineStore } from 'pinia'
import { getToken } from '@/stores/token.js'

export const useSuppliersStore = defineStore('suppliers', {
  state: () => ({
    suppliers: [],
    loading: false,
  }),
  actions: {
    async fetchSuppliers(attributes) {
      const query = attributes ? `?attributes=${encodeURIComponent(attributes)}` : '';
      this.loading = true
      try {
        const response = await fetch(`http://localhost:3000/suppliers${query}`)

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
      const token = getToken();
      try {
        const response = await fetch('http://localhost:3000/suppliers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${token}`,
          },
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
      const token = getToken();
      try {
        const response = await fetch(`http://localhost:3000/suppliers/${supplier.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${token}`,
          },
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
      const token = getToken();
      try {
        const response = await fetch(`http://localhost:3000/suppliers/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${token}`,
          },
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
