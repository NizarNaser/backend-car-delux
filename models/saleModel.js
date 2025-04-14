import mongoose from "mongoose";

// 📄 سكيمة المصاريف المرتبطة بسيارة
const saleSchema = new mongoose.Schema({
  car_id: { type: String, required: false },
  state: { type: String, required: true },
  name: { type: String, required: true },
  name_de: { type: String, required: true },
  name_ar: { type: String, required: true },
  description: { type: String, required: true },
  description_de: { type: String, required: true },
  description_ar: { type: String, required: true },
  price: { type: Number, required: true }
}, { 
  timestamps: true // ➕ createdAt و updatedAt تلقائيًا
});

// 🧠 Virtual property: التاريخ بصيغة yy-mm-dd
saleSchema.virtual("createdAtFormatted").get(function () {
  const date = this.createdAt;
  if (!date) return "";
  
  const yy = String(date.getFullYear()).slice(-2);       // آخر رقمين من السنة
  const mm = String(date.getMonth() + 1).padStart(2, "0"); // الشهر بصيغة 2 digits
  const dd = String(date.getDate()).padStart(2, "0");     // اليوم بصيغة 2 digits

  return `${yy}-${mm}-${dd}`; // 📅 النتيجة النهائية
});

// 🔄 لتفعيل الـ virtuals عند التحويل إلى JSON
saleSchema.set("toJSON", { virtuals: true });

// ✅ إنشاء الموديل أو استخدام الموجود
const saleModel = mongoose.models.sale || mongoose.model("sale", saleSchema);

export default saleModel;
