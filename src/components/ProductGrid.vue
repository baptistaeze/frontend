<script setup>
defineProps({
  products: { type: Array, required: true },
  admin: { type: Boolean, default: false }
})
const emit = defineEmits(['edit', 'delete'])
const imageUrl = (p) => {
  if (!p) return ''
  if (/^https?:\/\//.test(p)) return p
  if (p.startsWith('/')) return p
  if (p.startsWith('storage/')) return 'http://localhost:8000/' + p
  if (p.startsWith('products/')) return 'http://localhost:8000/storage/' + p
  return p
}
</script>

<template>
  <div class="products-grid">
    <div v-for="p in products" :key="p.id" class="product-card">
      <img v-if="p.image" :src="imageUrl(p.image)" class="product-img" />
      <div class="product-info">
        <div class="product-title">{{ p.name }}</div>
        <div class="product-category" v-if="p.category">{{ p.category.name }}</div>
        <div class="product-desc">{{ p.description }}</div>
        <div v-if="admin" class="product-actions-row">
          <button @click="$emit('edit', p)" class="edit-btn">Actualizar</button>
          <button @click="$emit('delete', p.id)" class="delete-btn">Eliminar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
</style>