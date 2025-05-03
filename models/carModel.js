import mongoose from "mongoose";

const carSchema = new mongoose.Schema({
  state: { type: String, required: true },
  name: { type: String, required: true },
  name_de: { type: String, required: true },
  name_ar: { type: String, required: true },
  marka: { type: String, required: true },
  description: { type: String, required: true },
  description_de: { type: String, required: true },
  description_ar: { type: String, required: true },
  price: { type: Number, required: true },
  year: { type: Number },

  // ✅ دعم عدة صور
  images: [
    {
      url: { type: String, required: true },
      public_id: { type: String, required: true }
    }
  ]
}, { timestamps: true });

// ➕ حقل افتراضي لتاريخ الإنشاء بصيغة مبسطة
carSchema.virtual("createdAtFormatted").get(function () {
  const date = this.createdAt;
  if (!date) return "";
  const yy = String(date.getFullYear()).slice(-2);
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yy}-${mm}-${dd}`;
});

// تفعيل إظهار الحقول الافتراضية في JSON
carSchema.set("toJSON", { virtuals: true });

const carModel = mongoose.models.car || mongoose.model("car", carSchema);
export default carModel;
