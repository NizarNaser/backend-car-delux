import carModel from "../models/carModel.js";
import expenseModel from "../models/expenseModel.js";
import fs from "fs"
import { cloudinary } from "../config/cloudinary.js"; // ✅ استورد Cloudinary


//add car item
// إضافة سيارة
const addCar = async (req, res) => {
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

// addExpense


const addExpense = async (req, res) => {
    try {
        const {
            car_id,
            state,
            name,
            description,
            price
        } = req.body;

        if (
            !state || !name || !name_de || !name_ar ||
            !description || !description_de || !description_ar || !price
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields except car_id are required"
            });
        }

        const newExpense = new expenseModel({
            car_id, // هذا السطر سيكون الآن داخل الدالة وبالتالي لا خطأ
            state,
            name,
            description,
            price: Number(price)
        });

        await newExpense.save();

        res.status(201).json({
            success: true,
            message: "Expense added successfully",
            data: newExpense
        });

    } catch (error) {
        console.error("Error in addExpense:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};


// دالة للحصول على السيارات ضمن فترة زمنية محددة
 const getCarsByDate = async (req, res) => {
    try {
      const { start, end ,state} = req.query;
  
      // التحقق من وجود التاريخين
      if (!start || !end || !state) {
        return res.status(400).json({ message: "يرجى تحديد تاريخ البداية والنهاية والحالة (state)" });
      }
  
      // جلب السيارات التي تم إنشاؤها بين التاريخين
      const cars = await carModel.find({
        createdAt: {
          $gte: new Date(start),
          $lte: new Date(end),
        },
        state: state
      }).sort({ createdAt: -1 }); // ترتيب تنازلي حسب الأحدث
  
      res.json(cars);
    } catch (err) {
      res.status(500).json({ message: "حدث خطأ أثناء جلب البيانات", error: err.message });
    }
  };

  
//all car list
const listCar = async (req, res) => {
    try {
        const cars = await carModel.find({});
        res.json({ success: true, data: cars });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })

    }
}
//listExpense
const listExpense = async (req, res) => {
    try {
        const Expenses = await expenseModel.find({});
        res.json({ success: true, data: Expenses });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })

    }
}
//listExpense from id car
const listExpenseCar = async (req, res) => {
    try {
      const Expenses = await expenseModel.find({ car_id: req.params.id });
      res.json({ success: true, data: Expenses });
    } catch (error) {
      console.log(error);
      res.json({ success: false, message: "Error" });
    }
  };

// دالة للحصول على مشتريات أخرى ضمن فترة زمنية محددة
const getExpenseByDate = async (req, res) => {
    try {
      const { start, end, state } = req.query;
  
      // التحقق من وجود التاريخين وحالة الستات
      if (!start || !end || !state) {
        return res.status(400).json({ message: "يرجى تحديد تاريخ البداية والنهاية والحالة (state)" });
      }
  
      // جلب المشتريات الأخرى التي تم إنشاؤها بين التاريخين وبالحالة المطلوبة
      const expense = await expenseModel.find({
        createdAt: {
          $gte: new Date(start),
          $lte: new Date(end)
        },
        state: state
      }).sort({ createdAt: -1 }); // ترتيب تنازلي حسب الأحدث
  
      res.json(expense);
    } catch (err) {
      res.status(500).json({ message: "حدث خطأ أثناء جلب البيانات", error: err.message });
    }
  };
  


//remove car item
const removeCar = async (req, res) => {
    try {
        const car = await carModel.findById(req.body.id);
        fs.unlink(`uploads/${car.image}`, () => { })

        await carModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "car Removed" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}
//removeExpense
const removeExpense = async (req, res) => {
    try {
        const expense = await expenseModel.findById(req.body.id);


        await expenseModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "expense Removed" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

//one car item
const getOneCar = async (req, res) => {
    try {
        const car = await carModel.findById(req.params.id);
        if (!car) return res.status(404).json({ error: "Car not found" });
        res.json(car);
    } catch (error) {
        res.status(500).json({ error: "Error fetching car item" });
    }
}
//getOneExpense
const getOneExpense = async (req, res) => {
    try {
        const expense = await expenseModel.findById(req.params.id);
        if (!expense) return res.status(404).json({ error: "expense not found" });
        res.json(expense);
    } catch (error) {
        res.status(500).json({ error: "Error fetching expense item" });
    }
}
//updateExpense
const updateExpense = async (req, res) => {

    try {
        // البحث عن العنصر الحالي
        const existingExpense = await expenseModel.findById(req.params.id);
        if (!existingExpense) {
            return res.status(404).json({ error: "Expense not found" });
        }
        // تحديث البيانات
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

        res.json({ success: true, message: "Expense updated successfully!", updatedExpense });
    } catch (error) {
        console.error("Update error:", error);
        res.status(500).json({ error: "Error updating Expense item" });
    }
};

//update car item
// 🛠 تحديث سيارة وصورها
const updateCar = async (req, res) => {
    try {
      const { id } = req.params;
      const car = await carModel.findById(id);
      if (!car) return res.status(404).json({ success: false, message: "السيارة غير موجودة" });
  
      const { state, name, description, price, year } = req.body;
  
      // حذف الصور القديمة من Cloudinary إذا تم رفع صور جديدة
      if (req.files && req.files.length > 0 && car.images && car.images.length > 0) {
        for (const img of car.images) {
          await cloudinary.uploader.destroy(img.public_id);
        }
      }
  
      // رفع الصور الجديدة
      let updatedImages = car.images;
      if (req.files && req.files.length > 0) {
        updatedImages = [];
        for (const file of req.files) {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: "cars"
          });
          updatedImages.push({
            url: result.secure_url,
            public_id: result.public_id
          });
        }
      }
  
      car.state = state || car.state;
      car.name = name || car.name;
      car.description = description || car.description;
      car.price = price || car.price;
      car.year = year || car.year;
      car.images = updatedImages;
  
      await car.save();
      res.json({ success: true, message: "تم التحديث", data: car });
    } catch (error) {
      res.status(500).json({ success: false, message: "فشل في التحديث", error });
    }
  };



export { addCar, listCar, removeCar, getOneCar, updateCar ,addExpense,getOneExpense,updateExpense,listExpense,removeExpense,getCarsByDate,getExpenseByDate,listExpenseCar}