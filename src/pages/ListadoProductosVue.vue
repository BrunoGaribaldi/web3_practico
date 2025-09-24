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
        <v-btn
          class="ml-md-2"
          @click="buscarProducto"
        >
          Buscar
        </v-btn>
      </v-col>

      <!-- Alertas de resultado de búsqueda -->
      <v-col cols="12" v-if="productoNoEncontrado">
        <v-alert type="error" density="comfortable" variant="tonal" border="start">
          Producto <strong>NO</strong> encontrado.
        </v-alert>
      </v-col>

      <v-col cols="12" v-else-if="productoEncontrado && stockCero">
        <v-alert type="warning" density="comfortable" variant="tonal" border="start">
          Producto encontrado <strong>sin stock</strong> — {{ productoEncontrado.name }}
          (${{ productoEncontrado.price }}) · Stock: {{ productoEncontrado.stock }}
        </v-alert>
      </v-col>

      <v-col cols="12" v-else-if="productoEncontrado">
        <v-alert type="success" density="comfortable" variant="tonal" border="start" class="d-flex align-center justify-space-between">
          <div>
            Producto encontrado — <strong>{{ productoEncontrado.name }}</strong>
            (${{ productoEncontrado.price }}) · Stock: {{ productoEncontrado.stock }}
          </div>
          <v-btn
            size="small"
            :disabled="productoEncontrado.stock === 0"
            @click="agregarProductoCarrito(productoEncontrado.id)"
          >
            Agregar al carrito
          </v-btn>
        </v-alert>
      </v-col>

      <!-- Lista completa de productos -->
      <v-col cols="12" md="7">
        <v-card variant="flat" class="mb-4">
          <v-card-title class="text-subtitle-1 font-weight-bold">Lista completa de productos</v-card-title>
          <v-divider />
          <v-list density="comfortable">
            <v-list-item
              v-for="p in products"
              :key="p.id"
            >
              <template #prepend>
                <v-avatar size="28" color="grey-lighten-3" />
              </template>

              <v-list-item-title class="font-weight-medium">
                {{ p.name }} — ${{ p.price }}
              </v-list-item-title>

              <v-list-item-subtitle>
                <v-chip
                  :color="p.stock === 0 ? 'warning' : 'success'"
                  size="small"
                  variant="flat"
                >
                  Stock: {{ p.stock }}
                </v-chip>
              </v-list-item-subtitle>

              <template #append>
                <v-btn
                  size="small"
                  :disabled="p.stock === 0"
                  @click="agregarProductoCarrito(p.id)"
                >
                  Agregar
                </v-btn>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <!-- Carrito -->
      <v-col cols="12" md="5">
        <v-card variant="flat">
          <v-card-title class="text-subtitle-1 font-weight-bold d-flex align-center justify-space-between">
            Carrito
            <v-chip v-if="carrito.length === 0" size="small" color="grey" variant="flat">Vacío</v-chip>
          </v-card-title>
          <v-divider />

          <v-list v-if="carrito.length > 0" density="compact">
            <v-list-item
              v-for="item in carrito"
              :key="item.id"
            >
              <v-list-item-title class="font-weight-medium">
                {{ item.name }} — ${{ item.price }} × {{ item.cant }}
              </v-list-item-title>
              <v-list-item-subtitle>
                Total: ${{ item.total }}
              </v-list-item-subtitle>

              <template #append>
                <div class="d-flex align-center ga-2">
                  <v-btn
                    icon
                    size="x-small"
                    variant="text"
                    @click="eliminarProductoCarrito(item.id)"
                    :aria-label="`Eliminar una unidad de ${item.name}`"
                  >
                    <v-icon>mdi-minus</v-icon>
                  </v-btn>
                </div>
              </template>
            </v-list-item>
          </v-list>

          <v-card-text v-else>
            <span class="text-medium-emphasis">Carrito vacío</span>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'

const producto = ref('')
const productoEncontrado = ref(null)
const productoNoEncontrado = ref(false)
const stockCero = ref(false)

const products = ref([
  { id: 1, name: 'Arroz',   price: 10, stock: 10 },
  { id: 2, name: 'Lechuga', price: 5,  stock: 15 },
  { id: 3, name: 'Avena',   price: 20, stock: 100 },
  { id: 4, name: 'Tomate',  price: 15, stock: 0 }
])

const carrito = ref([])

function buscarProducto() {
  const n = producto.value.trim()

  // reset básico
  productoEncontrado.value = null
  productoNoEncontrado.value = false
  stockCero.value = false

  if (!n) return

  const encontrado = products.value.find(
    p => p.name.toLowerCase() === n.toLowerCase()
  )

  if (!encontrado) {
    productoNoEncontrado.value = true
    return
  }

  productoEncontrado.value = encontrado
  stockCero.value = encontrado.stock === 0
}

function agregarProductoCarrito(id){
  const prod = products.value.find(p => p.id === id)
  if (!prod) return

  // sólo descuenta stock si hay
  if (prod.stock > 0) {
    prod.stock -= 1
  } else {
    // si no hay stock, no agregamos
    return
  }

  const item = carrito.value.find(p => p.id === id)
  if (item){
    item.cant += 1
    item.total = item.cant * item.price
  } else {
    const cant = 1
    carrito.value.push({
      id: prod.id,
      name: prod.name,
      price: prod.price,
      cant,
      total: cant * prod.price   
    })
  }

  // re-evaluar el estado del buscador
  buscarProducto()
}

function eliminarProductoCarrito(id){
  const item = carrito.value.find(p => p.id === id)
  if (!item) return

  // devolver stock al catálogo
  const prod = products.value.find(p => p.id === id)
  if (prod) {
    prod.stock += 1
  }

  // actualizar cantidades
  item.cant -= 1
  if (item.cant <= 0) {
    carrito.value = carrito.value.filter(p => p.id !== id)
  } else {
    item.total = item.cant * item.price
  }

  // re-evaluar estado del buscador si el encontrado era este
  if (productoEncontrado.value && productoEncontrado.value.id === id) {
    stockCero.value = prod ? prod.stock === 0 : false
  }
}
</script>
