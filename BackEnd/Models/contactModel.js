import mongoose from "mongoose"

const contactSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    DOB: { type: Date, required: true },
    language: { type: String, enum: ['English', 'Arabic', 'French'], required: true },
    gender: { type: String, enum: ['Male', 'Female'], required: true },
    message: { type: String, required: true }
  });

  const contactModel = mongoose.models.contact || mongoose.model("contact", contactSchema)

  export default contactModel;