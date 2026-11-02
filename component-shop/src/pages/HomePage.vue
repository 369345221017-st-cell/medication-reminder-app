<template>
  <section class="home-container">
    <h1>💊 ระบบเตือนการกินยาผู้สูงอายุ</h1>
    <p>ช่วยดูแลและเตือนการรับประทานยาอย่างถูกต้อง ปลอดภัย และตรงเวลา</p>
    
    <router-link to="/products" class="btn-link">
      ดูรายการยาเตือนกินยา ทั้งหมด →
    </router-link>
  </section>
</template>

<style scoped>
.home-container {
  text-align: center;
  padding: 40px 20px;
}

h1 {
  font-size: 1.8em;
  color: #1F2937;
  margin-bottom: 12px;
}

p {
  color: #4B5563;
  margin-bottom: 24px;
}

.btn-link {
  display: inline-block;
  background-color: #2563EB;
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: bold;
  transition: background-color 0.2s;
}

.btn-link:hover {
  background-color: #1D4ED8;
}
</style>