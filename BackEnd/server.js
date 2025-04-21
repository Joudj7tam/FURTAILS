import express from "express"
import cors from "cors"
import dotenv from 'dotenv';
import { connectDB } from "./config/db.js";
import contactRouter from "./Routes/contactRouter.js";
import ordersRouter from "./Routes/ordersRouter.js"; 
import loginRouter from "./Routes/loginRouter.js";
import userRoutes from "./Routes/userRoutes.js";
import petRoutes from "./Routes/petRoutes.js";

// app config
dotenv.config();
const app = express();
const port = 5000

// middleware
app.use(express.json());
app.use(cors());

// DB connection 
connectDB();

// api endpoints
app.use("/api/contact", contactRouter)
app.use("/api/order", ordersRouter)
app.use("/api/login", loginRouter)
app.use('/api/users', userRoutes);
app.use('/api/pets', petRoutes);
  
// test the api
app.get("/", (req,res)=>{
    res.send("API Working")
})

// Start server
app.listen(port,() => {
    console.log(`Server is running on http://localhost:${port}`);
});