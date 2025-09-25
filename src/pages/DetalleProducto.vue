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
  id: { type: String, required: true },           // viene de la URL por props: true. El id del producto no pertenece a App.vue, 
                                                  // sino a DetalleProducto.vue, que lo recibe directamente del router.
                                                  //App vue tiene los props globales, que le pasa a todas las paginas.
                                                  //aca el id viene en la url gracias a { path: '/productos/:id', component: DetalleProducto, props: true }
  productos: { type: Array, required: true },     // viene desde App.vue
})
defineEmits(['add-to-cart'])

//Esa línea crea una propiedad computada que busca dentro del array de productos
//  el producto que tiene el mismo id que viene de la URL.
//String(p.id) === String(props.id) Compara el id del producto (p.id) con el id de la URL (props.id)
//despues para el detalle uso obviamente producto xdxdxd no productos.
const producto = computed(() =>
  props.productos.find(p => String(p.id) === String(props.id))
)
</script>
