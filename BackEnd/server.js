import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { connectDB } from "./config/db.js";

// Route imports
import contactRouter from "./Routes/contactRouter.js";
import ordersRouter from "./Routes/ordersRouter.js";
import loginRouter from "./Routes/loginRouter.js";
import userRoutes from "./Routes/userRoutes.js";
import petRoutes from "./Routes/petRoutes.js";
import foodingRoute from "./Routes/foodingRoute.js"; 
import groomingRoute from "./Routes/groomingRoute.js";
// App config
dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

// DB connection
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads")); // Serve uploaded images
app.use('/uploads/grooming', express.static('uploads/grooming'));

// API routes
app.use("/api/contact", contactRouter);
app.use("/api/order", ordersRouter);
app.use("/api/login", loginRouter);
app.use("/api/users", userRoutes);
app.use("/api/pets", petRoutes);
app.use("/api/fooding", foodingRoute); 
app.use("/api/grooming", groomingRoute);
// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Start server
app.listen(port, () => {
  console.log(`Server running at: http://localhost:${port}`);
});
