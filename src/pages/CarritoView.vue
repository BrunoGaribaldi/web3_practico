<template>
  <v-container class="py-6" max-width="900">
    <v-row class="mb-4">
      <v-col cols="12" class="d-flex align-center justify-space-between">
        <h1 class="text-h5 font-weight-bold">Carrito</h1>
        <v-btn variant="text" :to="{ name: 'productos' }">Seguir comprando</v-btn>
      </v-col>
    </v-row>

    <!-- Vacío -->
    <v-row v-if="carrito.length === 0">
      <v-col cols="12">
        <v-alert type="info" variant="tonal" border="start" density="comfortable">
          Tu carrito está vacío. ¡Agregá productos desde el listado!
        </v-alert>
      </v-col>
    </v-row>

    <!-- Items -->
    <v-row v-else>
      <v-col cols="12" md="8">
        <v-card rounded="xl" elevation="1">
          <v-list density="comfortable">
            <v-list-item
              v-for="item in carrito"
              :key="item.id"
            >
              <template #prepend>
                <v-avatar size="36" color="grey-lighten-3">
                  <v-icon>mdi-cube-outline</v-icon>
                </v-avatar>
              </template>

              <v-list-item-title class="font-weight-medium">
                {{ item.nombre }}
              </v-list-item-title>
              <v-list-item-subtitle>
                ${{ item.precio }} c/u · Subtotal: ${{ item.precio * item.cantidad }}
              </v-list-item-subtitle>

              <template #append>
                <div class="d-flex align-center ga-2">
                  <v-btn icon size="x-small" variant="text" @click="$emit('dec-qty', item.id)">
                    <v-icon>mdi-minus</v-icon>
                  </v-btn>
                  <span class="min-w-8 text-center">{{ item.cantidad }}</span>
                  <v-btn icon size="x-small" variant="text" @click="$emit('inc-qty', item.id)">
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                  <v-btn icon size="x-small" variant="text" color="error" @click="$emit('remove-from-cart', item.id)">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </div>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <!-- Resumen -->
      <v-col cols="12" md="4">
        <v-card rounded="xl" elevation="2" class="pa-4">
          <div class="d-flex justify-space-between mb-2">
            <span class="text-medium-emphasis">Total ítems</span>
            <strong>{{ totalItems }}</strong>
          </div>
          <div class="d-flex justify-space-between text-h6 font-weight-bold mb-4">
            <span>Total</span>
            <span>${{ totalCarrito }}</span>
          </div>

          <v-btn block color="primary" class="mb-2" :disabled="carrito.length === 0">
            Ir a pagar
          </v-btn>
          <v-btn block variant="tonal" color="error" @click="$emit('clear-cart')">
            Vaciar carrito
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  carrito: { type: Array, required: true },
  totalCarrito: { type: Number, required: true }
})
defineEmits(['inc-qty', 'dec-qty', 'remove-from-cart', 'clear-cart'])

const totalItems = computed(() =>
  props.carrito.reduce((acc, i) => acc + i.cantidad, 0)
)
</script>

<style scoped>
.min-w-8 { width: 2rem; display: inline-block; }
</style>
