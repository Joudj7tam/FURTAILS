import express from "express";
import { addFoodingItem, getMeals, getTreats } from "../Controllers/foodingController.js";

const router = express.Router();

router.post("/", addFoodingItem);
router.get("/meals", getMeals);
router.get("/treats", getTreats);

export default router;
