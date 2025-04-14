import express from "express"
import { addSale ,listSale,removeSale,updateSale,getOneSale,getSaleByDate} from "../controllers/saleController.js"

const saleRouter = express.Router();

saleRouter.post("/add-sale", addSale);
saleRouter.get("/one-sale/:id",getOneSale)
saleRouter.get("/list-sale",listSale)
saleRouter.post("/remove-sale",removeSale)
saleRouter.put("/update-sale/:id",updateSale)
saleRouter.get("/sale-by-date", getSaleByDate);




export default saleRouter;