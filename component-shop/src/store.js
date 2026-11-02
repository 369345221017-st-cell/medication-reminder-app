import { ref, computed } from 'vue';
import { supabase } from './supabase.js';

// ------------ ข้อมูลต้นทาง (State) ------------
export const medsList = ref([]);
export const products = medsList;
export const loading = ref(true);
export const errorMsg = ref('');

export const takenMeds = ref([]);
export const takenMedsList = takenMeds;
export const cart = takenMeds;
export const notice = ref('');

// ------------ Computed Properties ------------
export const takenCount = computed(() => takenMeds.value.length);
export const itemCount = takenCount;

export const totalPrice = computed(() => {
  return takenMeds.value.reduce((sum, item) => sum + (item.price || 0), 0);
});
export const netTotal = totalPrice;
export const shippingFee = ref(0);

export const progress = computed(() => {
  if (medsList.value.length === 0) return 0;
  return Math.round((takenMeds.value.length / medsList.value.length) * 100);
});

export const remaining = computed(() => {
  const rem = medsList.value.length - takenMeds.value.length;
  return rem < 0 ? 0 : rem;
});

// ------------ Action Functions ------------
export function handleTakeMed(med) {
  takenMeds.value.push(med);
  notice.value = `บันทึกการกินยา "${med.title}" เรียบร้อยแล้ว!`;
}

export function addToCart(product) {
  handleTakeMed(product);
}

export function clearCart() {
  takenMeds.value = [];
  notice.value = 'ล้างประวัติการกินยาเรียบร้อยแล้ว';
}

export const clearHistory = clearCart;

export function handleToggleImportant(id) {
  const item = medsList.value.find(m => m.id === id);
  if (item) {
    item.important = !item.important;
  }
}

// ------------ โหลดข้อมูลจาก Supabase ------------
export async function loadMedicines() {
  if (medsList.value.length === 0) loading.value = true;
  errorMsg.value = '';

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('id');

  if (error) {
    errorMsg.value = 'โหลดข้อมูลสินค้าไม่สำเร็จ กรุณาลองใหม่';
    console.error(error);
  } else {
    medsList.value = data;
  }
  loading.value = false;
}

export const loadProducts = loadMedicines;
export const loadMeds = loadMedicines;

// ------------ CRUD Functions (มี Export ครบทุกชื่อแน่นอน) ------------
export async function addProduct(newItem) {
  const { error } = await supabase.from('products').insert(newItem);
  if (error) return error.message;
  await loadProducts();
  return '';
}

export async function updatePrice(id, newPrice) {
  const { data, error } = await supabase
    .from('products')
    .update({ price: newPrice })
    .eq('id', id)
    .select();

  if (error) return error.message;
  if (!data || data.length === 0) return 'ไม่มีสิทธิ์แก้ไข หรือไม่พบรายการยานี้';
  await loadMedicines();
  return '';
}

export async function updateTimeSlot(id, newTime) {
  const { data, error } = await supabase
    .from('products')
    .update({ time: newTime })
    .eq('id', id)
    .select();

  if (error) return error.message;
  if (!data || data.length === 0) return 'ไม่มีสิทธิ์แก้ไข หรือไม่พบรายการยานี้';
  await loadMedicines();
  return '';
}

export async function deleteProduct(id) {
  const { data, error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)
    .select();

  if (error) return error.message;
  if (!data || data.length === 0) return 'ไม่มีสิทธิ์ลบ หรือไม่พบรายการยานี้';
  await loadMedicines();
  return '';
}

// ------------ Realtime ------------
export const liveMsg = ref('');
let channel = null;

export function startRealtime() {
  if (channel) return;
  channel = supabase
    .channel('products-changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'products' },
      () => {
        liveMsg.value = 'มีการอัปเดตข้อมูล – แสดงรายการล่าสุดแล้ว';
        setTimeout(() => { liveMsg.value = ''; }, 5000);
        loadProducts();
      }
    )
    .subscribe();
}

export function stopRealtime() {
  if (channel) {
    supabase.removeChannel(channel);
    channel = null;
  }
}

// ------------ Auth ------------
export const user = ref(null);

export const authReady = supabase.auth.getSession().then(({ data }) => {
  user.value = data.session?.user ?? null;
});

supabase.auth.onAuthStateChange((_event, session) => {
  user.value = session?.user ?? null;
});

export async function signIn(email, password) {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  return error ? 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' : '';
}

export async function signOut() {
  await supabase.auth.signOut();
}