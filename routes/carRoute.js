import express from "express"
import {
  addCar,
  listCar,
  removeCar,
  getOneCar,
  updateCar,
  addExpense,
  getOneExpense,
  updateExpense,
  listExpense,
  removeExpense,
  getCarsByDate,
  getExpenseByDate,
  listExpenseCar
} from "../controllers/carController.js"

import multer from "multer"
import { storage } from "../config/cloudinary.js" // ✅ التخزين السحابي

const upload = multer({ storage })
const carRoute = express.Router()

// ✅ تعديل ليدعم رفع عدة صور
carRoute.post("/add", upload.array("images", 10), addCar)
carRoute.put("/update-item/:id", upload.array("images", 10), updateCar)

carRoute.get("/one-item/:id", getOneCar)
carRoute.get("/list", listCar)
carRoute.post("/remove", removeCar)
carRoute.get("/car-by-date", getCarsByDate)

// 🧾 مصاريف
carRoute.post("/add-expense", addExpense)
carRoute.get("/one-expense/:id", getOneExpense)
carRoute.put("/update-expense/:id", updateExpense)
carRoute.get("/list-expense", listExpense)
carRoute.post("/remove-expense", removeExpense)
carRoute.get("/expense-by-date", getExpenseByDate)
carRoute.get("/list-car-expense/:id", listExpenseCar)

export default carRoute
