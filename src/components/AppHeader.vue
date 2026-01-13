<script setup>
import { useRouter } from 'vue-router'
const props = defineProps({
  showBack: { type: Boolean, default: false },
  backTo: { type: String, default: '/products' },
  title: { type: String, default: 'Productos' },
  showActions: { type: Boolean, default: true }
})
const router = useRouter()
const isLoggedIn = !!localStorage.getItem('token')

const goBack = () => router.push(props.backTo)
const goLogin = () => router.push('/login')
const goDashboard = () => router.push('/dashboard')
const logout = () => {
  localStorage.removeItem('token')
  delete window.axios?.defaults.headers.common['Authorization']
  router.push('/login')
}
const goProducts = () => router.push('/products')
</script>

<template>
  <div class="nav" @click="goProducts" style="cursor:pointer;">
    <img src="https://www.nikitos.com.ar/logo-nikitos.png" class="logo" />
    <div class="nav-title">{{ title }}</div>
    <div class="nav-actions" @click.stop>
      <button v-if="showBack" class="login-btn" @click="goBack">← Volver</button>
      <template v-if="showActions">
        <template v-if="isLoggedIn">
          <button class="dash-btn" @click="goDashboard">👋 Ir al dashboard</button>
          <button class="login-btn" @click="logout">👋 Salir</button>
        </template>
        <template v-else>
          <button class="login-btn" @click="goLogin">👋 Ingresar</button>
        </template>
      </template>
    </div>
  </div>
</template>

<style scoped>
.nav {
  position:absolute;
  top:24px;
  left:50%;
  transform:translateX(-50%);
  width:1150px;
  max-width:calc(100% - 48px);
  background:white;
  border-radius:40px;
  padding:14px 42px;
  display:flex;
  align-items:center;
  gap:28px;
  box-shadow:0 18px 40px rgba(0,0,0,0.10);
  z-index:4;
}
.logo { height:56px }
.nav-title {
  margin-left:24px;
  font-size:18px;
  color:#444;
  font-weight:600;
  letter-spacing:1px;
}
.nav-actions{ margin-left:auto; display:flex; gap:10px; }
.login-btn {
  background:#f7941d;
  border:none;
  color:white;
  padding:10px 18px;
  border-radius:24px;
  display:flex;
  align-items:center;
  gap:8px;
  font-weight:600;
  cursor:pointer;
}
.dash-btn{ background:transparent; border:2px solid #f7941d; color:#f7941d; padding:8px 14px; border-radius:24px; cursor:pointer; font-weight:600 }

@media (max-width: 700px) {
  .nav {
    flex-direction: column;
    align-items: flex-start;
    padding: 10px 10px;
    width: 98vw;
    min-width: 0;
    max-width: 100vw;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 18px;
    gap: 10px;
  }
  .logo {
    height: 40px;
  }
  .nav-title {
    margin-left: 0;
    font-size: 16px;
    margin-top: 6px;
  }
  .nav-actions {
    margin-left: 0;
    width: 100%;
    justify-content: flex-end;
    gap: 6px;
  }
  .login-btn, .dash-btn {
    font-size: 14px;
    padding: 8px 10px;
    border-radius: 18px;
  }
}
</style>