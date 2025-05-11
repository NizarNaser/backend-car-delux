import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  public_id: { type: String, required: true }
}, { _id: false });

const carSchema = new mongoose.Schema({
  state: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  year: { type: Number },
  images: [imageSchema]
}, { timestamps: true });

// ➕ Add virtual field for formatted date
carSchema.virtual("createdAtFormatted").get(function () {
  const date = this.createdAt;
  if (!date) return "";
  const yy = String(date.getFullYear()).slice(-2);
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yy}-${mm}-${dd}`;
});

// Enable virtuals in JSON and Object output
carSchema.set("toJSON", { virtuals: true });
carSchema.set("toObject", { virtuals: true });

const carModel = mongoose.models.car || mongoose.model("car", carSchema);
export default carModel;
