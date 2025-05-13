import { defineStore } from 'pinia'

export const useSuppliersStore = defineStore('suppliers', {
  state: () => ({
    suppliers: [],
    loading: false,
    token: sessionStorage.getItem('token'),
  }),
  actions: {
    async fetchSuppliers() {
      this.loading = true
      try {
        const response = await fetch('http://localhost:3000/suppliers')

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

        const response = await fetch('http://localhost:3000/suppliers', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
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
      try {
        const response = await fetch(`http://localhost:3000/suppliers/${supplier.id}`, {
          method: 'PATCH',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
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
      try {
        const response = await fetch(`http://localhost:3000/suppliers/${id}`, {
          method: 'DELETE',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
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
