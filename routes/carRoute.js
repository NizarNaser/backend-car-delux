import express from "express"
import { addCar ,listCar,removeCar,getOneCar,updateCar,addExpense,getOneExpense,updateExpense,listExpense,removeExpense,getCarsByDate,getExpenseByDate,listExpenseCar} from "../controllers/carController.js"
import path from "path"
import multer from "multer"
import fs from "fs"

const carRouter = express.Router();
// إنشاء مجلد `uploads` تلقائيًا إذا لم يكن موجودًا
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
// Image Storage Engine

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        
        cb(null,"uploads/")},
    filename:(req,file,cb)=>{
        cb(null, Date.now() +path.extname(file.originalname));
    }
})

const upload = multer({storage})
carRouter.post("/add", upload.single("image"), (req, res, next) => {
    
    if (!req.file) {
      return res.state(400).json({ error: "No image uploaded in middleware" });
    }
    next();
  }, addCar);
  carRouter.get("/one-item/:id",getOneCar)
  carRouter.put("/update-item/:id",upload.single("image"),updateCar)
  carRouter.get("/list",listCar)
  carRouter.post("/remove",removeCar)
  // جلب السيارات حسب تاريخ الإنشاء (createdAt)
  carRouter.get("/car-by-date", getCarsByDate);
// مثال: http://localhost:5000/api/cars/by-date?start=2025-04-01&end=2025-04-08

  //expenses
  carRouter.post("/add-expense", addExpense);
  carRouter.get("/one-expense/:id",getOneExpense)
  carRouter.put("/update-expense/:id",updateExpense)
  carRouter.get("/list-expense",listExpense)
  carRouter.post("/remove-expense",removeExpense)
  carRouter.get("/expense-by-date", getExpenseByDate);
  carRouter.get("/list-car-expense/:id", listExpenseCar);
carRouter.use("/uploads",express.static("uploads"));



export default carRouter;

