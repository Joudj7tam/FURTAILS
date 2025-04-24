import Fooding from "../Models/foodModel.js"; // use this exact name!
import fs from 'fs';




// @desc Add new fooding item (meal or treat)
export const addFoodingItem = async (req, res) => {
  const { type, name, condition, description, suggestedRecipe, ingredients, price } = req.body;
  const photo = req.file?.path || ""; // ✅ get file path from multer

  try {
    const newItem = new Fooding({
      type,
      name,
      condition,
      description,
      suggestedRecipe,
      ingredients: Array.isArray(ingredients) ? ingredients : [ingredients],
      price,
      photo
    });

    const savedItem = await newItem.save();

    res.status(201).json({
      success: true,
      message: "Item added successfully",
      data: savedItem
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to add item",
      error: error.message
    });
  }
};

  
  
// Get only MEAL products
export const getMeals = async (req, res) => {
    try {
      const meals = await Fooding.find({ type: "Meal" });
      res.status(200).json(meals);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch meals", details: error.message });
    }
  };
  
  // Get only TREAT products
  export const getTreats = async (req, res) => {
    try {
      const treats = await Fooding.find({ type: "Treat" });
      res.status(200).json(treats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch treats", details: error.message });
    }
  };
  
