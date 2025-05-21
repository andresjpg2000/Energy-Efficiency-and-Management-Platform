import { defineStore } from 'pinia'
import { jwtDecode } from 'jwt-decode';
import { useMessagesStore } from './messages';
import router from '@/router';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: sessionStorage.getItem('token') || null,
  }),
  getters: {
    isLoggedIn: (state) => !!state.token && !state.checkToken(),
  },
  actions: {
    setToken(token) {
      // Used in AuthLogin to read the token from the response and persist it
      this.token = token;
      sessionStorage.setItem('token', token); // Persist token in session storage
      // Set a timeout to clear the token when it expires
      try {
        const { exp } = jwtDecode(token);
        if (!exp) {
          return;
        }
        const expirationTime = exp * 1000 - Date.now();
        setTimeout(() => {
          const messagesStore = useMessagesStore();
          messagesStore.add({
            color: 'error',
            text: 'Session expired, please login again',
          });
          this.clearToken();
          this.logout();
          router.push({ name: 'login' });
        }, expirationTime);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    },
    clearToken() {
      // Reset token and clear it from session storage, used in logout
      this.token = null;
      sessionStorage.removeItem('token'); // Clear token from session storage
    },
    checkToken() {
      // Check if the token is expired
      if (!this.token) {
        return true;
      }
      try {
        const { exp } = jwtDecode(this.token);
        if (!exp) {
          return true;
        }
        return Date.now() >= exp * 1000;
      } catch (error) {
        console.error('Error decoding token:', error);
        return true;
      }
    },
    async logout() {
      const messagesStore = useMessagesStore();
      try {
        if (!this.token || this.checkToken()) {
          this.clearToken();
          return;
        }
        const response = await fetch('http://localhost:3000/auth/logout', {
          method: 'POST',
          headers: {
            'authorization': `Bearer ${this.token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            this.clearToken();
            return;
          }
          messagesStore.add({
            color: 'error',
            text: 'Failed to logout',
          });
          throw new Error('Failed to logout');
        }
        this.clearToken();
        messagesStore.add({
          color: 'success',
          text: 'Logout successful',
        });
      } catch (error) {
        console.log(error);
      } finally {
        this.clearToken();
      }
    },    
    
  },
});