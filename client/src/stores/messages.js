import { defineStore } from 'pinia'

export const useMessagesStore = defineStore('messages', {
  state: () => ({
    queue: []
  }),
  actions: {
    add(message) {
      this.queue.push(message)
    }
  }
})
