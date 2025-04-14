import express from "express"
import { addToCart,removeFromCart,getCart } from "../controllers/cartController.js"
import authMiddeleware from "../middeleware/auth.js"
const cartRouter = express.Router();

cartRouter.post("/add",authMiddeleware,addToCart)
cartRouter.post("/remove",authMiddeleware,removeFromCart)
cartRouter.post("/get",authMiddeleware,getCart)

export default cartRouter;