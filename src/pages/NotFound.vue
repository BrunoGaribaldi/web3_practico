<template>
  <v-container class="d-flex align-center justify-center" style="min-height: calc(100vh - 64px);">
    <v-card rounded="xl" elevation="2" class="pa-8 text-center" max-width="420">
      <v-icon size="64" class="mb-3">mdi-emoticon-sad-outline</v-icon>
      <h1 class="text-h5 font-weight-bold mb-2">Página no encontrada</h1>
      <p class="text-medium-emphasis mb-6">La ruta que buscás no existe.</p>
      <v-btn :to="{ name: 'home' }">Volver al inicio</v-btn>
    </v-card>
  </v-container>
</template>