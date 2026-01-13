<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api'
import { useRouter } from 'vue-router'
import ProductGrid from '../components/ProductGrid.vue'
import AppHeader from '../components/AppHeader.vue'
const router = useRouter()

const baseHost = 'http://localhost:8000/'

const imageUrl = (p) => {
    if (!p) return ''
    if (/^https?:\/\//.test(p)) return p
    if (p.startsWith('/')) return p
    if (p.startsWith('storage/')) return baseHost + p
    if (p.startsWith('products/')) return baseHost + 'storage/' + p
    return p
}

const products = ref([])
const categories = ref([])
const showForm = ref(false)
const loading = ref(false)
const error = ref('')
const showConfirm = ref(false)
const productToDelete = ref(null)

const form = ref({
    name: '',
    description: '',
    category_id: '',
    image: null,
    id: null
})

const load = async () => {
    try {
        const res = await api.get('/products')
        products.value = res.data.data
    } catch (e) {
        showError(e)
    }
}

const loadCategories = async () => {
    try {
        const res = await api.get('/categories')
        categories.value = res.data
    } catch (e) {
        showError(e)
    }
}

onMounted(()=>{
    const token = localStorage.getItem('token')
    if(!token) router.push('/login')
    load()
    loadCategories()
})

const openForm = () => {
    showForm.value = true
    form.value = { name:'', description:'', category_id:'', image:null, id:null }
}

const setImage = e => {
    form.value.image = e.target.files[0]
}

const save = async () => {
    loading.value = true
    try {
        const fd = new FormData()
        for(const k in form.value){

            if(k === 'image' && !form.value.image) continue
            fd.append(k, form.value[k])
        }
        if(form.value.id){
            await api.post('/products/'+form.value.id+'?_method=PUT', fd)
        } else {
            await api.post('/products', fd)
        }
        showForm.value = false
        await load()
    } catch (e) {
        showError(e)
    } finally {
        loading.value = false
    }
}

const edit = p => {
    showForm.value = true
    form.value = { ...p, image: null }
}

const askRemove = (id) => {
    productToDelete.value = id
    showConfirm.value = true
}

const remove = async () => {
    try {
        await api.delete('/products/' + productToDelete.value)
        showConfirm.value = false
        productToDelete.value = null
        await load()
    } catch (e) {
        showError(e)
        showConfirm.value = false
        productToDelete.value = null
    }
}

const showError = (e) => {
    error.value = (e.response && e.response.data && e.response.data.message) || e.message || 'Error inesperado'
    setTimeout(() => { error.value = '' }, 6000)
}

const logout = () => {
    localStorage.removeItem('token')
    delete api.defaults.headers.common['Authorization']
    router.push('/login')
}
</script>

<template>
    <div class="admin-page">
	<AppHeader :title="'Productos'" :showActions="true" />

        <section class="admin-section">
            <div class="toolbar">
                <h2>Productos</h2>
                <button @click="openForm" class="add-btn">Agregar producto</button>
            </div>

            <div class="products-grid">
                <ProductGrid :products="products" :admin="true" @edit="edit" @delete="askRemove" />
            </div>

            <div v-if="showForm" class="modal-backdrop">
                <div class="modal">
                    <h3>{{ form.id ? 'Editar' : 'Nuevo' }} producto</h3>
                    <div class="modal-body">
                        <input placeholder="Nombre" v-model="form.name" class="form-control" />
                        <textarea placeholder="Descripción" v-model="form.description" class="form-control"></textarea>
                        <select v-model="form.category_id" class="form-control">
                            <option value="">Seleccionar categoría</option>
                            <option v-for="c in categories" :value="c.id" :key="c.id">{{ c.name }}</option>
                        </select>
                        <input type="file" @change="setImage" />
                        <div class="modal-actions">
                            <button @click="save" :disabled="loading" class="save-btn">Guardar</button>
                            <button @click="showForm=false">Cancelar</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Modal de confirmación de eliminación -->
            <div v-if="showConfirm" class="modal-backdrop">
                <div class="modal confirm-modal">
                    <h3>¿Eliminar producto?</h3>
                    <p>Esta acción no se puede deshacer.</p>
                    <div class="modal-actions">
                        <button @click="remove" class="save-btn">Sí, eliminar</button>
                        <button @click="showConfirm=false;productToDelete=null">Cancelar</button>
                    </div>
                </div>
            </div>

            <!-- Alert pop-up de error -->
            <div v-if="error" class="alert-popup" @click="error=''">
                {{ error }}
            </div>
        </section>
    </div>
</template>

<style scoped>
.hero { background: url('https://www.nikitos.com.ar/storage/img/6854436b0d4ae.png') center/cover no-repeat; height:420px; position:relative; display:flex; align-items:center; justify-content:center }
.nav { position:absolute; top:24px; left:50%; transform:translateX(-50%); width:1150px; max-width:calc(100% - 48px); background:white; border-radius:40px; padding:14px 42px; display:flex; align-items:center; gap:28px; box-shadow:0 18px 40px rgba(0,0,0,0.10); z-index:4 }
.logo { height:56px }
.login-btn{ background:#f7941d; border:none; color:white; padding:10px 18px; border-radius:24px; display:flex;align-items:center;gap:8px;font-weight:600; cursor:pointer }
.hero::before{ content:''; position:absolute; left:0;right:0;top:0;bottom:0; background:linear-gradient(rgba(0,0,0,0.22), rgba(0,0,0,0.18)); z-index:1; pointer-events:none }

/* Admin section styles (moved from inline) */
.admin-section{ padding:40px }
.toolbar{ display:flex; justify-content:space-between; align-items:center; margin-bottom:20px }
.add-btn{ background:#f7941d; color:white; border:none; padding:10px 14px; border-radius:8px }

.products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 22px;
}
.product-card {
    background: #fff;
    padding: 18px 18px 16px 18px;
    border-radius: 18px;
    box-shadow: 0 6px 18px rgba(0,0,0,.07);
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 320px;
    position: relative;
}
.product-img {
    height: 90px;
    width: 90px;
    object-fit: cover;
    border-radius: 12px;
    margin-bottom: 12px;
    background: #f6f6f6;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}
.product-info {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
}
.product-title {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 4px;
    color: #222;
}
.product-category {
    font-size: 13px;
    color: #f7941d;
    margin-bottom: 6px;
}
.product-desc {
    font-size: 14px;
    color: #666;
    margin-bottom: 12px;
    min-height: 32px;
}
.product-actions-row {
    display: flex;
    gap: 10px;
    justify-content: center;
    margin-top: auto;
}
.edit-btn {
    background: #f7941d;
    color: #fff;
    border: none;
    padding: 8px 14px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: background .15s;
}
.edit-btn:hover {
    background: #e67c13;
}
.delete-btn {
    background: #fff;
    color: #c00;
    border: 1.5px solid #c00;
    padding: 8px 14px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: background .15s, color .15s;
}
.delete-btn:hover {
    background: #c00;
    color: #fff;
}
@media (max-width: 700px) {
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

/* Modal/form */
.modal-backdrop{
    position:fixed; left:0; right:0; top:0; bottom:0;
    background:rgba(0,0,0,.65);
    display:flex; align-items:center; justify-content:center;
    z-index:1000;
    padding:16px;
}
.modal{
    background:#fff;
    padding:20px;
    border-radius:18px;
    width:100%;
    max-width:420px;
    z-index:1001;
    box-shadow:0 8px 40px rgba(0,0,0,0.18);
    box-sizing:border-box;
}
.confirm-modal h3 { color: #c00; margin-bottom: 8px; }
.confirm-modal p { color: #444; margin-bottom: 18px; font-size: 15px; }
/* Panel title styles */
.panel-title {
    color: #fff;
    font-size: 48px;
    font-weight: 700;
    text-align: center;
    z-index: 2;
    text-shadow: 0 10px 30px rgba(0,0,0,0.40), 0 2px 8px rgba(0,0,0,0.18);
    margin-top: 60px;
}
.modal-body{ margin-top:10px; }
.form-control{
    width:100%;
    padding:10px 12px;
    margin-bottom:12px;
    border-radius:12px;
    border:1px solid #e6e6e6;
    font-size:16px;
    box-sizing:border-box;
}
@media (max-width: 600px) {
    .modal {
        max-width: 98vw;
        padding: 12px;
        border-radius: 12px;
    }
    .modal-body {
        margin-top: 4px;
    }
    .form-control {
        font-size:15px;
        padding:9px 8px;
        border-radius:10px;
    }
    .modal-actions {
        flex-direction:column;
        gap:6px;
    }
}
.modal-actions{ display:flex; gap:8px; margin-top:12px }
.save-btn{ background:#f7941d; color:#fff; padding:8px 12px; border-radius:8px }
.alert-popup {
    position: fixed;
    top: 32px;
    left: 50%;
    transform: translateX(-50%);
    background: #c00;
    color: #fff;
    padding: 14px 32px;
    border-radius: 12px;
    font-size: 17px;
    box-shadow: 0 4px 24px rgba(0,0,0,0.18);
    z-index: 2000;
    cursor: pointer;
    animation: fadein .3s;
}
@keyframes fadein {
    from { opacity: 0; transform: translateX(-50%) translateY(-20px);}
    to { opacity: 1; transform: translateX(-50%) translateY(0);}
}
</style>