import { defineStore } from 'pinia'
import { useMessagesStore } from './messages';
import { useAuthStore } from './auth';
import { fetchWithAuth } from '@/utils/fetchWithAuth';
import { getToken } from '@/utils/token';
import { URL } from '../utils/constants.js';

export const useUsersStore = defineStore('user', {
  state: () => ({
    user: null,
    userFetched: false, // prevent loop error when trying to fetch user data with a expired token
  }),
  getters: {

  },  
  actions: {
    async fetchUser() {
      const messagesStore = useMessagesStore();
      const authStore = useAuthStore();
      const token = getToken();
      if (!token || authStore.isTokenExpired()) {
        authStore.logout();
        return false;
      }
      
      try {
        const response = await fetchWithAuth(`${URL}/users/me`, {
          method: 'GET',
        });

        if (!response.ok) {
          messagesStore.add({
            color: 'error',
            text: 'Failed to fetch user data',
          });
          throw new Error('Failed to fetch user data');
        }
        const data = await response.json();
        this.user = data;
        return data; 
      } catch (error) {
        console.log(error);
        return false;
      } finally {
        this.userFetched = true;
      }
    },
    async updateUser(userData) {
      const authStore = useAuthStore();
      const response = await fetchWithAuth(`${URL}/users/${authStore.getUserId}`, {
        method: 'PATCH',
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const error = new Error(errorData.error || 'Failed to update user');
        error.status = response.status;
        error.details = errorData.details;
        throw error;
      }
      // This only updates the user in the store, the token payload only updates on next login
      authStore.updateUserState(userData);
  },
  clearUser() {
    this.user = null;
    sessionStorage.removeItem('user');
  },
  },
  persist: {
    enabled: true,
    storage: sessionStorage,
    pick: ['user'],
  }
})