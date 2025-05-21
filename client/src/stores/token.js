import { useAuthStore } from "./auth";
// Helper function to retrieve the token from the auth store
export function getToken() {
  const authStore = useAuthStore();
  return authStore.token;
}