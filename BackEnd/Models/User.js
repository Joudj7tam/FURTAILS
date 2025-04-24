// models/User.js
import mongoose from 'mongoose'; 

const userSchema = new mongoose.Schema({
  // Full Name
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },

  // Login Info
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  // Account Info
  contactMethod: { type: String, enum: ['Email', 'Phone'], default: 'Email' },
  memberSince: { type: Date, default: Date.now },

  // Personal Info
  phoneNumber: { type: String },
  location: { type: String },

  // Language, DOB 
  DOB: { type: Date, required: true },
  language: { type: String, enum: ['English', 'Arabic', 'French'], required: true },

  // Pet list (will be populated later)
  pets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Pet' }],

  // Cart items (storing product details like productId, quantity, etc.)
  cart: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
