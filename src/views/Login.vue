<script setup>
import { ref } from 'vue'
import api from '../services/api'
import { useRouter } from 'vue-router'

const router = useRouter()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const login = async () => {
  error.value = ''
  loading.value = true
  try {
    const res = await api.post('/login', { email: email.value, password: password.value })
    const token = res.data.token
    localStorage.setItem('token', token)
    api.defaults.headers.common['Authorization'] = 'Bearer ' + token
    router.push('/dashboard')
  } catch (e) {
    error.value = (e.response && e.response.data && e.response.data.message) || 'Credenciales inválidas'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-card">
      <h2>Ingresar</h2>
      <div class="field">
        <label>Email</label>
        <input type="email" v-model="email" placeholder="tucorreo@ejemplo.com" />
      </div>
      <div class="field">
        <label>Contraseña</label>
        <input type="password" v-model="password" placeholder="********" />
      </div>
      <div class="actions">
        <button @click="login" :disabled="loading">{{ loading ? 'Ingresando...' : 'Ingresar' }}</button>
      </div>
      <p class="error" v-if="error">{{ error }}</p>
    </div>
  </div>
</template>

<style scoped>
.login-page{display:flex;align-items:center;justify-content:center;height:70vh}
.login-card{width:360px;padding:28px;border-radius:12px;box-shadow:0 6px 24px rgba(0,0,0,.12);background:#fff}
.login-card h2{text-align:center;margin-bottom:18px}
.field{margin-bottom:12px}
.field label{display:block;color:#666;margin-bottom:6px;font-size:14px}
.field input{width:100%;padding:10px;border-radius:8px;border:1px solid #e6e6e6}
.actions{display:flex;justify-content:center;margin-top:10px}
.actions button{background:#f7941d;border:none;color:#fff;padding:10px 18px;border-radius:20px;cursor:pointer}
.actions button:disabled{opacity:.7;cursor:default}
.error{color:#c00;text-align:center;margin-top:10px}
</style>
