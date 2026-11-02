<template>
  <section class="admin-container">
    <h1 class="page-title">⚙️ จัดการคลังยาและรายการเตือน (สำหรับผู้ดูแล)</h1>
    
    <!-- ฟอร์มเพิ่มรายการยาเตือนใหม่ -->
    <form @submit.prevent="saveMed" class="add-form">
      <h3>➕ เพิ่มรายการยาเตือนใหม่</h3>
      <div class="form-group">
        <label for="title">ชื่อยา / รายการเตือน:</label>
        <input 
          id="title" 
          v-model.trim="newTitle" 
          placeholder="เช่น ยาลดความดัน" 
          required 
          class="form-input"
        />
      </div>
      
      <div class="form-group">
        <label for="timeSlot">ช่วงเวลากินยา:</label>
        <select id="timeSlot" v-model="selectedTimeSlot" class="form-select">
          <option value="เช้า">🌅 เช้า</option>
          <option value="กลางวัน">☀️ กลางวัน</option>
          <option value="เย็น">🌆 เย็น</option>
          <option value="ก่อนนอน">🌙 ก่อนนอน</option>
        </select>
      </div>

      <div class="form-group">
        <label for="price">ปริมาณการทานต่อมื้อ (เม็ด):</label>
        <input 
          id="price" 
          v-model.number="newPrice" 
          type="number" 
          step="0.5"
          min="0" 
          placeholder="เช่น 1 หรือ 0.5" 
          required 
          class="form-input"
        />
      </div>

      <button type="submit" :disabled="busy" class="btn-submit">
        {{ busy ? 'กำลังบันทึก...' : '➕ บันทึกรายการยา' }}
      </button>
    </form>

    <p role="status" aria-live="polite" class="status-msg" v-if="formMsg">{{ formMsg }}</p>

    <!-- ตารางจัดการรายการยา -->
    <h2>💊 รายการยาและปริมาณทานประจำเดือนนี้</h2>
    <div class="table-wrapper">
      <table class="meds-table">
        <caption>รายการยาทั้งหมด {{ products.length }} รายการ</caption>
        <thead>
          <tr>
            <th scope="col">ชื่อยา</th>
            <th scope="col">ช่วงเวลากินยา</th>
            <th scope="col">ปรับปริมาณการกินต่อมื้อ</th>
            <th scope="col">ขนาดทานต่อมื้อ</th>
            <th scope="col">จัดการ / ลบรายการ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in products" :key="p.id">
            <td><strong class="med-name">{{ p.title }}</strong></td>
            
            <!-- ปุ่มเลือกช่วงเวลากินยา -->
            <td class="time-selector">
              <div class="time-btn-group">
                <button 
                  type="button"
                  :class="{ active: p.time === 'เช้า' }"
                  @click="setTimeSlot(p, 'เช้า')"
                >
                  🌅 เช้า
                </button>
                <button 
                  type="button"
                  :class="{ active: p.time === 'กลางวัน' }"
                  @click="setTimeSlot(p, 'กลางวัน')"
                >
                  ☀️ กลางวัน
                </button>
                <button 
                  type="button"
                  :class="{ active: p.time === 'เย็น' }"
                  @click="setTimeSlot(p, 'เย็น')"
                >
                  🌆 เย็น
                </button>
                <button 
                  type="button"
                  :class="{ active: p.time === 'ก่อนนอน' }"
                  @click="setTimeSlot(p, 'ก่อนนอน')"
                >
                  🌙 ก่อนนอน
                </button>
              </div>
            </td>

            <!-- ปุ่มเลือกจำนวนเม็ดต่อมื้อ -->
            <td class="dose-selector">
              <div class="dose-btn-group">
                <button 
                  type="button"
                  :class="{ active: p.price === 0.5 }"
                  @click="setDose(p, 0.5)"
                >
                  ครึ่งเม็ด
                </button>
                <button 
                  type="button"
                  :class="{ active: p.price === 1 }"
                  @click="setDose(p, 1)"
                >
                  1 เม็ด
                </button>
                <button 
                  type="button"
                  :class="{ active: p.price === 2 }"
                  @click="setDose(p, 2)"
                >
                  2 เม็ด
                </button>
              </div>
            </td>

            <td>
              <span class="badge">
                {{ p.price === 0.5 ? 'ครึ่ง' : p.price }} เม็ด/มื้อ
              </span>
            </td>

            <td class="action-btns">
              <!-- ปุ่ม ✏️ เติมคลังยา -->
              <button 
                @click="setStock(p)" 
                class="btn-edit"
                :aria-label="'ปรับคลังยา ' + p.title"
              >
                ✏️ เติมคลังยา
              </button>
              
              <!-- 🟢 ปุ่มลบยาพร้อมระบบยืนยันเพื่อป้องกันมือโดน -->
              <button 
                @click="removeProduct(p)" 
                class="btn-delete"
              >
                🗑️ ลบรายการ
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import { products, addProduct, updatePrice, deleteProduct, updateTimeSlot } from '../store.js';

