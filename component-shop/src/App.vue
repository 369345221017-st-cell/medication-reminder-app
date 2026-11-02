<template>
  <nav aria-label="เมนูหลัก">
    <!-- 🟢 ปุ่มย้อนกลับ: ซ่อนเมื่ออยู่ที่หน้าแรกทั้ง '/' และ '/products' -->
    <button 
      v-if="canGoBack" 
      @click="handleGoBack" 
      class="btn-global-back" 
      title="ย้อนกลับ"
    >
      ← ย้อนกลับ
    </button>

    <router-link to="/">หน้าแรก</router-link>
    <router-link to="/products">รายการเตือนกินยา</router-link>
    <router-link to="/cart">รายงานการกินยา ({{ takenCount }})</router-link>

    <!-- ซ่อนเมนูหลังบ้านจากคนทั่วไป -->
    <router-link v-if="user" to="/admin">หลังบ้าน</router-link>

    <!-- ล็อกอิน/ล็อกเอาต์ -->
    <router-link v-if="!user" to="/login">เข้าสู่ระบบ</router-link>
    <span v-else class="user-info">
      👤 {{ user.email }}
      <button @click="logout" class="btn-logout">ออกจากระบบ</button>
    </span>
  </nav>

  <!-- แจ้งเมื่อข้อมูลเปลี่ยนจากเครื่องอื่น -->
  <p v-if="liveMsg" class="live" role="status" aria-live="polite">{{ liveMsg }}</p>

  <main id="main" tabindex="-1">
    <!-- 🟢 บังคับ Render Component ใหม่ทุกครั้งที่ URL เปลี่ยน -->
    <router-view :key="$route.fullPath" />
  </main>
</template>

<script setup>
import { computed, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { 
  takenCount, 
  loadMedicines, 
  liveMsg, 
  startRealtime, 
  stopRealtime,
  user,
  signOut
} from './store.js';

const router = useRouter();
const route = useRoute();

// 🟢 เช็กเงื่อนไขปุ่มย้อนกลับให้แม่นยำ
const canGoBack = computed(() => {
  return route.path !== '/' && route.path !== '/products';
});

// 🟢 ฟังก์ชันสั่งย้อนกลับ
function handleGoBack() {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push('/products');
  }
}

async function logout() {
  await signOut();
  router.push('/');
}

onMounted(() => {
  loadMedicines();
  startRealtime();
});

onUnmounted(stopRealtime);
</script>

<style>
nav { 
  display: flex; 
  gap: 12px; 
  flex-wrap: wrap; 
  padding: 16px 20px; 
  border-bottom: 2px solid #E5E7EB; 
  justify-content: center;
  align-items: center;
  margin-bottom: 24px;
  background-color: #FFFFFF;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.btn-global-back {
  padding: 8px 16px !important;
  border-radius: 8px !important;
  border: 2px solid #2563EB !important;
  background-color: #EFF6FF !important;
  color: #2563EB !important;
  font-weight: bold !important;
  font-size: 16px !important;
  cursor: pointer;
  transition: all 0.2s;
  margin-right: 8px;
}

.btn-global-back:hover {
  background-color: #2563EB !important;
  color: #FFFFFF !important;
}

nav a { 
  padding: 8px 16px; 
  border-radius: 8px; 
  text-decoration: none; 
  color: #374151;
  font-weight: 600;
  font-size: 16px;
  transition: all 0.2s;
}

nav a.router-link-exact-active { 
  background: #2563EB; 
  color: #fff; 
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  color: #4b5563;
  font-weight: 500;
}

.btn-logout {
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  background-color: #f3f4f6;
  font-size: 14px;
  cursor: pointer;
}

.btn-logout:hover {
  background-color: #e5e7eb;
}

main:focus { 
  outline: none; 
}

.live {
  background-color: #fef3c7;
  color: #92400e;
  padding: 10px 20px;
  margin: 0 auto 15px auto;
  border-radius: 8px;
  text-align: center;
  font-weight: bold;
  font-size: 16px;
  max-width: 600px;
}
</style>