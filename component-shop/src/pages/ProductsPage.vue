<template>
  <Panel>
    <template #header>
      <span class="header-title">🛍️ รายการเตือนกินยาประจำวัน</span>
    </template>

    <!-- 1) สถานะกำลังโหลด -->
    <p v-if="loading" role="status" class="status-msg">⏳ กำลังโหลดข้อมูลยา...</p>

    <!-- 2) สถานะโหลดพลาด -->
    <div v-else-if="errorMsg" role="alert" class="error-box">
      <p class="status-msg">{{ errorMsg }}</p>
      <button @click="loadProducts" class="btn-retry">ลองใหม่</button>
    </div>

    <!-- 3) โหลดสำเร็จ: วนแสดงการ์ดยา -->
    <div v-else class="card-list">
      <MedsCard
        v-for="item in medsList"
        :key="item.id"
        :id="item.id"
        :title="item.title"
        :time="item.time"
        :dosage="item.dosage"
        :price="item.price"
        :image="item.image"
        :desc="item.desc"
        @take-med="handleTakeMed"
        @toggle-important="handleToggleImportant"
      />
    </div>

    <template #footer>
      <div class="footer-box">
        <p aria-live="polite" class="summary-text">
          💊 บันทึกการกินยา: {{ takenCount }} ครั้ง · คะแนนสะสม {{ totalPrice }} คะแนน
        </p>
        <p role="status" aria-live="polite" class="notice-text">
          {{ notice }}
        </p>
        <router-link to="/cart" class="btn-cart-link">
          ไปที่หน้ารายงานสรุปการกินยา →
        </router-link>
      </div>
    </template>
  </Panel>
</template>

<script setup>
import Panel from '../components/Panel.vue';
import MedsCard from '../components/MedsCard.vue';
import {
  medsList,
  takenCount,
  totalPrice,
  notice,
  handleTakeMed,
  handleToggleImportant,
  loading,
  errorMsg,
  loadProducts
} from '../store.js';
</script>

<style scoped>
.header-title {
  font-size: 1.4em; /* 🟢 ปรับหัวข้อหน้าให้ใหญ่ขึ้น */
  font-weight: bold;
}

.status-msg {
  font-size: 1.1em;
  text-align: center;
  padding: 12px;
}

.error-box {
  text-align: center;
  padding: 12px;
}

.btn-retry {
  padding: 8px 16px;
  font-size: 1em;
  background-color: #EF4444;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.card-list {
  display: flex;
  flex-direction: column;
  gap: 16px; /* 🟢 เพิ่มระยะห่างระหว่างการ์ดยา */
  margin-bottom: 16px;
}

.footer-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  text-align: center;
  padding: 8px 0;
}

.summary-text {
  font-size: 1.15em; /* 🟢 ตัวหนังสือสรุปใหญ่ขึ้น ชัดเจน */
  font-weight: 600;
  color: #1F2937;
  margin: 0;
}

.notice-text {
  color: #059669;
  font-weight: bold;
  font-size: 1.1em;
  margin: 0;
}

.btn-cart-link {
  display: inline-block;
  margin-top: 8px;
  padding: 10px 18px; /* 🟢 ทำเป็นปุ่มลิงก์ใหญ่ขึ้น กดง่าย */
  background-color: #EFF6FF;
  color: #2563EB;
  font-size: 1.05em;
  font-weight: bold;
  border-radius: 10px;
  text-decoration: none;
  transition: all 0.2s;
}

.btn-cart-link:hover {
  background-color: #DBEAFE;
  text-decoration: underline;
}
</style>