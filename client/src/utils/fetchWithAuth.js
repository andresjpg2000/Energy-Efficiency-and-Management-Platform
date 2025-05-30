import { useMessagesStore } from '@/stores/messages';
import { useAuthStore } from '@/stores/auth';

export async function fetchWithAuth(url, options = {}) {
  const messagesStore = useMessagesStore();
  const authStore = useAuthStore();
  const token = authStore.token || sessionStorage.getItem('token') || null;
  const authorization = token ? `Bearer ${token}` : null;

  const headers = {
    ...options.headers,
    'Content-Type': 'application/json',
    'authorization': `${authorization}`,
    'Accept-Encoding': 'gzip, deflate, br',
  }

  let response = await fetch(url, {
    ...options,
    headers,
  });

  const encoding = response.headers.get('content-encoding');
  console.log('Resposta comprimida com:', encoding); // ← 'gzip', 'br', etc

  if (response.status === 401 && authStore.refreshToken) {
    const refreshed = await authStore.refreshAccessToken();
    if (refreshed) {
      // Retry with new token
      const newToken = authStore.token;
      const retryHeaders = {
        ...headers,
        authorization: `Bearer ${newToken}`,
      };

      response = await fetch(url, {
        ...options,
        headers: retryHeaders,
      });

      if (response.ok) return response;
    }

      messagesStore.add({
        color: 'error',
        text: 'Unauthorized access. Please log in again.',
      });
      window.location.href = '/login';
      throw new Error('Unauthorized after refresh');
    }

  if (response.status === 403) {
    messagesStore.add({
      color: 'error',
      text: 'Forbidden access. You do not have permission to perform this action.',
    });
    window.location.href = '/forbidden';
    throw new Error('Forbidden access. You do not have permission to perform this action.');
  }

  return response;
}