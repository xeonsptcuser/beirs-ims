import { defineStore } from 'pinia'

export const useGlobalLoadingStore = defineStore('globalLoading', {
  state: () => ({ isNavigating: false }),
  actions: {
    startNavigation() {
      this.isNavigating = true
    },
    endNavigation() {
      this.isNavigating = false
    },
  },
})
