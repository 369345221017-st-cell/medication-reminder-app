<template>
  <div style="padding: 2rem; max-width: 1000px; margin: 0 auto; font-family: sans-serif;">
    <h1 style="text-align: center; margin-bottom: 1.5rem;">สรุปผลกระทบและการเก็บหลักฐาน (Impact)</h1>

    <!-- สรุปจำนวนนับตามข้อ 3 -->
    <div style="display: flex; gap: 1rem; justify-content: center; margin-bottom: 2rem;">
      <div style="padding: 1.5rem; background-color: #eef6ff; border-radius: 12px; text-align: center; min-width: 200px; border: 1px solid #bbe1fa;">
        <h3 style="margin: 0; color: #0f4c81;">จำนวนผู้ให้ฟีดแบ็กทั้งหมด</h3>
        <p style="font-size: 2.5rem; font-weight: bold; margin: 0.5rem 0 0 0; color: #1b262c;">
          {{ loading ? '...' : logs.length }} คน
        </p>
      </div>

      <div style="padding: 1.5rem; background-color: #eefbf3; border-radius: 12px; text-align: center; min-width: 200px; border: 1px solid #c3e6cb;">
        <h3 style="margin: 0; color: #155724;">จำนวนคนที่ยินยอมให้เผยแพร่</h3>
        <p style="font-size: 2.5rem; font-weight: bold; margin: 0.5rem 0 0 0; color: #155724;">
          {{ loading ? '...' : allowedLogs.length }} คน
        </p>
      </div>
    </div>

    <h2 style="border-bottom: 2px solid #eee; padding-bottom: 0.5rem;">ความคิดเห็นจากผู้ใช้งาน (User Quotes & Proofs)</h2>

    <!-- แสดงคำพูดและรูปเฉพาะคนที่ยินยอม -->
    <div v-if="loading" style="text-align: center; margin-top: 2rem;">
      กำลังดึงข้อมูลจาก Supabase...
    </div>

    <div v-else style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin-top: 1.5rem;">
      <div v-for="item in allowedLogs" :key="item.id" style="border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); background-color: #fff;">
        
        <!-- ดึงรูปจากโฟลเดอร์ public/ -->
        <div style="height: 180px; background-color: #f5f5f5; display: flex; align-items: center; justify-content: center; overflow: hidden;">
          <img 
            :src="`/${item.user_code.toLowerCase()}.jpg`" 
            :alt="`Proof for ${item.user_code}`"
            style="width: 100%; height: 100%; object-fit: cover;"
            @error="handleImageError($event, item.user_code)"
          />
        </div>

        <div style="padding: 1.2rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.8rem;">
            <span style="font-weight: bold; font-size: 1.1rem; color: #333;">รหัส: {{ item.user_code }}</span>
            <span style="font-size: 0.8rem; background-color: #d4edda; color: #155724; padding: 3px 8px; border-radius: 12px;">
              {{ item.consent }}
            </span>
          </div>
          <blockquote style="margin: 0; font-style: italic; color: #555; border-left: 3px solid #0070f3; padding-left: 10px;">
            "{{ item.quote }}"
          </blockquote>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { supabase } from '../supabase.js'

const logs = ref([])
const loading = ref(true)

// กรองเฉพาะแถวที่ยินยอม
const allowedLogs = computed(() => {
  return logs.value.filter(item => item.consent && item.consent.includes('ยินยอม'))
})

// รองรับทั้งไฟล์ .jpg และ .png หากหาไฟล์ไม่เจอจะแสดงกล่องข้อความสำรอง
const handleImageError = (event, userCode) => {
  const code = userCode.toLowerCase()
  const img = event.target
  
  if (img.src.endsWith('.jpg')) {
    img.src = `/${code}.png`
  } else {
    img.style.display = 'none'
    if (img.parentNode) {
      img.parentNode.innerText = `รูปภาพหลักฐาน (${userCode})`
    }
  }
}

onMounted(async () => {
  try {
    const { data, error } = await supabase
      .from('impact_log')
      .select('*')
      .order('id', { ascending: true })

    if (error) console.error('Error fetching logs:', error)
    else logs.value = data || []
  } catch (err) {
    console.error('Unexpected error:', err)
  } finally {
    loading.value = false
  }
})
</script>