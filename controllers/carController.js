
import carModel from "../models/carModel.js";
import expenseModel from "../models/expenseModel.js";
import { cloudinary } from "../config/cloudinary.js";
import fs from "fs";

// ➕ إضافة سيارة جديدة
const addCar = async (req, res) => {
    try {
        const { state, name, description, price, year } = req.body;
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ success: false, message: "يجب تحميل صور." });
        }

        const imageUploadResults = [];
        for (const file of req.files) {
            const result = await cloudinary.uploader.upload(file.path, { folder: "cars" });
            imageUploadResults.push({ url: result.secure_url, public_id: result.public_id });
        }

        const newCar = new carModel({ state, name, description, price, year, images: imageUploadResults });
        await newCar.save();

        res.status(201).json({ success: true, message: "تمت إضافة السيارة بنجاح", car: newCar });
    } catch (error) {
        res.status(500).json({ success: false, message: "فشل في الإضافة", error: error.message });
    }
};

// 🔄 تحديث سيارة وصورها
const updateCar = async (req, res) => {
    try {
      const { name, description, price, year, state } = req.body;
  
      // 1. قراءة الصور القديمة المتبقية
      let existingImages = [];
      if (req.body.existingImages) {
        if (typeof req.body.existingImages === "string") {
          existingImages = [JSON.parse(req.body.existingImages)];
        } else {
          existingImages = req.body.existingImages.map(img => JSON.parse(img));
        }
      }
  
      // 2. حذف الصور المحددة من الواجهة
      let deletedImages = [];
      if (req.body.deletedImages) {
        deletedImages = Array.isArray(req.body.deletedImages)
          ? req.body.deletedImages
          : [req.body.deletedImages];
  
        for (const public_id of deletedImages) {
          await cloudinary.uploader.destroy(public_id);
        }
      }
  
      // 3. رفع الصور الجديدة
      const newImages = [];
      if (req.files && req.files.length > 0) {
        for (const file of req.files) {
          const result = await cloudinary.uploader.upload(file.path, { folder: "cars" });
          newImages.push({ url: result.secure_url, public_id: result.public_id });
        }
      }
  
      // 4. دمج الصور القديمة المتبقية + الجديدة
      const updatedImages = [...existingImages, ...newImages];
  
      // 5. تحديث بيانات السيارة
      const updatedCar = await carModel.findByIdAndUpdate(
        req.params.id,
        {
          name,
          description,
          price,
          year,
          state,
          images: updatedImages,
        },
        { new: true }
      );
  
      res.status(200).json({ success: true, data: updatedCar });
    } catch (error) {
      console.error("Error updating car:", error);
      res.status(500).json({ success: false, message: "حدث خطأ أثناء التحديث" });
    }
  };
  

// 🗑️ حذف سيارة وصورها
const removeCar = async (req, res) => {
    try {
        const car = await carModel.findById(req.body.id);
        if (!car) return res.status(404).json({ success: false, message: "السيارة غير موجودة" });

        for (const img of car.images) {
            await cloudinary.uploader.destroy(img.public_id);
        }

        await carModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "تم حذف السيارة بنجاح" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "فشل في حذف السيارة" });
    }
};

// 📄 جلب كل السيارات
const listCar = async (req, res) => {
    try {
        const cars = await carModel.find({});
        res.json({ success: true, data: cars });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// 📄 جلب سيارة واحدة
const getOneCar = async (req, res) => {
    try {
        const car = await carModel.findById(req.params.id);
        if (!car) return res.status(404).json({ error: "Car not found" });
        res.json(car);
    } catch (error) {
        res.status(500).json({ error: "Error fetching car item" });
    }
};

// 📅 جلب السيارات خلال فترة زمنية
const getCarsByDate = async (req, res) => {
    try {
        const { start, end, state } = req.query;
        if (!start || !end || !state) {
            return res.status(400).json({ message: "يرجى تحديد تاريخ البداية والنهاية والحالة (state)" });
        }

        const cars = await carModel.find({
            createdAt: { $gte: new Date(start), $lte: new Date(end) },
            state: state
        }).sort({ createdAt: -1 });

        res.json(cars);
    } catch (err) {
        res.status(500).json({ message: "حدث خطأ أثناء جلب البيانات", error: err.message });
    }
};

// ➕ إضافة مصروف
const addExpense = async (req, res) => {
    try {
        const { car_id, state, name, description, price } = req.body;

        if (!state || !name || !description || !price) {
            return res.status(400).json({ success: false, message: "الحقول مطلوبة" });
        }

        const newExpense = new expenseModel({
            car_id,
            state,
            name,
            description,
            price: Number(price)
        });

        await newExpense.save();
        res.status(201).json({ success: true, message: "تمت إضافة المصروف", data: newExpense });
    } catch (error) {
        console.error("Error in addExpense:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// 🔄 تحديث مصروف
const updateExpense = async (req, res) => {
    try {
        const existingExpense = await expenseModel.findById(req.params.id);
        if (!existingExpense) return res.status(404).json({ error: "Expense not found" });

        const updatedExpense = await expenseModel.findByIdAndUpdate(
            req.params.id,
            {
                car_id: req.body.car_id,
                state: req.body.state,
                name: req.body.name,
                description: req.body.description,
                price: req.body.price,
            },
            { new: true }
        );

        res.json({ success: true, message: "تم التحديث", updatedExpense });
    } catch (error) {
        console.error("Update error:", error);
        res.status(500).json({ error: "Error updating Expense item" });
    }
};

// 🗑️ حذف مصروف
const removeExpense = async (req, res) => {
    try {
        await expenseModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "تم الحذف" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// 📄 جلب مصروف واحد
const getOneExpense = async (req, res) => {
    try {
        const expense = await expenseModel.findById(req.params.id);
        if (!expense) return res.status(404).json({ error: "expense not found" });
        res.json(expense);
    } catch (error) {
        res.status(500).json({ error: "Error fetching expense item" });
    }
};

// 📄 جلب كل المصاريف
const listExpense = async (req, res) => {
    try {
        const Expenses = await expenseModel.find({});
        res.json({ success: true, data: Expenses });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// 📄 جلب المصاريف الخاصة بسيارة
const listExpenseCar = async (req, res) => {
    try {
        const Expenses = await expenseModel.find({ car_id: req.params.id });
        res.json({ success: true, data: Expenses });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// 📅 جلب المصاريف خلال فترة زمنية
const getExpenseByDate = async (req, res) => {
    try {
        const { start, end, state } = req.query;
        if (!start || !end || !state) {
            return res.status(400).json({ message: "يرجى تحديد تاريخ البداية والنهاية والحالة (state)" });
        }

        const expense = await expenseModel.find({
            createdAt: { $gte: new Date(start), $lte: new Date(end) },
            state: state
        }).sort({ createdAt: -1 });

        res.json(expense);
    } catch (err) {
        res.status(500).json({ message: "حدث خطأ أثناء جلب البيانات", error: err.message });
    }
};

export {
    addCar,
    updateCar,
    removeCar,
    listCar,
    getOneCar,
    getCarsByDate,
    addExpense,
    updateExpense,
    removeExpense,
    getOneExpense,
    listExpense,
    listExpenseCar,
    getExpenseByDate,
};
