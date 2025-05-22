// import { useAuthStore } from "../stores/auth";
// Helper function to retrieve the token
export function getToken() {
  // const authStore = useAuthStore();
  const token = sessionStorage.getItem("token");
  return token;
}