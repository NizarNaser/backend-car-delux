import express from "express"
import { addCar, listCar, removeCar, getOneCar, updateCar ,addExpense,getOneExpense,updateExpense,listExpense,removeExpense,getCarsByDate,getExpenseByDate,listExpenseCar} from "../controllers/carController.js"
import multer from "multer"
import { storage } from "../config/cloudinary.js"; // ✅ استخدم التخزين السحابي


const upload = multer({storage})
const carRoute = express.Router();
carRoute.post("/add", upload.single("image"), addCar);
  carRoute.get("/one-item/:id",getOneCar)
  carRoute.put("/update-item/:id",upload.single("image"),updateCar)
  carRoute.get("/list",listCar)
  carRoute.post("/remove",removeCar)
  // جلب السيارات حسب تاريخ الإنشاء (createdAt)
  carRoute.get("/car-by-date", getCarsByDate);
// مثال: http://localhost:5000/api/cars/by-date?start=2025-04-01&end=2025-04-08

  //expenses
  carRoute.post("/add-expense", addExpense);
  carRoute.get("/one-expense/:id",getOneExpense)
  carRoute.put("/update-expense/:id",updateExpense)
  carRoute.get("/list-expense",listExpense)
  carRoute.post("/remove-expense",removeExpense)
  carRoute.get("/expense-by-date", getExpenseByDate);
  carRoute.get("/list-car-expense/:id", listExpenseCar);



export default carRoute;

