import { defineStore } from 'pinia'
import { useMessagesStore } from './messages';
import { useAuthStore } from './auth';

export const useUsersStore = defineStore('user', {
  state: () => ({
    user: null,
    userFetched: false, // prevent loop error when trying to fetch user data with a expired token
  }),
  getters: {
    isAdmin: (state) => state.user?.admin || false,
    getUsername: (state) => state.user?.name || null,
    getUserId: (state) => state.user?.id_user || null,
    getUserEmail: (state) => state.user?.email || null,
  },  
  actions: {
    async fetchUser() {
      const messagesStore = useMessagesStore();
      const authStore = useAuthStore();
      const token = authStore.token;
      if (!token || authStore.isTokenExpired()) {
          this.clearUser();
          return false;
        }
      
      try {
        const response = await fetch('http://localhost:3000/auth/me', {
          method: 'GET',
          headers: {
            'authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          this.clearUser();
          messagesStore.add({
            color: 'error',
            text: 'Failed to fetch user data',
          });
          throw new Error('Failed to fetch user data');
        }
        const data = await response.json();
        this.user = data;
      } catch (error) {
        console.log(error);
        this.clearUser();
        return false;
      } finally {
        this.userFetched = true;
      }
    },
    async updateUser(userData) {
      const authStore = useAuthStore();
      const token = authStore.token;
      const response = await fetch(`http://localhost:3000/users/${this.user.id_user}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const error = new Error(errorData.error || 'Failed to update user');
        error.status = response.status;
        error.details = errorData.details;
        throw error;
      }

      await this.fetchUser(); // await here to make sure it's done before UI update
  },
  clearUser() {
    this.user = null;
    sessionStorage.removeItem('user');
  },
  },
  persist: {
    enabled: true,
    storage: sessionStorage,
    pick: ['user', 'token'],
  }
})