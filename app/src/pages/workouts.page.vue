<template>
  <q-header class="bg-white text-primary">
    <q-toolbar>
      <q-toolbar-title class="text-center">
        Workouts
      </q-toolbar-title>
    </q-toolbar>
  </q-header>
  
  <q-page class="q-pa-md">
    <q-list separator>
      <q-expansion-item v-for="workout in workouts" :key="workout.id" :label="workout.name"
        :caption="`Total duration: ${totalDuration(workout).format('m:ss')} minutes`" class="q-my-md">
        <q-card>
          <q-card-section>
            <div v-for="exercise, index in workout.content" :key="index">
              {{ exercise.name }} - {{ exercise.duration }} seconds
            </div>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat color="primary" :to="`/workout/${workout.id}`">View Details</q-btn>
          </q-card-actions>
        </q-card>
      </q-expansion-item>
    </q-list>
  </q-page>
</template>

<script setup>
defineOptions({ name: 'WorkoutsPage' });

import { computed } from 'vue';
import { useStore } from 'src/stores/store';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

const $store = useStore();

const workouts = computed(() => {
  return $store.workouts || [];
});

const totalDuration = (workout) => {
  return dayjs.duration(workout.content.reduce((acc, exercise) => acc + exercise.duration, 0), 's');
};
</script>
