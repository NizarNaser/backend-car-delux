import carModel from "../models/carModel.js";
import expenseModel from "../models/expenseModel.js";
import fs from "fs"
import { cloudinary } from "../config/cloudinary.js"; // ✅ استورد Cloudinary


//add car item
const addCar = async (req, res) => {
    console.log("–– BODY ––", req.body);
console.log("–– FILE ––", req.file);
    // تحقق من وجود الصورة في الطلب
    if (!req.file) {
        return res.status(400).json({ success: false, message: "No image uploaded" });
    }

    // معالجة بيانات الطعام
    const imageUrl = req.file.path; // مسار الصورة، تأكد من أنه صالح
    const publicId = req.file.filename; // يجب أن يكون لديك ملف فريد من نوعه
    const {state, name, name_de, name_ar ,marka ,description ,description_de ,description_ar ,price ,year} = req.body;

    // تأكد من وجود البيانات المطلوبة
    if (!state || !name || !name_de || !name_ar || !marka || !description || !description_de || !description_ar  || !price || !year) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const car = new carModel({
        state: req.body.state,
        name: req.body.name,
        name_de: req.body.name_de,
        name_ar: req.body.name_ar,
        marka: req.body.marka,
        description: req.body.description,
        description_de: req.body.description_de,
        description_ar: req.body.description_ar,
        price: req.body.price,
        year: req.body.year,
        image: imageUrl,
    })

    try {
        // حفظ الطعام في قاعدة البيانات
        await car.save();
        res.json({ success: true, message: "car added successfully" });
    } catch (error) {
        console.error("Error adding car:", error); // سجّل الخطأ لتتبعه
        res.status(500).json({ success: false, message: "Error saving car", error: error.message });
    }
};


// addExpense


const addExpense = async (req, res) => {
    try {
        const {
            car_id,
            state,
            name,
            name_de,
            name_ar,
            description,
            description_de,
            description_ar,
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
            name_de,
            name_ar,
            description,
            description_de,
            description_ar,
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
        if (!car) return res.state(404).json({ error: "Car not found" });
        res.json(car);
    } catch (error) {
        res.status(500).json({ error: "Error fetching car item" });
    }
}
//getOneExpense
const getOneExpense = async (req, res) => {
    try {
        const expense = await expenseModel.findById(req.params.id);
        if (!expense) return res.state(404).json({ error: "expense not found" });
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
                name_de: req.body.name_de,
                name_ar: req.body.name_ar,
                description: req.body.description,
                description_de: req.body.description_de,
                description_ar: req.body.description_ar,
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
const updateCar = async (req, res) => {
   
    try {
          // البحث عن العنصر الحالي
          const existingCat = await carModel.findById(req.params.id);
          if (!existingCat) {
              return res.status(404).json({ error: "car not found" });
          }

        let imageUrl = existingCat.image;
        let imagePublicId = existingCat.image_public_id;

        if (req.file) {
            // حذف الصورة القديمة من Cloudinary
            if (imagePublicId) {
                await cloudinary.uploader.destroy(imagePublicId);
            }

            // تخزين الجديدة
            imageUrl = req.file.path;
            imagePublicId = req.file.filename;
        }

        const updatedCat = await carModel.findByIdAndUpdate(
            req.params.id,
            {
                state: req.body.state,
                name: req.body.name,
                name_de: req.body.name_de,
                name_ar: req.body.name_ar,
                marka: req.body.marka,
                description: req.body.description,
                description_de: req.body.description_de,
                description_ar: req.body.description_ar,
                price: req.body.price,
                year: req.body.year,
                image: image_filename,
            },
            { new: true }
        );

        res.json({ success: true, message: "car updated successfully!", updatedCat });
    } catch (error) {
        console.error("Update error:", error);
        res.status(500).json({ error: "Error updating car item" });
    }
};



export { addCar, listCar, removeCar, getOneCar, updateCar ,addExpense,getOneExpense,updateExpense,listExpense,removeExpense,getCarsByDate,getExpenseByDate,listExpenseCar}