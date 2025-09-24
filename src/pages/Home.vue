<!-- src/pages/Home.vue -->
<template>
  <v-container class="py-8" max-width="1100">

    <v-row align="center">
      <v-col cols="12" md="7">
        <h1 class="text-h4 text-md-h3 font-weight-bold mb-2">Tienda</h1>
        <p class="text-body-1 mb-4">
          Comprá productos frescos y al mejor precio. Enviamos en el día.
        </p>

        <div class="d-flex flex-wrap ga-3">
          <v-btn size="large" :to="{ name: 'productos' }">
            Ver productos
          </v-btn>
          <v-btn size="large" variant="tonal" :to="{ name: 'registro' }">
            Crear cuenta
          </v-btn>
        </div>

        <div class="mt-5">
          <v-chip size="large" variant="flat">
            Carrito: <strong class="ml-1">{{ totalItems }} ítem(s)</strong>
            <span class="mx-2">·</span>
            Total: <strong class="ml-1">${{ totalCarrito }}</strong>
          </v-chip>
        </div>
      </v-col>

      <v-col cols="12" md="5" class="d-flex justify-center">
        <v-sheet
          class="d-flex align-center justify-center"
          height="220"
          width="100%"
          rounded="xl"
          elevation="1"
        >
          <v-icon size="96">mdi-cart</v-icon>
        </v-sheet>
      </v-col>
    </v-row>

    <!-- DESTACADOS -->
    <v-row class="mt-10">
      <v-col cols="12" class="d-flex align-center justify-space-between">
        <h2 class="text-h5 font-weight-bold">Destacados</h2>
        <v-btn variant="text" :to="{ name: 'productos' }">
          Ver todo
        </v-btn>
      </v-col>

      <v-col
        v-for="p in destacados"
        :key="p.id"
        cols="12" sm="6" md="4"
      >
        <v-card rounded="xl" class="h-100 d-flex flex-column">
          <v-card-item>
            <div class="text-subtitle-1 font-weight-medium">
              {{ p.nombre }}
            </div>
            <div class="text-body-2 text-medium-emphasis">
              ${{ p.precio }}
            </div>
          </v-card-item>

          <v-card-text class="pt-0">
            <div class="text-body-2 mb-2">
              {{ p.descripcion || 'Producto de excelente calidad.' }}
            </div>
            <v-chip
              :color="availableStock(p) === 0 ? 'warning' : 'success'"
              size="small"
              variant="flat"
            >
              Stock: {{ availableStock(p) }}
            </v-chip>
          </v-card-text>

          <v-spacer />

          <v-card-actions class="mt-auto">
            <v-btn
              variant="text"
              :to="{ name: 'producto', params: { id: p.id } }"
            >
              Ver detalle
            </v-btn>
            <v-spacer />
            <v-btn
              :disabled="availableStock(p) === 0"
              @click="$emit('add-to-cart', p.id)"
            >
              Agregar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  productos: { type: Array, required: true },
  carrito:   { type: Array, required: true },
  totalCarrito: { type: Number, required: true },
})
const emit = defineEmits(['add-to-cart'])

/** Top 3 como destacados  */
const destacados = computed(() => props.productos.slice(0, 3))

/** Total de unidades en carrito */
const totalItems = computed(() =>
  props.carrito.reduce((acc, i) => acc + i.cantidad, 0)
)

/** Stock disponible = stock catálogo − cantidad en carrito */
function availableStock(p) {
  const item = props.carrito.find(i => i.id === p.id)
  return p.stock - (item?.cantidad ?? 0)
}
</script>
