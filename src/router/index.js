import { createRouter, createWebHistory } from 'vue-router'

// (1) Vistas (pages)
import Home from '@/pages/Home.vue'
import ListadoProductos from '@/pages/ListadoProductosVue.vue'
import Registro from '@/pages/Registro.vue'

// (2) Definición de rutas
const routes = [
  { path: '/', name:'home', component: Home},
  { path: '/productos', name: 'productos',component: ListadoProductos },
  { path: '/registro', name: 'registro', component: Registro },
]

// (3) Crear y exportar el router
const router = createRouter({
  history: createWebHistory(),   
  routes,
  scrollBehavior() { return { top: 0 } }, 
})

export default router


/* {
    path: '/productos/:id',
    name: 'producto',
    component: DetalleProducto,
    // Pasamos el param como prop (queda string, lo casteamos en el componente)
    props: true},
  // 404 catch-all
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound } */