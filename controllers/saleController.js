import saleModel from "../models/saleModel.js";


//add sale item

const addSale = async (req, res) => {
    try {
        const {
            car_id,
            state,
            name,
            description,
            price
        } = req.body;

        if (
           !state || !name || !description || !price
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields except car_id are required"
            });
        }

        const newSale = new saleModel({
            car_id, // هذا السطر سيكون الآن داخل الدالة وبالتالي لا خطأ
            state,
            name,
            description,
            price: Number(price)
        });

        await newSale.save();

        res.status(201).json({
            success: true,
            message: "Sale added successfully",
            data: newSale
        });

    } catch (error) {
        console.error("Error in addSale:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

//all sale list
const listSale = async (req,res) => {
    try {
        const sales = await saleModel.find();

        res.json({success:true,data:sales});

    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})

    }
}
// دالة للحصول على السيارات ضمن فترة زمنية محددة
const getSaleByDate = async (req, res) => {
    try {
      const { start, end ,state} = req.query;
  
      // التحقق من وجود التاريخين
      if (!start || !end || !state) {
        return res.status(400).json({ message: "يرجى تحديد تاريخ البداية والنهاية والحالة (state)" });
      }
  
      // جلب السيارات التي تم إنشاؤها بين التاريخين
      const cars = await saleModel.find({
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
//remove sale 
const removeSale = async (req,res) => {
  try {
    const sale = await saleModel.findById(req.body.id);


    await saleModel.findByIdAndDelete(req.body.id);
    res.json({success:true,message:"sale Removed"});

  } catch (error) {
    console.log(error);
        res.json({success:false,message:"Error"})
  }
}
//one sale item
const getOneSale = async (req,res) => {
    try {
        const sale = await saleModel.findById(req.params.id);
        if (!sale) return res.state(404).json({ error: "sale not found" });
        res.json(sale);
      } catch (error) {
        res.status(500).json({ error: "Error fetching sale item" });
      }
}

//update sale
const updateSale = async (req, res) => {

    try {
        // البحث عن العنصر الحالي
        const existingExpense = await saleModel.findById(req.params.id);
        if (!existingExpense) {
            return res.status(404).json({ error: "Expense not found" });
        }
        // تحديث البيانات
        const updatedExpense = await saleModel.findByIdAndUpdate(
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

        res.json({ success: true, message: "sale updated successfully!", updatedExpense });
    } catch (error) {
        console.error("Update error:", error);
        res.status(500).json({ error: "Error updating sale item" });
    }
};

export {addSale ,listSale,removeSale,updateSale,getOneSale,getSaleByDate}