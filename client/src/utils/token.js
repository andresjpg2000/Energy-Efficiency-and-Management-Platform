// import { useAuthStore } from "../stores/auth";
// Helper function to retrieve the token
export function getToken() {
  // const authStore = useAuthStore();
  const session = sessionStorage.getItem("auth");
  if (!session) {
    return null;
  }
  try {
    const data = JSON.parse(session);
    if (!data || !data.token) {
      return null;
    }
    return data.token;
  } catch (error) {
    console.error("Error parsing session data:", error);
    return null;
  }

}