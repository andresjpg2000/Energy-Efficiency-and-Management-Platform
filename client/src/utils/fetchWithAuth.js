import { getToken } from './token';
import { useMessagesStore } from '@/stores/messages';

export async function fetchWithAuth(url, options = {}) {
  const messagesStore = useMessagesStore();
  const token = getToken();
  const authorization = token ? `Bearer ${token}`: null;

  const headers = {
    ...options.headers,
    'Content-Type': 'application/json',
    'authorization': `${authorization}`,
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    messagesStore.add({
      color: 'error',
      text: 'Unauthorized access. Please log in again.',
    });
    window.location.href = '/login';
    throw new Error('Unauthorized access. Please log in again.');
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