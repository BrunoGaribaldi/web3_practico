<template>
  <v-card variant="flat">
    <v-card-title class="text-h6 font-weight-bold">Detalle del producto</v-card-title>
    <v-divider />

    <v-card-text v-if="!producto">
      <v-alert type="error" variant="tonal" border="start">
        Producto no encontrado.
      </v-alert>
    </v-card-text>

    <v-card-text v-else>
      <div class="mb-2">
        <div class="text-subtitle-1">{{ producto.nombre }}</div>
        <div class="text-body-2">Precio: ${{ producto.precio }}</div>
        <div class="text-body-2">Stock: {{ producto.stock }}</div>
        <div class="text-body-2 mt-2">{{ producto.descripcion }}</div>
      </div>

      <v-btn :disabled="producto.stock === 0" @click="$emit('add-to-cart', producto.id)">
        Agregar al carrito
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  id: { type: String, required: true },           // viene de la URL por props: true
  productos: { type: Array, required: true },     // viene desde App.vue
})
defineEmits(['add-to-cart'])

const producto = computed(() =>
  props.productos.find(p => String(p.id) === String(props.id))
)
</script>
