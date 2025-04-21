import mongoose from "mongoose";

const loginSchema = new mongoose.Schema({
    email: { type: String, required: true },
    phoneNum: { type: Number, required: true },
    password: { type: String, required: true },
  },
);

const loginModel = mongoose.models.login || mongoose.model("login", loginSchema);

export default loginModel;