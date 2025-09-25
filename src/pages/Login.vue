<template>
  <v-container class="d-flex align-center justify-center" style="min-height: calc(100vh - 64px);">
    <v-card rounded="xl" elevation="3" max-width="400" class="w-100 pa-6">
      <h1 class="text-h5 font-weight-bold mb-4">Login</h1>

      <v-form v-model="isValid" @submit.prevent="onSubmit">
        <v-text-field
          v-model="email"
          label="Email"
          type="email"
          :rules="[rules.required, rules.email]"
          prepend-inner-icon="mdi-email"
          density="comfortable"
        />

        <v-text-field
          v-model="password"
          label="Contraseña"
          type="password"
          :rules="[rules.required]"
          prepend-inner-icon="mdi-lock"
          density="comfortable"
        />

        <v-alert
          v-if="auth.state.error"
          type="error"
          class="mb-4"
          density="comfortable"
          variant="tonal"
        >
          {{ auth.state.error }}
        </v-alert>

        <v-btn
          block
          type="submit"
          :disabled="!isValid || auth.state.loading"
          :loading="auth.state.loading"
        >
          Ingresar
        </v-btn>
      </v-form>

      <div class="text-caption text-medium-emphasis mt-4">
        Demo: <strong>test@demo.com</strong> / <strong>123456</strong>
      </div>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { auth } from '@/auth/session'

const router = useRouter()
const route = useRoute()

const email = ref('')
const password = ref('')
const isValid = ref(false)

const rules = {
  required: v => !!v || 'Campo requerido',
  email: v => /.+@.+\..+/.test(v) || 'Formato inválido'
}

async function onSubmit() {
  try {
    await auth.login({ email: email.value, password: password.value })
    const redirect = route.query.redirect || '/'
    router.replace(redirect)
  } catch (err) {
    // el error ya se guarda en auth.state.error
  }
}
</script>
