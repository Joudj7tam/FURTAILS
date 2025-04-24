import mongoose from "mongoose";


const foodingSchema = new mongoose.Schema({
    type: {
      type: String,
      enum: ['Meal', 'Treat'],
      required: true
    },
    name: {
      type: String,
      required: true
    },
    condition: {
      type: String, // For meals (e.g., Obesity, Diabetes), optional for treats
      default: ''
    },
    description: {
      type: String,
      required: true
    },
    suggestedRecipe: {
      type: String, // Only for meals
      default: ''
    },
    ingredients: {
      type: [String], // Array of ingredient names
      default: []
    },
    price: {
      type: Number,
      required: true,
      min: 0
    }
  });

const Fooding = mongoose.model("Fooding", foodingSchema);
export default Fooding;
