import express from "express";
import { signUp, signIn, resetPassword } from "../Controllers/loginController.js";
import { createUser } from '../Controllers/userController.js';

const loginRouter = express.Router();

loginRouter.post("/signUp", signUp, createUser);
loginRouter.post("/signIn", signIn);
loginRouter.post("/resetPassword", resetPassword);


export default loginRouter;