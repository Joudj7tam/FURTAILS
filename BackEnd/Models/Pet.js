import mongoose from "mongoose";

const petSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  breed: { type: String, required: true },
  age: { type: Number, required: true },
  owner: { type: String, required: true },
  petPhoto: { type: String, required: true },
}); 

const Pet = mongoose.models.Pet || mongoose.model("Pet", petSchema);

export default Pet;
