import carModel from "../models/carModel.js";
import expenseModel from "../models/expenseModel.js";
import fs from "fs";
import { cloudinary } from "../config/cloudinary.js"; // ✅ استورد Cloudinary

// إضافة سيارة
export const addCar = async (req, res) => {
    try {
      const { state, name, description, price, year } = req.body;
  
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ success: false, message: "يجب تحميل صور." });
      }
  
      const imageUrls = req.files.map(file => file.path);
      const imagePublicIds = req.files.map(file => file.filename); // public_id في Cloudinary
  
      const newCar = new carModel({
        state,
        name,
        description,
        price,
        year,
        images: imageUrls, // ✨ مصفوفة روابط الصور
        image_public_ids: imagePublicIds // ✨ مصفوفة public_id
      });
  
      await newCar.save();
      res.status(201).json({ success: true, message: "تمت إضافة السيارة بنجاح", car: newCar });
    } catch (error) {
      res.status(500).json({ success: false, message: "فشل في الإضافة", error: error.message });
    }
  };
  
// إزالة السيارة
const removeCar = async (req, res) => {
    try {
        const car = await carModel.findById(req.body.id);

        // حذف الصور من Cloudinary
        for (let publicId of car.image_public_ids) {
            await cloudinary.uploader.destroy(publicId);
        }

        // حذف السيارة من قاعدة البيانات
        await carModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Car Removed" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// تعديل بيانات السيارة
const updateCar = async (req, res) => {
    try {
        // البحث عن العنصر الحالي
        const existingCar = await carModel.findById(req.params.id);
        if (!existingCar) {
            return res.status(404).json({ error: "Car not found" });
        }

        let imageUrls = existingCar.images;
        let imagePublicIds = existingCar.image_public_ids;

        if (req.files && req.files.length > 0) {
            // حذف الصور القديمة من Cloudinary
            for (let publicId of imagePublicIds) {
                await cloudinary.uploader.destroy(publicId);
            }

            // تخزين الصور الجديدة
            imageUrls = [];
            imagePublicIds = [];

            for (let file of req.files) {
                try {
                    const uploadResult = await cloudinary.uploader.upload(file.path); // رفع الصورة
                    imageUrls.push(uploadResult.secure_url); // تخزين رابط الصورة
                    imagePublicIds.push(uploadResult.public_id); // تخزين public_id
                } catch (error) {
                    return res.status(500).json({ success: false, message: "Error uploading images", error: error.message });
                }
            }
        }

        // تحديث بيانات السيارة
        const updatedCar = await carModel.findByIdAndUpdate(
            req.params.id,
            {
                state: req.body.state,
                name: req.body.name,
                description: req.body.description,
                price: req.body.price,
                year: req.body.year,
                images: imageUrls,
                image_public_ids: imagePublicIds
            },
            { new: true }
        );

        res.json({ success: true, message: "Car updated successfully!", updatedCar });
    } catch (error) {
        console.error("Update error:", error);
        res.status(500).json({ error: "Error updating car item" });
    }
};

export { addCar, removeCar, updateCar };
