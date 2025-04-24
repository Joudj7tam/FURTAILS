import express from "express"
import { addGroomingService, getGroomingServices } from "../Controllers/groomingController.js";

const router = express.Router();

router.post("/add", addGroomingService);

router.get("/list", getGroomingServices);

export default router;