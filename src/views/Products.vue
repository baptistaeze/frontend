<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '../services/api'
import { useRouter } from 'vue-router'
import AppHeader from '../components/AppHeader.vue'

const baseHost = 'http://127.0.0.1:8000/'

const imageUrl = (p) => {
  if(!p) return ''
  if(/^https?:\/\//.test(p)) return p
  if(p.startsWith('/')) return p
  if(p.startsWith('storage')) return baseHost + p
  return p
}

// Featured images provided by the user (kept for reference but not shown when API empty)
const featured = [
  { image: 'storage/img/6852bf8091266.png', name: 'Línea tradicional escolar', color: '#f06292' },
  { image: 'storage/img/6852bfb8b4587.png', name: 'Línea juvenil metalizada 1', color: '#f48fb1' },
  { image: 'storage/img/6852bfcb2d9cf.png', name: 'Línea juvenil metalizada 2', color: '#d97777' },
  { image: 'storage/img/6852dfef4ed68.png', name: 'Línea fraccionada cristal x 40grs', color: '#b39ddb' },
  { image: 'storage/img/6852bfdcc16da.png', name: 'Otra línea', color: '#ffd08a' }
]

const products = ref([])
const categories = ref([])
const showForm = ref(false)

const itemsToShow = computed(() => {
  if (categories.value && categories.value.length) return categories.value
  if (products.value && products.value.length) return products.value
  return []
})

const form = ref({
 name:'',
 description:'',
 category_id:'',
 image:null
})

const load = async()=>{
 const res = await api.get('/products')
 products.value = res.data.data
}

const loadCategories = async()=>{
 const res = await api.get('/categories')
 categories.value = res.data
}

onMounted(()=>{
 load()
 loadCategories()
})

const router = useRouter()
const isLoggedIn = computed(() => !!localStorage.getItem('token'))

const logout = () => {
  localStorage.removeItem('token')
  delete api.defaults.headers.common['Authorization']
  router.push('/login')
}

const goToCategory = (category) => {
  router.push(`/products/category/${category.id}`)
}

</script>

<template>
  <div class="products-page">
    <AppHeader :title="'Productos'"/>

    <header class="hero">
      <h1>Productos</h1>
    </header>

    <section class="grid">
      <template v-if="itemsToShow.length">
        <div
          v-for="(c,i) in itemsToShow"
          :key="i"
          class="card"
          :style="{background: c.color || '#ccc'}"
          @click="goToCategory(c)"
        >
          <img v-if="c.image" :src="imageUrl(c.image)">
          <h3>{{ c.name || c.title || 'Sin título' }}</h3>
          <span>Ver todos</span>
        </div>
      </template>
      <template v-else>
        <div class="empty-message">
          Aún no hay productos ni categorías registradas.
          <div v-if="isLoggedIn" style="margin-top:8px">Puedes ir al dashboard para agregar productos.</div>
        </div>
      </template>
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

.hero h1 {
  color:white;
  font-size:72px;
  font-weight:700;
  z-index:2;
  text-shadow:0 10px 30px rgba(0,0,0,0.30);
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

.nav .active {
  color:black;
  font-weight:600;
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

.grid {
  padding:80px 60px 120px;
  display:grid;
  grid-template-columns:repeat(4,1fr);
  gap:30px;
}

.nav-actions{ margin-left:auto }

.dash-btn{ background:transparent; border:2px solid #f7941d; color:#f7941d; padding:8px 14px; border-radius:24px; margin-right:10px; cursor:pointer; font-weight:600 }

.card {
  height:230px;
  border-radius:20px;
  color:white;
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  text-align:center;
  cursor:pointer;
  transition:transform .18s ease, box-shadow .18s ease;
}

.card:hover{ transform:translateY(-6px); box-shadow:0 22px 40px rgba(0,0,0,0.12); }

.card img {
  height:80px;
  margin-bottom:10px;
}

.card h3 {
  font-weight:500;
}

.card span {
  margin-top:10px;
  font-size:14px;
}

.empty-message{
  padding:60px;
  grid-column:1/-1;
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
  .grid, .products-grid {
    grid-template-columns: 1fr !important;
    gap: 14px !important;
    padding: 24px 8px 40px !important;
  }
  .card, .product-card {
    min-height: 140px !important;
    height: auto !important;
    padding: 12px 6px !important;
    border-radius: 14px !important;
  }
  .card img, .product-img {
    height: 48px !important;
    margin-bottom: 6px !important;
    width: 48px !important;
  }
  .card h3, .product-title {
    font-size: 15px !important;
  }
  .product-desc {
    font-size: 12px !important;
    min-height: 10px !important;
  }
}
</style>
