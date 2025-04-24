import mongoose from "mongoose"

const contactSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    DOB: { type: Date, required: true },
    language: { type: String, required: true }, 
    gender: { type: String, required: true } ,
    message: { type: String, required: true }
  });

  const contactModel = mongoose.models.contact || mongoose.model("contact", contactSchema)

  export default contactModel;