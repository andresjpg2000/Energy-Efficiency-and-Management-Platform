import { defineStore } from "pinia";
import { jwtDecode } from "jwt-decode";
import { useMessagesStore } from "./messages";
import router from "@/router";
import { URL } from "../utils/constants.js";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: null,
    refreshToken: null,
    user: null,
    userFetched: false, // Prevent loop error when trying to fetch user data with an expired token
  }),
  getters: {
    isLoggedIn: (state) => !!state.token && !state.isTokenExpired(),
    decodedToken: (state) => {
      if (!state.token) return null;
      try {
        return jwtDecode(state.token);
      } catch (error) {
        console.error("Error decoding token:", error);
        return null;
      }
    },
    isAdmin: (state) => state.user?.admin || false,
    getUsername: (state) => state.user?.name || null,
    getUserId: (state) => state.user?.id_user || null,
    getUserEmail: (state) => state.user?.email || null,
    isTwoFactorEnabled: (state) => state.user?.two_factor_enabled || false,
    getUserNotificationSettings: (state) =>
      state.user?.notification_settings || {},
  },
  actions: {
    setUser(userData) {
      // Used in AuthLogin to read the token from the response
      this.token = userData.accessToken;
      this.refreshToken = userData.refreshToken;
      this.user = userData.user;
      console.log("Setting user data:", userData);
      console.log("User state:", this.user);

      this.userFetched = true;
      // Set a timeout to clear the token when it expires
      try {
        const { exp } = this.decodedToken;
        if (!exp) {
          return;
        }
        const expirationTime = exp * 1000 - Date.now() - 1000; // 1 second before expiration
        setTimeout(async () => {
          const refreshed = await this.refreshAccessToken();
          console.log(refreshed);
          if (!refreshed) {
            // if the token couldnt be refreshed, logout
            const messagesStore = useMessagesStore();
            messagesStore.add({
              color: "error",
              text: "Session expired, please login again",
            });
            this.clearToken();
            this.clearUser();
            this.logout();
            router.push({ name: "login" });
          } else {
            // If the token was refreshed, update the user state and restart timeout
            // NOTE: even if the timeout doesnt call the refreshAcessToken, backend handles the token expiration
            this.setUser({
              accessToken: this.token,
              refreshToken: this.refreshToken,
              user: this.user,
            });
          }
        }, expirationTime);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    },
    clearToken() {
      // Reset token and clear it from session storage, used in logout
      this.token = null;
      this.refreshToken = null;
      sessionStorage.removeItem("token"); // Clear token from session storage
      sessionStorage.removeItem("refreshToken"); // Clear refresh token from session storage
    },
    clearUser() {
      this.user = null;
      sessionStorage.removeItem("user");
    },
    isTokenExpired() {
      if (!this.token) return true;
      const decoded = this.decodedToken;
      if (!decoded || !decoded.exp) return true;

      // Token is expired if current time is past the expiration timestamp
      return Date.now() >= decoded.exp * 1000;
    },
    logout() {
      const messagesStore = useMessagesStore();
      // Logout successful
      this.clearToken();
      this.clearUser();
      messagesStore.add({
        color: "success",
        text: "Logout successful",
      });
    },
    updateUserState(updatedUser) {
      // Update the user state with the updated user data - used in the usersStore
      this.user = { ...this.user, ...updatedUser };
    },
    async refreshAccessToken() {
      const messagesStore = useMessagesStore();
      try {
        const response = await fetch(`${URL}/users/refresh-token`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            refreshToken: this.refreshToken,
          }),
        });
        if (!response.ok) {
          if (response.status === 401) {
            // Token not valid on server
            this.clearToken();
            this.clearUser();
            return false;
          }

          messagesStore.add({
            color: "error",
            text: "Failed to refresh access token",
          });
          throw new Error("Failed to refresh access token");
        }

        const data = await response.json();
        this.token = data.accessToken;
        this.refreshToken = data.refreshToken;

        return true;
      } catch (error) {
        console.error("Error refreshing access token:", error);
        this.clearToken();
        this.clearUser();
        const messagesStore = useMessagesStore();
        messagesStore.add({
          color: "error",
          text: "Failed to refresh access token",
        });
        return false;
      }
    },
  },
  persist: {
    enabled: true,
    storage: sessionStorage,
    pick: ["user", "token", "refreshToken"],
  },
});
