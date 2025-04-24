import express from "express";
import { addFoodingItem, getMeals, getTreats } from "../Controllers/foodingController.js";
import uploads from '../middleware/upload.js';

const router = express.Router();

router.post("/add",uploads.single('photo'), addFoodingItem);
router.get("/meals", getMeals);
router.get("/treats", getTreats);

export default router;
