<template>
  <v-app>
    <v-app-bar flat density="comfortable">
     <template v-if="!isLogged">
      <v-btn variant="text" :to="{ name: 'home' }">Inicio</v-btn>
      <v-btn variant="text" :to="{ name: 'productos' }">Productos</v-btn>
      <v-btn variant="text" :to="{ name: 'registro' }">Registro</v-btn>
      <v-btn variant="text" :to="{ name: 'login' }">Login</v-btn>
    </template>

    <template v-else>
      <v-chip variant="flat">{{ auth.state.user.email }}</v-chip>
      <v-btn variant="text" :to="{ name: 'home' }">Inicio</v-btn>
      <v-btn variant="text" :to="{ name: 'productos' }">Productos</v-btn>
      <v-btn variant="text" :to="{ name: 'carrito' }">Carrito</v-btn>
      <v-btn variant="text" @click="logout">Salir</v-btn>
    </template>
    </v-app-bar>

    <v-main>
      <v-container class="py-6" max-width="1100">
        <RouterView v-slot="{ Component }">
          <component
          :is="Component"
          :productos="productos"
          :carrito="carrito"
          :total-carrito="totalCarrito"
          @add-to-cart="agregarPorId"
          @remove-from-cart="eliminarPorId"
          @inc-qty="incrementarCantidad"
          @dec-qty="decrementarCantidad"
          @clear-cart="clearCart"
          />
        </RouterView>
      </v-container>
    </v-main>
  </v-app>
</template>


<script setup>
import { ref, computed } from 'vue'
import { auth } from '@/auth/session'
import { useRouter } from 'vue-router' 

const router = useRouter()
const isLogged = computed(() => !!auth.state.user)

function logout() {
  auth.logout()
  router.push({ name: 'login' })
}

const productos = ref([
  { id: 1, nombre: 'Arroz',   precio: 10, stock: 10, descripcion: 'Arroz premium' },
  { id: 2, nombre: 'Lechuga', precio: 5,  stock: 15, descripcion: 'Fresca' },
  { id: 3, nombre: 'Avena',   precio: 20, stock: 100, descripcion: 'Integral' },
  { id: 4, nombre: 'Tomate',  precio: 15, stock: 0,  descripcion: 'Sin stock por ahora' },
])

const carrito = ref([])

const totalCarrito = computed(() =>
  carrito.value.reduce((acc, i) => acc + i.cantidad * i.precio, 0)
)

function agregarPorId(id){
  const p = productos.value.find(x => x.id === id)
  if (!p || p.stock <= 0) return
  const item = carrito.value.find(i => i.id === id)
  if (item) {
    if (item.cantidad < p.stock) item.cantidad++
    return
  }
  carrito.value.push({ id: p.id, nombre: p.nombre, precio: p.precio, cantidad: 1 }) 
}

function eliminarPorId(id){
  const idx = carrito.value.findIndex(i => i.id === id)
  if (idx !== -1) carrito.value.splice(idx, 1)
}

function incrementarCantidad(id) {
  const item = carrito.value.find(i => i.id === id)
  const prod = productos.value.find(p => p.id === id)
  if (!item || !prod) return
  if (item.cantidad < prod.stock) item.cantidad++
}

function decrementarCantidad(id) {
  const idx = carrito.value.findIndex(i => i.id === id)
  if (idx === -1) return
  if (carrito.value[idx].cantidad > 1) carrito.value[idx].cantidad--
  else carrito.value.splice(idx, 1)
}

function clearCart() {
  carrito.value = []
}


</script>