const newTitle = ref('');
const selectedTimeSlot = ref('เช้า');
const newPrice = ref(1);
const busy = ref(false);
const formMsg = ref('');

// 🟢 บันทึกรายการยาพร้อมระบบยืนยัน (ป้องกันการกดบันทึกโดยไม่ตั้งใจ)
async function saveMed() {
  if (!newTitle.value) return;

  const confirmSave = confirm(
    `📌 ยืนยันการบันทึกรายการยาใหม่ใช่หรือไม่?\n\n` +
    `• ชื่อยา: ${newTitle.value}\n` +
    `• ช่วงเวลา: ${selectedTimeSlot.value}\n` +
    `• ปริมาณ: ${newPrice.value} เม็ด/มื้อ`
  );

  if (!confirmSave) return;

  busy.value = true;
  formMsg.value = '';

  const problem = await addProduct({
    title: newTitle.value,
    time: selectedTimeSlot.value,
    price: newPrice.value
  });

  busy.value = false;

  if (problem) {
    formMsg.value = '❌ บันทึกไม่สำเร็จ: ' + problem;
  } else {
    formMsg.value = `✅ บันทึกรายการยา "${newTitle.value}" ช่วงเวลา ${selectedTimeSlot.value} สำเร็จ!`;
    newTitle.value = '';
    newPrice.value = 1;
  }
}

// ฟังก์ชัน ✏️ เติมคลังยา
async function setStock(p) {
  const text = prompt(`ระบุจำนวนยาคงเหลือในคลังของ ${p.title} (เม็ด):`, p.price);
  
  if (text === null) return;
  
  const newStock = Number(text);
  
  if (!Number.isInteger(newStock) || newStock < 0) {
    formMsg.value = '❌ จำนวนยาในคลังต้องเป็นจำนวนเต็มตั้งแต่ 0 ขึ้นไป';
    return;
  }
  
  const problem = await updatePrice(p.id, newStock);
  formMsg.value = problem 
    ? '❌ แก้ไขไม่สำเร็จ: ' + problem 
    : `✅ ปรับคลังยา "${p.title}" เป็น ${newStock} เม็ด เรียบร้อยแล้ว`;
}

async function setTimeSlot(p, newTime) {
  if (p.time === newTime) return;
  const problem = await updateTimeSlot(p.id, newTime);
  formMsg.value = problem 
    ? '❌ แก้ไขเวลาไม่สำเร็จ: ' + problem 
    : `✅ ปรับเวลาทานยาของ "${p.title}" เป็นช่วง "${newTime}" เรียบร้อยแล้ว`;
}

