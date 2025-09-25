import { createRouter, createWebHistory } from 'vue-router'
import { auth } from '@/auth/session'

// vistas
import Home from '@/pages/Home.vue'
import ListadoProductos from '@/pages/ListadoProductosVueConRouter.vue'
import Registro from '@/pages/Registro.vue'
import DetalleProducto from '@/pages/DetalleProducto.vue'
import Login from '@/pages/Login.vue'
import CarritoView from '@/pages/CarritoView.vue' 

//Definición de rutas
const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/login', name: 'login', component: Login },
  { path: '/registro', name: 'registro', component: Registro },



  { path: '/productos', name: 'productos', component: ListadoProductos, meta: { requiresAuth: true } },
  //claro yo aca defino un parametro dinamico :id, producto sera el nombre que usas en el router link y props true 
  //hace que el id este disponible como prop en el componente DetalleProducto. alli lo levanto desde el prop.
  { path: '/productos/:id', name: 'producto', component: DetalleProducto, props: true, meta: { requiresAuth: true } },
  { path: '/carrito', name: 'carrito', component: CarritoView, meta: { requiresAuth: true } },

  // 404
  { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('@/pages/NotFound.vue') },
]

// Crear y exportar el router
const router = createRouter({
  history: createWebHistory(),   
  routes, //estas son mis rutas definidas arriba
  scrollBehavior() { return { top: 0 } }, 
})

// Se ejecuta antes de cada cambio de ruta.
// TO es la ruta a la que vamos
// FROM es la ruta desde la que venimos
// NEXT es una función que debemos llamar para continuar la navegación

router.beforeEach((to, from, next) => {

  // si no hay un usuario cargado, intentar cargarlo desde el local storage.
  if (!auth.state.user) auth.load()

  // esto basicamente dice si la ruta destino (to) tiene meta.requiresAuth: true
  // y no estamos logueados, redirige a la pagina del login.
  if (to.meta.requiresAuth && !auth.isAuthenticated.value) {
    return next({ name: 'login'})
  }

/*   // Si ya estás logueado, bloquear login/registro (opcional)
  if ((to.name === 'login' || to.name === 'registro') && auth.isAuthenticated.value) {
    return next({ name: 'home' })
  } */

  next()
})
export default router

