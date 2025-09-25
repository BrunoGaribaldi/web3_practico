<template>
  <v-container class="d-flex align-center justify-center" style="min-height: calc(100vh - 64px);">
    <v-card rounded="xl" elevation="3" max-width="400" class="w-100 pa-6">
      <h1 class="text-h5 font-weight-bold mb-4">Registro</h1>

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
          :rules="[rules.required, rules.min6]"
          prepend-inner-icon="mdi-lock"
          density="comfortable"
        />

        <v-btn
          block
          type="submit"
          :disabled="!isValid"
        >
          Registrarse
        </v-btn>
      </v-form>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')
const password = ref('')
const isValid = ref(false)

const rules = {
  required: v => !!v || 'Campo requerido',
  email: v => /.+@.+\..+/.test(v) || 'Formato inválido',
  min6: v => (v && v.length >= 6) || 'Mínimo 6 caracteres'
}

function onSubmit() {
  //tiro una alerta nomas y redirijo al login
  alert(`Registrado: ${email.value}`)
  router.push({ name: 'login' })
}
</script>
