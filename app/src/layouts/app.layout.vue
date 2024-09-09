<template>
  <q-layout view="lHh Lpr lFf">
    <!-- <q-header class="bg-white text-primary">
        <q-toolbar>
          <q-toolbar-title class="text-center">
            Quasar Framework
          </q-toolbar-title>
        </q-toolbar>
      </q-header> -->

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer class="bg-grey-2 text-primary">
      <q-separator />
      <q-tabs v-model="tab" align="justify">
        <q-route-tab name="workouts" icon="list" to="/" />
        <q-route-tab name="settings" icon="settings" to="/settings" disable />
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script setup>
defineOptions({ name: 'AppLayout' });

import { ref } from 'vue'
import { useStore } from 'stores/store'

const tab = ref('menu')
const store = useStore()
</script>
