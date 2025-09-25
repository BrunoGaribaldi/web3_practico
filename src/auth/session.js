// src/auth/session.js
import { reactive, computed } from 'vue'

const state = reactive({
  user: null,      // { email }
  error: null,
})

//restaurar sesion desde el local storage.
// si en local storage hay una clave session, entonces la parseamos y la asignamos a state.user
// si no hay nada, state.user queda en null
// si hay un error al parsear, state.user queda en null 
function load() {
  try {
    const raw = localStorage.getItem('session')
    state.user = raw ? JSON.parse(raw) : null
  } catch {
    state.user = null
  }
}

async function login({ email, password }) {
  state.error = null

  // Credenciales de prueba
  const VALID_EMAIL = 'test@demo.com'
  const VALID_PASS  = '123456'

  if (email === VALID_EMAIL && password === VALID_PASS) {
    state.user = { email }
    localStorage.setItem('session', JSON.stringify(state.user))
  } else {
    state.error = 'Credenciales inválidas'
    throw new Error('INVALID_CREDENTIALS')
  }
}

function logout() {
  state.user = null
  state.error = null
  localStorage.removeItem('session')
}

//valor reactivo que tira true si state.user no es null (esta logueado un usuario)
const isAuthenticated = computed(() => !!state.user)

export const auth = { state, isAuthenticated, load, login, logout }
