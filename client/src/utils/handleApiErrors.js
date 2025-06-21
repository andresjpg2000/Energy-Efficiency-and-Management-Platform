import { useMessagesStore } from "@/stores/messages";

export function handleApiError(
  responseData,
  fallbackMessage = "Network response was not ok",
) {
  const messagesStore = useMessagesStore();

  if (responseData.details && Array.isArray(responseData.details)) {
    responseData.details.forEach((detail) => {
      messagesStore.add({
        color: "error",
        text: `${detail.field}: ${detail.message}`,
        timeout: 2000,
      });
    });
  } else {
    // If no detailed messages, use fallback error or message
    messagesStore.add({
      color: "error",
      text: responseData.error || responseData.message || fallbackMessage,
      timeout: 2000,
    });
  }
}
