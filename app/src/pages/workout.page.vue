<template>
  <q-header class="bg-white text-primary">
    <q-toolbar>
      <q-toolbar-title class="text-center">
        {{ workout.name }}
      </q-toolbar-title>
    </q-toolbar>
  </q-header>

  <q-page class="q-pa-md">
    <p>Total duration: {{ totalDuration.format('m:ss') }} minutes</p>
    <q-list bordered separator>
      <q-item v-for="exercise, index in workout.content" :key="index">
        <q-item-section>
          <q-item-label>{{ exercise.name }}</q-item-label>
          <q-item-label caption>{{ exercise.duration }} seconds</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
    <q-btn flat color="positive" icon="play_circle" size="48px" class="q-mt-md" @click="startWorkout" />

    <q-dialog v-model="workoutInProgress">
      <q-card style="min-width: 350px">
        <q-card-section class="text-center">
          <div class="text-h4">{{ currentExercise.name }}</div>
          <div class="text-subtitle2">Next: {{ nextExercise ? nextExercise.name : 'Finish' }}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="row justify-center items-center">
            <q-circular-progress
              show-value
              font-size="52px"
              :value="progressPercentage"
              size="250px"
              :thickness="0.22"
              :color="currentExercise.type == 'exercise' ? 'positive' : 'negative'"
              track-color="grey-3"
              class="q-ma-md"
              instant-feedback
            >
              {{ dayjs.duration(remainingTime + 999, 'ms').format('s') }}
            </q-circular-progress>
          </div>
        </q-card-section>

        <q-card-actions align="center">
          <q-btn flat :icon="isPaused ? 'play_arrow' : 'pause'" size="48px" @click="togglePause" />
          <q-btn flat icon="stop" color="negative" size="48px" @click="stopWorkout" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
defineOptions({ name: 'WorkoutPage '});

import { ref, computed, onBeforeMount, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'src/stores/store';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

const $store = useStore();
const $route = useRoute();

const workout = ref({});

onBeforeMount(() => {
  workout.value = $store.workouts.find(workout => workout.id == $route.params.id);
});

onUnmounted(() => {
  cancelAnimationFrame(animationFrameId);
});

const workoutInProgress = ref(false);
const currentExerciseIndex = ref(0);
const remainingTime = ref(0);
const isPaused = ref(false);
const progress = ref(0);

let startTime = 0;
let pausedTime = 0;
let animationFrameId = null;

const currentExercise = computed(() => workout.value.content[currentExerciseIndex.value]);
const nextExercise = computed(() => workout.value.content[currentExerciseIndex.value + 1]);

const progressPercentage = computed(() => {
  if (!currentExercise.value) return 0;
  const elapsed = currentExercise.value.duration * 1000 - remainingTime.value;
  return (elapsed / currentExercise.value.duration / 1000) * 100;
});

function startWorkout() {
  workoutInProgress.value = true;
  currentExerciseIndex.value = 0;
  startExercise();
}

function startExercise() {
  remainingTime.value = currentExercise.value.duration * 1000;
  progress.value = 0;
  startTime = performance.now();
  pausedTime = 0;
  animateProgress();
}

function animateProgress() {
  if (isPaused.value) {
    animationFrameId = requestAnimationFrame(animateProgress);
    return;
  }

  const currentTime = performance.now();
  const elapsedTime = currentTime - startTime - pausedTime;
  progress.value = elapsedTime / currentExercise.value.duration / 1000;
  remainingTime.value = Math.max(currentExercise.value.duration * 1000 - elapsedTime, 0);

  if (remainingTime.value <= 0) {
    moveToNextExercise();
  } else {
    animationFrameId = requestAnimationFrame(animateProgress);
  }
}

function moveToNextExercise() {
  cancelAnimationFrame(animationFrameId);
  currentExerciseIndex.value++;
  if (currentExerciseIndex.value < workout.value.content.length) {
    startExercise();
  } else {
    stopWorkout();
  }
}

function stopWorkout() {
  cancelAnimationFrame(animationFrameId);
  workoutInProgress.value = false;
  currentExerciseIndex.value = 0;
  remainingTime.value = 0;
  progress.value = 0;
}

let pauseStartTime = 0;

function togglePause() {
  isPaused.value = !isPaused.value;
  if (isPaused.value) {
    pauseStartTime = performance.now();
  } else {
    pausedTime += performance.now() - pauseStartTime;
  }
}

const totalDuration = computed(() => {
  return dayjs.duration(workout.value.content.reduce((acc, exercise) => acc + exercise.duration, 0), 's');
});
</script>


<!-- <script setup>
defineOptions({ name: 'WorkoutPage' });

import { ref, computed, onUnmounted } from 'vue';

const workout = ref({
  id: 1,
  name: 'Full Body Workout',
  totalDuration: 30,
  content: [
    { id: 1, name: 'Push-ups', duration: 60 },
    { id: 2, name: 'Squats', duration: 60 },
    { id: 3, name: 'Plank', duration: 30 },
  ],
});

const workoutInProgress = ref(false);
const currentExerciseIndex = ref(0);
const remainingTimeFloat = ref(0);
const isPaused = ref(false);
const progress = ref(0);

let startTime = 0;
let pausedTime = 0;
let animationFrameId = null;

const currentExercise = computed(() => workout.value.content[currentExerciseIndex.value]);
const nextExercise = computed(() => workout.value.content[currentExerciseIndex.value + 1]);

const progressPercentage = computed(() => progress.value * 100);
const remainingTime = computed(() => Math.ceil(remainingTimeFloat.value));

function stopWorkout() {
  cancelAnimationFrame(animationFrameId);
  workoutInProgress.value = false;
  currentExerciseIndex.value = 0;
  remainingTimeFloat.value = 0;
  progress.value = 0;
}


onUnmounted(() => {
  cancelAnimationFrame(animationFrameId);
});
</script>

<template>
  <q-page class="q-pa-md">
    <h1>{{ workout.name }}</h1>
    <p>Total duration: {{ workout.totalDuration }} minutes</p>
    <q-list bordered separator>
      <q-item v-for="exercise in workout.content" :key="exercise.id">
        <q-item-section>
          <q-item-label>{{ exercise.name }}</q-item-label>
          <q-item-label caption>{{ exercise.duration }} seconds</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
    <q-btn color="primary" class="q-mt-md" @click="startWorkout">Start Workout</q-btn>

    <q-dialog v-model="workoutInProgress">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">{{ currentExercise.name }}</div>
          <div class="text-subtitle2">Next: {{ nextExercise ? nextExercise.name : 'Finish' }}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="row justify-center items-center">
            <q-circular-progress
              show-value
              font-size="52px"
              :value="progressPercentage"
              size="250px"
              :thickness="0.22"
              color="green"
              track-color="grey-3"
              class="q-ma-md"
            >
              {{ remainingTime }}
            </q-circular-progress>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat :label="isPaused ? 'Resume' : 'Pause'" color="primary" @click="togglePause" />
          <q-btn flat label="Stop" color="negative" @click="stopWorkout" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<style scoped>
.q-circular-progress__text {
  font-weight: bold;
}
</style> -->
