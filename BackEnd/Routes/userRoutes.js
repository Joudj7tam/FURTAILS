import express from 'express';
import { getUserProfile, updateUserProfile,createUser,addPetToUserProfile } from '../Controllers/userController.js';


const router = express.Router();

router.post('/', createUser); 
router.get('/me', getUserProfile);
router.put('/me', updateUserProfile);
router.post("/addPet", addPetToUserProfile);


export default router;
