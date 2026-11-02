# Medication Reminder (ระบบแจ้งเตือนและบันทึกการกินยา)

ทีม: ทีมห่วงใย · สมาชิก: ธรรมรัตน์ โพธิ์อ่อน (รหัสนักศึกษา: 369345221017)
ลิงก์ระบบ: https://tubular-lamington-4a3cf4.netlify.app/

## ปัญหาและกลุ่มเป้าหมาย
ผู้สูงอายุและผู้ป่วยโรคเรื้อรังมักลืมรับประทานยาตามเวลา หรือรับประทานยาไม่ครบถ้วนตามแพทย์สั่ง ระบบนี้จึงถูกพัฒนาขึ้นเพื่อช่วยแจ้งเตือน ติดตามประวัติการกินยา และแสดงผลรายงานสรุปการรับประทานยาประจำวัน

## 2. ฟีเจอร์หลักของระบบ (Key Features)
- **1. ระบบแจ้งเตือนทานยาประจำวัน (Daily Reminder):** เข้าหน้าแรก (/products) เลือกช่วงเวลากินยา (เช้า/12:00/18:00) ระบบจะแสดงรายการยาพร้อมรูปประกอบ และเวลากินที่ถูกต้อง
- **2. ระบบบันทึกการกินยา (Medication Tracking):** กดปุ่ม "ทานแล้ว" และยืนยันการทานยา ระบบจะบันทึกสถานะเรียบร้อยพร้อมเพิ่มคะแนนสะสม
- **3. ระบบจัดการข้อมูลหลังบ้าน (Supabase Admin):** เข้าหน้าแดชบอร์ด Supabase แก้ไขหรือเพิ่มรายการยา ข้อมูลยารายการใหม่จะแสดงผลบนหน้าเว็บทันที
- **4. หน้าสรุปผลกระทบ (Impact Page):** เข้าหน้า /impact ตรวจสอบสถิติ ระบบจะแสดงผู้ใช้ 5 คน รูปภาพ B1-B5 และข้อความฟีดแบ็ก

## เทคโนโลยีที่ใช้
- Vue.js 3 (Composition API / Vue Router)
- Supabase (Database & Real-time Subscriptions & RLS)
- Vite (Frontend Build Tool)

## วิธีติดตั้งและรัน
1. ติดตั้ง Node.js รุ่น LTS
2. คัดลอก `.env.example` เป็น `.env.local` แล้วใส่ค่า `VITE_SUPABASE_URL` และ `VITE_SUPABASE_ANON_KEY`
3. รันคำสั่ง `npm install`
4. นำเข้าฐานข้อมูลจาก `database/`
5. รันคำสั่ง `npm run dev` แล้วเปิด `http://localhost:5173`

## บัญชีทดสอบ (บัญชีเฉพาะส่งงาน)
- **username:** demo_test@example.com
- **password:** Demo123456!

## โครงสร้างโฟลเดอร์ (Folder Structure)
```text
component-shop/
├── .vscode/
│   └── extensions.json
├── public/
│   ├── _redirects
│   ├── b1.jpg
│   ├── b2.jpg
│   ├── b3.jpg
│   ├── b4.jpg
│   ├── b5.jpg
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/
│   │   ├── hero.png
│   │   ├── vite.svg
│   │   └── vue.svg
│   ├── components/
│   │   ├── HelloWorld.vue
│   │   ├── MedsCard.vue
│   │   └── Panel.vue
│   ├── pages/
│   │   ├── AdminPage.vue
│   │   ├── CartPage.vue
│   │   ├── HomePage.vue
│   │   ├── ImpactPage.vue
│   │   ├── LoginPage.vue
│   │   ├── ProductDetailPage.vue
│   │   └── ProductsPage.vue
│   ├── router/
│   │   └── index.js
│   ├── App.vue
│   ├── main.js
│   ├── store.js
│   └── style.css
├── .env.example
├── .gitignore
├── database
├── index.html
├── package-lock.json
├── package.json
├── README.md
└── vite.config.js
