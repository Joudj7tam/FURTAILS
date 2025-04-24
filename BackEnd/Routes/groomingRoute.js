import express from "express"
import { addGroomingService, getGroomingServices } from "../Controllers/groomingController.js";
import uploads from '../middleware/upload.js';

const router = express.Router();

router.post("/add",uploads.single('photo'), addGroomingService);

router.get("/list", getGroomingServices);

export default router;