import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js"
import carRouter from "./routes/carRoute.js"
import userRouter from "./routes/userRoute.js";
import "dotenv/config";
import cartRouter from "./routes/cartRoute.js";
import saleRouter from "./routes/saleRoute.js";
import reviewRoutes from "./routes/reviewRoutes.js";


//app config
const app =express()
const port = process.env.PORT
//middeleware
app.use(express.json())
// ✅ السماح فقط لموقع GitHub Pages
const allowedOrigins = [
    "http://localhost:5173",
    "https://deluxe-auto-one.vercel.app",
    "https://nizarnaser.github.io"
  ];
app.use(cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }));
app.use(express.urlencoded({ extended: true }));
//db connection
connectDB();

//api endpoints

app.use("/api/car",carRouter)
app.use("/api/user",userRouter);
app.use("/api/cart",cartRouter);
app.use("/api/sale",saleRouter);
app.use('/api/reviews', reviewRoutes);
app.get("/",(req,res)=>{
    res.send("API Working")

})



app.listen(port,()=>{
    console.log(`Server Started on http://localhost:${port} `)
    
})

