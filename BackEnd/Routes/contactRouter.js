import express from "express"
import { addContactMessage, listContactMessages } from "../Controllers/contactController.js"

const contactRouter = express.Router();

contactRouter.post("/add", addContactMessage)
contactRouter.get("/list", listContactMessages)

export default contactRouter;