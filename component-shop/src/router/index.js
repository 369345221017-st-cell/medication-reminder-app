import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../pages/HomePage.vue';
import ProductsPage from '../pages/ProductsPage.vue';
import CartPage from '../pages/CartPage.vue';
import ProductDetailPage from '../pages/ProductDetailPage.vue';
import AdminPage from '../pages/AdminPage.vue';
import LoginPage from '../pages/LoginPage.vue';
import ImpactPage from '../pages/ImpactPage.vue'; // เพิ่ม import หน้า ImpactPage
import { user, authReady } from '../store.js';

const routes = [
  { path: '/', component: HomePage },
  { path: '/products', component: ProductsPage },
  { path: '/product/:id', component: ProductDetailPage },
  { path: '/cart', component: CartPage },
  { path: '/login', component: LoginPage },
  { path: '/impact', component: ImpactPage }, // เพิ่ม route สำหรับหน้า /impact
  // meta = ป้ายบอกว่าหน้านี้ต้องล็อกอินก่อน
  { path: '/admin', component: AdminPage, meta: { requiresLogin: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// ยามหน้าประตู: ทำงาน "ก่อน" เปลี่ยนหน้าทุกครั้ง
router.beforeEach(async (to) => {
  if (to.meta.requiresLogin) {
    await authReady; // รอให้รู้ก่อนว่าล็อกอินค้างไว้ไหม (สำคัญตอนกด F5)
    if (!user.value) return '/login'; // ยังไม่ล็อกอิน -> ไปหน้าเข้าสู่ระบบ
  }
  // ไม่ return อะไร = อนุญาตให้ไปต่อ
});

// ทำงาน "หลัง" เปลี่ยนหน้าเสร็จ: ย้ายโฟกัสไปเนื้อหาหลัก
router.afterEach(() => {
  document.getElementById('main')?.focus();
});

export default router;