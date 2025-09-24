<template>
  <v-app>
    <v-app-bar flat density="comfortable">
      <v-app-bar-title class="font-weight-bold">Tienda</v-app-bar-title>
      <v-spacer />
      <v-btn variant="text" :to="{ name: 'home' }">Inicio</v-btn>
      <v-btn variant="text" :to="{ name: 'productos' }">Productos</v-btn>
      <v-btn variant="text" :to="{ name: 'registro' }">Registro</v-btn>
    </v-app-bar>

    <v-main>
      <v-container class="py-6">
        <RouterView />
      </v-container>
    </v-main>
  </v-app>
</template>


<script setup>

</script>
