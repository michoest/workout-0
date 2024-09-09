const routes = [
  {
    path: '/',
    component: () => import('layouts/app.layout.vue'),
    children: [
      { path: '', redirect: '/workouts' },
      { path: 'workouts', component: () => import('pages/workouts.page.vue') },
      { path: 'workout/:id', component: () => import('pages/workout.page.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
