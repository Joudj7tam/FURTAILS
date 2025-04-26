import mongoose from "mongoose";

const petSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  breed: { type: String, required: true },
  age: { type: Number, required: true },
  birthDate: { type: Date, required: true },      
  sex: { type: String, enum: ['Male', 'Female'], required: true }, 
  healthProblem: { type: String, default: 'None' },
  owner: { type: String, required: true },
  petPhoto: { type: String, required: true },
}); 

const Pet = mongoose.models.Pet || mongoose.model("Pet", petSchema);

export default Pet;
