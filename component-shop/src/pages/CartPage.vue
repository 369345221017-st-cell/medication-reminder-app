<template>
  <Panel>
    <template #header>
      📋 รายการบันทึกการกินยาของคุณ
    </template>

    <p v-if="takenCount === 0" class="empty-text">
      ยังไม่มีรายการบันทึกการกินยาในวันนี้
    </p>

    <ul v-else class="med-list">
      <li v-for="(item, index) in takenMedsList" :key="index" class="med-item">
        <span>💊 {{ item.title }} ({{ item.time }} น.)</span>
        <strong>{{ item.price }} คะแนน</strong>
      </li>
    </ul>

    <template #footer>
      <div class="cart-footer">
        <div class="summary-line">
          คะแนนสะสม: {{ totalPrice }} คะแนน · โบนัส: {{ shippingFee }} คะแนน
        </div>
        <div class="net-total">
          <strong>คะแนนสุขภาพสุทธิ: {{ netTotal }} คะแนน</strong>
        </div>

        <div class="progress-box">
          <label for="ship-progress">ความคืบหน้าเป้าหมายสุขภาพ {{ progress }}%</label>
          <progress id="ship-progress" :value="progress" max="100">{{ progress }}%</progress>
        </div>

        <p v-if="remaining > 0" class="remaining-text">
          สะสมอีก {{ remaining }} คะแนน จะได้รับโบนัสสุขภาพดีเยี่ยม!
        </p>

        <!-- 📌 บรรทัดนี้คือกล่องแสดงข้อความแจ้งเตือนเมื่อคะแนนถึงเป้าหมาย -->
        <p v-if="notice" class="notice-alert">
          {{ notice }}
        </p>

        <div class="button-group">
          <button @click="router.push('/products')" class="btn-continue">
            ← กลับไปหน้ารายการเตือนกินยา
          </button>
          <button @click="clearCart" class="btn-clear">
            ล้างรายการกินยา
          </button>
        </div>
      </div>
    </template>
  </Panel>
</template>

<script setup>
import { useRouter } from 'vue-router';
import Panel from '../components/Panel.vue';
import {
  takenMedsList,
  takenCount,
  totalPrice,
  shippingFee,
  netTotal,
  progress,
  remaining,
  notice, // 👈 เพิ่ม notice ตรงนี้ด้วยครับ
  clearCart
} from '../store.js';

const router = useRouter();
</script>

<style scoped>
/* ... CSS เดิมของคุณ ... */

/* 📌 แต่งสีกล่องแจ้งเตือนเพิ่มเติม */
.notice-alert {
  background-color: #D1FAE5;
  color: #065F46;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: bold;
  font-size: 0.9em;
  margin: 6px 0;
  border: 1px solid #10B981;
}
</style>