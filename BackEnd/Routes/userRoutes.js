import express from 'express';
import { getUserProfile, updateUserProfile,createUser } from '../Controllers/userController.js';


const router = express.Router();

router.post('/', createUser); 
router.get('/me', getUserProfile);
router.put('/me', updateUserProfile);


export default router;
