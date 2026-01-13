<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api'
import { useRoute, useRouter } from 'vue-router'
import ProductGrid from '../components/ProductGrid.vue'
import AppHeader from '../components/AppHeader.vue'

const route = useRoute()
const router = useRouter()
const products = ref([])
const loading = ref(false)
const categoryName = ref('')

const load = async () => {
  loading.value = true
  try {
    const res = await api.get(`/products/category/${route.params.id}`)
    products.value = res.data.data || res.data
    if (products.value.length && products.value[0].category) {
      categoryName.value = products.value[0].category.name
    }
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>

<template>
  <div class="products-page">
  <AppHeader :title="'Productos'" :showBack="true" backTo="/products" />
     <header class="hero">
      <h1 class="text-white">{{ categoryName || 'Productos por categoría' }}</h1>
    </header>
    <section class="category-section">
      <ProductGrid :products="products" :admin="false" />
      <div v-if="!loading && products.length === 0" class="empty-message">
        No hay productos en esta categoría.
      </div>
    </section>
  </div>
</template>

<style scoped>
.products-page {
  font-family: 'Poppins', sans-serif;
}

.hero {
  background: url('https://www.nikitos.com.ar/storage/img/6854436b0d4ae.png') center/cover no-repeat;
  height:420px;
  position:relative;
  display:flex;
  align-items:center;
  justify-content:center;
}

.hero .category-title {
  color:white;
  font-size:48px;
  font-weight:700;
  z-index:2;
  text-shadow:0 10px 30px rgba(0,0,0,0.30);
  margin-top: 60px;
  text-align: center;
  width: 100%;
}

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

.nav-actions {
  margin-left:auto;
}

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

.hero::before{
  content:'';
  position:absolute;
  left:0;right:0;top:0;bottom:0;
  background:linear-gradient(rgba(0,0,0,0.22), rgba(0,0,0,0.18));
  z-index:1;
  pointer-events:none;
}

.category-section {
  padding:80px 60px 120px;
}

.empty-message{
  padding:60px;
  text-align:center;
  color:#666;
  font-size:18px;
}

@media (max-width: 700px) {
  .hero {
    height: 180px !important;
    padding: 0 0 0 0;
  }
  .hero h1, .hero .category-title, .panel-title {
    font-size: 28px !important;
    margin-top: 20px !important;
    padding: 0 10px;
    text-align: center;
  }
}
</style>