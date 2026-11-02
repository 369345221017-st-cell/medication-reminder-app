<template>
  <div class="meds-card" :class="{ 'is-important': isImportant }">
    <div class="card-header">
      <span class="med-time">⏰ {{ props.time }} น.</span>
      <button 
        @click="toggleImportant" 
        class="btn-action" 
        :class="{ 'important': isImportant }"
      >
        {{ isImportant ? '★ สำคัญ' : '☆ ทั่วไป' }}
      </button>
    </div>

    <div class="card-body">
      <img :src="props.image" :alt="props.title" class="med-image" />
      <div class="med-info">
        <h3 class="med-title">{{ props.title }}</h3>
        <p class="med-dosage">💊 ครั้งละ {{ props.dosage || props.price }} เม็ด</p>
        <p class="med-price">⭐ {{ props.price }} คะแนน</p>

        <!-- 🟢 ใช้ @click สั่ง router.push โดยตรง บังคับเปลี่ยนหน้าทันที -->
        <button type="button" @click="goToDetail" class="detail-btn">
          ดูรายละเอียด →
        </button>
      </div>
    </div>

    <div class="card-footer">
      <p v-if="props.desc" class="med-desc">{{ props.desc }}</p>
      <button @click="handleTakeMedConfirm" class="btn-take">
        บันทึกการกินยา
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  id: [Number, String],
  title: String,
  time: String,
  dosage: [Number, String],
  price: Number,
  image: String,
  desc: String
});

const emit = defineEmits(['take-med', 'toggle-important']);
const router = useRouter();
const isImportant = ref(false);

// 🟢 ฟังก์ชันบังคับเปลี่ยนหน้าไป /product/:id
function goToDetail() {
  if (props.id) {
    router.push(`/product/${props.id}`);
  }
}

function toggleImportant() {
  isImportant.value = !isImportant.value;
  emit('toggle-important', props.id);
}

function handleTakeMedConfirm() {
  const isConfirmed = confirm(
    `💊 ยืนยันการบันทึกกินยาใช่หรือไม่?\n\n` +
    `รายการ: "${props.title}"\n` +
    `เวลาเตือน: ${props.time} น.`
  );

  if (isConfirmed) {
    emit('take-med', props);
  }
}
</script>

<style scoped>
.meds-card {
  border: 1px solid #E5E7EB;
  border-radius: 16px;
  padding: 20px;
  background-color: #FFFFFF;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  transition: all 0.2s;
}

.meds-card.is-important {
  border-color: #F59E0B;
  background-color: #FFFBEB;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}

.med-time {
  font-weight: bold;
  color: #1F2937;
  font-size: 1.15em;
}

.card-body {
  display: flex;
  gap: 16px;
  align-items: center;
  margin-bottom: 16px;
}

.med-image {
  width: 90px;
  height: 90px;
  object-fit: cover;
  border-radius: 12px;
  border: 1px solid #F3F4F6;
}

.med-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.med-title {
  margin: 0;
  font-size: 1.35em;
  font-weight: bold;
  color: #111827;
}

.med-dosage, .med-price {
  margin: 0;
  font-size: 1.05em;
  color: #374151;
}

.med-price {
  color: #059669;
  font-weight: 600;
}

.detail-btn {
  display: inline-block;
  margin-top: 6px;
  font-size: 1em;
  color: #2563EB;
  background: none;
  border: none;
  padding: 0;
  font-weight: 600;
  cursor: pointer;
  text-align: left;
}

.detail-btn:hover {
  text-decoration: underline;
}

.card-footer {
  border-top: 1px solid #F3F4F6;
  padding-top: 14px;
  margin-top: 8px;
}

.med-desc {
  font-size: 0.95em;
  color: #4B5563;
  margin: 0 0 12px 0;
  line-height: 1.4;
}

.btn-action {
  background-color: #F3F4F6;
  border: 1px solid #D1D5DB;
  border-radius: 8px;
  padding: 6px 12px;
  font-size: 0.9em;
  font-weight: 500;
  cursor: pointer;
}

.btn-action:hover {
  background-color: #D1D5DB;
}

.btn-action.important {
  background-color: #FEF3C7;
  color: #92400E;
  border-color: #FDE68A;
}

.btn-take {
  width: 100%;
  background-color: #2563EB;
  color: white;
  border: none;
  padding: 14px 20px;
  border-radius: 12px;
  font-weight: bold;
  font-size: 1.15em;
  cursor: pointer;
  transition: background-color 0.2s;
  box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2);
}

.btn-take:hover {
  background-color: #1D4ED8;
}
</style>