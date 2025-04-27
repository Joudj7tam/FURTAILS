// models/User.js
import mongoose from 'mongoose'; 

const userSchema = new mongoose.Schema({
  // Full Name
  firstName: { type: String },
  lastName: { type: String },

  // Login Info
  email: { type: String, unique: true },
  password: { type: String},

  // Account Info
  contactMethod: { type: String, enum: ['Email', 'Phone'], default: 'Email' },
  memberSince: { type: Date, default: Date.now },

  // Personal Info
  phoneNumber: { type: String },
  location: { type: String },

  // Language, DOB 
  DOB: { type: Date },
  language: { type: String, enum: ['English', 'Arabic', 'French']},

  // Pet list 
  pets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Pet' }],
  petsCount: { type: Number, default: 0 },  // Field to track the number of pets

  // Cart items 
  cart: [
    {
      serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Grooming' },
      quantity: { type: Number, required: true, default: 1 }
    }
  ],
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
