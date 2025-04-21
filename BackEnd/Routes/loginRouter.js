import express from "express";
import { signUp, signIn, resetPassword } from "../Controllers/loginController.js";

const loginRouter = express.Router();

loginRouter.post("/signUp", signUp);
loginRouter.post("/signIn", signIn);
loginRouter.post("/resetPassword", resetPassword);


export default loginRouter;