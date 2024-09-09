import { defineStore } from 'pinia';

export const useStore = defineStore('workout', {
  state: () => ({
    workouts: [
      {
        id: '0f475972-b066-4155-a05d-4b06f71c196b',
        name: '7 minute',
        content: [
          { type: 'exercise', name: 'Push-up', duration: 30 },
          { type: 'break', name: 'Pause', duration: 5 },
          { type: 'exercise', name: 'Wall sit', duration: 30 }
        ],
        history: []
      },
      {
        id: 'dcaade71-3acf-40eb-89e0-2d5ff17e7cf1',
        name: 'Pull-up',
        content: [
          { type: 'exercise', name: 'Pull-up', duration: 20 },
          { type: 'break', name: 'Pause', duration: 20 },
          { type: 'exercise', name: 'Pull-up', duration: 20 }
        ],
        history: []
      }
    ],
  }),
  getters: {

  },
  actions: {

  },
});
