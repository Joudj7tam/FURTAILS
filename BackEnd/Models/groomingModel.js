import mongoose from "mongoose";

const groomingSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    description: {
      type: [String],
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    photo: {
      type: String, // Example: "shower.jpeg" or "/images/spa.jpeg"
      
    }});

      const groomingModel = mongoose.models.Grooming || mongoose.model("Grooming", groomingSchema)
    
      export default groomingModel;