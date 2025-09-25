// src/auth/session.js
import { reactive, computed } from 'vue'

const state = reactive({
  user: null,      // { email }
  loading: false,
  error: null,
})

function load() {
  try {
    const raw = localStorage.getItem('session')
    state.user = raw ? JSON.parse(raw) : null
  } catch {
    state.user = null
  }
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

async function login({ email, password }) {
  state.loading = true
  state.error = null
  await sleep(700)

  // Credenciales de prueba
  const VALID_EMAIL = 'test@demo.com'
  const VALID_PASS  = '123456'

  if (email === VALID_EMAIL && password === VALID_PASS) {
    state.user = { email }
    localStorage.setItem('session', JSON.stringify(state.user))
  } else {
    state.error = 'Credenciales inválidas'
    state.loading = false
    throw new Error('INVALID_CREDENTIALS')
  }

  state.loading = false
}

function logout() {
  state.user = null
  state.error = null
  localStorage.removeItem('session')
}

const isAuthenticated = computed(() => !!state.user)

export const auth = { state, isAuthenticated, load, login, logout }
