import mongoose from "mongoose";

const ordersSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: Number, required: true },
    country: { type: String, required: true },
    phone: { type: Number, required: true },
    pet: { type: String, required: true },
    date: { type: Date, default: Date.now },
    cartData: { type: mongoose.Schema.Types.Mixed, default: {} },
    totalPrice: { type: Number, required: true },
  },
  { minimize: false }
);

const orderModel = mongoose.models.order || mongoose.model("order", ordersSchema)

export default orderModel;