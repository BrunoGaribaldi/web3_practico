<template>
  <v-container class="py-6" max-width="900">
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 font-weight-bold mb-4">Productos</h1>
      </v-col>

      <!-- Buscador -->
      <v-col cols="12" md="8">
        <v-text-field
          v-model.trim="producto"
          label="Buscar producto"
          placeholder="Ingrese nombre (Ej. Arroz)"
          prepend-inner-icon="mdi-magnify"
          clearable
          @keyup.enter="buscarProducto"
        />
      </v-col>

      <v-col cols="12" md="4" class="d-flex align-center">
        <v-btn class="ml-md-2" @click="buscarProducto">Buscar</v-btn>
      </v-col>

      <!-- Alertas -->
      <v-col cols="12" v-if="productoNoEncontrado">
        <v-alert type="error" density="comfortable" variant="tonal" border="start">
          Producto <strong>NO</strong> encontrado.
        </v-alert>
      </v-col>

      <v-col cols="12" v-else-if="productoEncontrado && stockCero">
        <v-alert type="warning" density="comfortable" variant="tonal" border="start">
          Producto encontrado <strong>sin stock</strong> — {{ productoEncontrado?.nombre }}
          (${{ productoEncontrado?.precio }}) · Stock: {{ availableStock(productoEncontrado) }}
        </v-alert>
      </v-col>

      <v-col cols="12" v-else-if="productoEncontrado">
        <v-alert
          type="success"
          density="comfortable"
          variant="tonal"
          border="start"
          class="d-flex align-center justify-space-between"
        >
          <div>
            Producto encontrado — <strong>{{ productoEncontrado.nombre }}</strong>
            (${{ productoEncontrado.precio }}) · Stock: {{ availableStock(productoEncontrado) }}
          </div>
          <v-btn
            size="small"
            :disabled="availableStock(productoEncontrado) === 0"
            @click="$emit('add-to-cart', productoEncontrado.id)"
          >
            Agregar al carrito
          </v-btn>
        </v-alert>
      </v-col>

      <!-- Lista completa de productos -->
      <v-col cols="12" md="7">
        <v-card variant="flat" class="mb-4">
          <v-card-title class="text-subtitle-1 font-weight-bold">
            Lista completa de productos
          </v-card-title>

          <v-divider />

            <v-list density="comfortable">
            <v-list-item
                v-for="p in productos"
                :key="p.id"
            >
                <!--cubito que aparece a la izq.-->
              <template #prepend>
                <v-avatar size="36" color="grey-lighten-3">
                  <v-icon>mdi-cube-outline</v-icon>
                </v-avatar>
              </template>

                <v-list-item-title class="font-weight-medium">
                {{ p.nombre }} — ${{ p.precio }}
                </v-list-item-title>

                <v-list-item-subtitle>
                <v-chip
                    :color="availableStock(p) === 0 ? 'warning' : 'success'"
                    size="small"
                    variant="flat"
                >
                    Stock: {{ availableStock(p) }}
                </v-chip>
                </v-list-item-subtitle>

                <template #append>
                <div class="d-flex align-center ga-2">
                    <!--link a detalle de producto. se reemplaza id por el id del producto-->
                    <!--osea vos estarias yendo a /products/4 por ejemplo-->
                    <RouterLink
                    :to="{ name: 'producto', params: { id: p.id } }"
                    class="text-primary text-decoration-underline"
                    >
                    Ver detalle
                    </RouterLink>

                    <v-btn
                    size="small"
                    :disabled="availableStock(p) === 0"
                    @click="$emit('add-to-cart', p.id)"
                    >
                    Agregar
                    </v-btn>
                </div>
                </template>
            </v-list-item>
            </v-list>

        </v-card>
      </v-col>

      <!-- Carrito -->
      <v-col cols="12" md="5">
        <v-card variant="flat">
          <v-card-title
            class="text-subtitle-1 font-weight-bold d-flex align-center justify-space-between"
          >
            Carrito
            <!--este es el chip chiquitito de arriba a la derecha que dice vacio-->
            <template v-if="carrito.length === 0">
              <v-chip size="small" color="grey" variant="flat">Vacío</v-chip>
            </template>

            <template v-else>
              <span>Total: ${{ totalCarrito }}</span>
            </template>
          </v-card-title>
          <v-divider />

          <v-list v-if="carrito.length > 0" density="compact">
            <v-list-item v-for="item in carrito" :key="item.id">
              <v-list-item-title class="font-weight-medium">
                {{ item.nombre }} — ${{ item.precio }} × {{ item.cantidad }}
              </v-list-item-title>
              <v-list-item-subtitle>
                Subtotal: ${{ item.cantidad * item.precio }}
              </v-list-item-subtitle>

              <template #append>
                <div class="d-flex align-center ga-2">
                  <v-btn
                    icon
                    size="x-small"
                    variant="text"
                    @click="$emit('dec-qty', item.id)"
                    
                  >
                    <v-icon>mdi-minus</v-icon>
                  </v-btn>
                  <v-btn
                    icon
                    size="x-small"
                    variant="text"
                    @click="$emit('inc-qty', item.id)"
                    
                  >
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                  <v-btn
                    icon
                    size="x-small"
                    variant="text"
                    color="error"
                    @click="$emit('remove-from-cart', item.id)"
                    
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </div>
              </template>
            </v-list-item>
          </v-list>

          <v-card-actions v-else>
            <v-card-text class="text-medium-emphasis">Carrito vacío</v-card-text>
          </v-card-actions>

          <v-card-actions v-if="carrito.length > 0">
            <v-spacer />
            <v-btn color="error" variant="tonal" @click="$emit('clear-cart')">
              Vaciar carrito
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  productos: { type: Array, required: true },
  carrito:   { type: Array, required: true },
  totalCarrito: { type: Number, required: true },
})
defineEmits(['add-to-cart', 'dec-qty', 'inc-qty', 'remove-from-cart', 'clear-cart'])

// Estado local SOLO para buscador/alertas
const producto = ref('')
const productoEncontrado = ref(null)
const productoNoEncontrado = ref(false)
const stockCero = ref(false)

function buscarProducto () {
  const n = producto.value.trim()
  productoEncontrado.value = null
  productoNoEncontrado.value = false
  stockCero.value = false
  if (!n) return

  //buscamos en el props (app.vue) si existe el producto.
  const encontrado = props.productos.find(
    p => p.nombre.toLowerCase() === n.toLowerCase()
  )
  if (!encontrado) {
    productoNoEncontrado.value = true
    return
  }
  productoEncontrado.value = encontrado
  stockCero.value = availableStock(encontrado) === 0
}

//verificamos el stock disponible, para ello buscamos en props y restamos lo que haya en el carrito.
//esto es para mostrar el stock real, no el del array original.
//si no hay nada en el carrito, usamos el stock original.
function availableStock(p) {
  const item = props.carrito.find(i => i.id === p.id)
  return p.stock - (item?.cantidad ?? 0)
}
</script>