async function setDose(p, newDose) {
  if (p.price === newDose) return;
  const problem = await updatePrice(p.id, newDose);
  const doseLabel = newDose === 0.5 ? 'ครึ่งเม็ด' : `${newDose} เม็ด`;
  
  formMsg.value = problem 
    ? '❌ แก้ไขไม่สำเร็จ: ' + problem 
    : `✅ ปรับปริมาณทานของ "${p.title}" เป็นมื้อละ ${doseLabel} เรียบร้อยแล้ว`;
}

// 🟢 ลบรายการยาพร้อมระบบยืนยันซ้ำเพื่อป้องกันมือไปโดน (ฟีดแบ็ก B3)
async function removeProduct(p) {
  const confirmDelete = confirm(
    `⚠️ ยืนยันการลบรายการยาหรือไม่?\n\n` +
    `คุณกำลังจะลบ: "${p.title}"\n` +
    `หากลบแล้วข้อมูลรายการยานี้จะหายไปจากระบบทันที!`
  );

  if (!confirmDelete) return;

  const problem = await deleteProduct(p.id);
  formMsg.value = problem 
    ? '❌ ลบไม่สำเร็จ: ' + problem 
    : `🗑️ ลบรายการยา "${p.title}" เรียบร้อยแล้ว`;
}
</script>

<style scoped>
.admin-container {
  max-width: 1050px;
  margin: 0 auto;
  padding: 24px;
}

.page-title {
  font-size: 1.6em;
  margin-bottom: 20px;
}

.add-form {
  background: #f9fafb;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  margin-bottom: 24px;
}

.add-form h3 {
  margin-top: 0;
  font-size: 1.25em;
  color: #111827;
}

.form-group {
  margin-bottom: 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-size: 1.05em;
  font-weight: 600;
  color: #374151;
}

.form-input, .form-select {
  padding: 10px 14px;
  font-size: 1.05em;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  width: 100%;
  box-sizing: border-box;
}

.btn-submit {
  width: 100%;
  padding: 12px;
  font-size: 1.1em;
  font-weight: bold;
  background-color: #2563eb;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 8px;
}

.btn-submit:hover {
  background-color: #1d4ed8;
}

.btn-submit:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}

.status-msg {
  font-size: 1.1em;
  font-weight: bold;
  margin: 16px 0;
  padding: 12px 16px;
  border-radius: 8px;
  background-color: #eff6ff;
  color: #1e40af;
  text-align: center;
}

.table-wrapper {
  overflow-x: auto;
}

.meds-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 12px;
  font-size: 1.05em;
}

.meds-table th, .meds-table td {
  border: 1px solid #d1d5db;
  padding: 12px;
  text-align: left;
  vertical-align: middle;
}

.meds-table th {
  background-color: #f3f4f6;
  font-size: 1.05em;
}

.med-name {
  font-size: 1.1em;
}

.time-btn-group, .dose-btn-group {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.time-btn-group button, .dose-btn-group button {
  padding: 6px 10px;
  font-size: 0.95em;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  background-color: #ffffff;
  color: #374151;
  cursor: pointer;
  font-weight: 500;
}

.time-btn-group button.active {
  background-color: #10b981;
  color: #ffffff;
  border-color: #059669;
  font-weight: bold;
}

.dose-btn-group button.active {
  background-color: #2563eb;
  color: #ffffff;
  border-color: #1d4ed8;
  font-weight: bold;
}

.badge {
  background-color: #e0e7ff;
  color: #3730a3;
  padding: 6px 12px;
  border-radius: 12px;
  font-weight: bold;
  font-size: 0.95em;
  display: inline-block;
}

.action-btns {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.btn-edit {
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  background-color: #ffffff;
  color: #374151;
  font-size: 0.95em;
  font-weight: bold;
  cursor: pointer;
}

.btn-edit:hover {
  background-color: #f3f4f6;
}

.btn-delete {
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #fca5a5 !important;
  background-color: #fee2e2 !important;
  color: #991b1b;
  font-size: 0.95em;
  font-weight: bold;
  cursor: pointer;
}

.btn-delete:hover {
  background-color: #fecaca !important;
}
</style>