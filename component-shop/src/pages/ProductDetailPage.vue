<template>
  <div class="product-detail-page">
    <div v-if="product" class="detail-card">
      <img :src="product.image" :alt="product.title" class="detail-img" />
      
      <div class="detail-info">
        <span class="detail-time">⏰ {{ product.time }} น.</span>
        <h2>{{ product.title }}</h2>
        <p class="detail-dosage">💊 ขนาดรับประทาน: ครั้งละ {{ product.dosage || product.price }} เม็ด</p>
        <p class="detail-price">⭐ {{ product.price }} คะแนน</p>
        
        <p v-if="product.desc" class="detail-desc">{{ product.desc }}</p>

        <button @click="handleTakeMedConfirm" class="btn-take-main">
          บันทึกการกินยา
        </button>
      </div>
    </div>

    <div v-else class="not-found">
      <p>⏳ กำลังโหลดข้อมูล หรือ ไม่พบข้อมูลยานี้...</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { medsList, handleTakeMed } from '../store.js';

const route = useRoute();

// 🟢 ค้นหาตัวยาใน medsList ตาม ID บน URL
const product = computed(() => {
  return medsList.value.find(item => String(item.id) === String(route.params.id));
});

function handleTakeMedConfirm() {
  if (product.value) {
    const isConfirmed = confirm(
      `💊 ยืนยันการบันทึกกินยาใช่หรือไม่?\n\n` +
      `รายการ: "${product.value.title}"\n` +
      `เวลาเตือน: ${product.value.time} น.`
    );

    if (isConfirmed) {
      handleTakeMed(product.value);
    }
  }
}
</script>

<style scoped>
.product-detail-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.detail-card {
  display: flex;
  gap: 24px;
  background: #ffffff;
  padding: 24px;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.detail-img {
  width: 180px;
  height: 180px;
  object-fit: cover;
  border-radius: 12px;
}

.detail-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.detail-time {
  font-weight: bold;
  color: #1f2937;
  font-size: 1.1em;
}

.detail-info h2 {
  margin: 0;
  font-size: 1.6em;
  color: #111827;
}

.detail-dosage, .detail-price {
  margin: 0;
  font-size: 1.1em;
  color: #374151;
}

.detail-price {
  color: #059669;
  font-weight: 600;
}

.detail-desc {
  margin-top: 8px;
  color: #4b5563;
  line-height: 1.5;
}

.btn-take-main {
  margin-top: 16px;
  background-color: #2563eb;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 10px;
  font-weight: bold;
  font-size: 1.1em;
  cursor: pointer;
}

.not-found {
  text-align: center;
  padding: 40px;
  font-size: 1.2em;
  color: #6b7280;
}
</style>