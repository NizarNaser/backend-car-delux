import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js"
import carRouter from "./routes/carRoute.js"
import userRouter from "./routes/userRoute.js";
import "dotenv/config";
import cartRouter from "./routes/cartRoute.js";
import saleRouter from "./routes/saleRoute.js";

//app config
const app =express()
const port = process.env.PORT

//middeleware
app.use(express.json())
// ✅ السماح فقط لموقع GitHub Pages
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  }));
app.use(express.urlencoded({ extended: true }));
//db connection
connectDB();

//api endpoints

app.use("/api/car",carRouter)
app.use("/api/user",userRouter);
app.use("/api/cart",cartRouter);
app.use("/api/sale",saleRouter);
app.get("/",(req,res)=>{
    res.send("API Working")

})



app.listen(port,()=>{
    console.log(`Server Started on http://localhost:${port} `)
    
})

