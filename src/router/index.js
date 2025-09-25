import { createRouter, createWebHistory } from 'vue-router'
import { auth } from '@/auth/session'

// (1) Vistas (pages)
import Home from '@/pages/Home.vue'
import ListadoProductos from '@/pages/ListadoProductosVueConRouter.vue'
import Registro from '@/pages/Registro.vue'
import DetalleProducto from '@/pages/DetalleProducto.vue'
import Login from '@/pages/Login.vue'
import CarritoView from '@/pages/CarritoView.vue' 

// (2) Definición de rutas
const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/login', name: 'login', component: Login },
  { path: '/registro', name: 'registro', component: Registro },



  { path: '/productos', name: 'productos', component: ListadoProductos, meta: { requiresAuth: true } },
  { path: '/productos/:id', name: 'producto', component: DetalleProducto, props: true, meta: { requiresAuth: true } },
  { path: '/carrito', name: 'carrito', component: CarritoView, meta: { requiresAuth: true } },

  // 404
  { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('@/pages/NotFound.vue') },
]

// (3) Crear y exportar el router
const router = createRouter({
  history: createWebHistory(),   
  routes,
  scrollBehavior() { return { top: 0 } }, 
})
// Guardia global
router.beforeEach((to, from, next) => {
  // restaurar sesión desde localStorage (solo una vez)
  if (!auth.state.user) auth.load()

  // Ruta privada y no autenticado -> a /login con redirect
  if (to.meta.requiresAuth && !auth.isAuthenticated.value) {
    return next({ name: 'login', query: { redirect: to.fullPath } })
  }

  // Si ya estás logueado, bloquear login/registro (opcional)
  if ((to.name === 'login' || to.name === 'registro') && auth.isAuthenticated.value) {
    return next({ name: 'home' })
  }

  next()
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