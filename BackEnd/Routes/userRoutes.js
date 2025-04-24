import express from 'express';
import { getUserProfile, updateUserProfile,createUser,addPetToUserProfile, addToCart, removeFromCart, getCartByEmail } from '../Controllers/userController.js';


const router = express.Router();

router.post('/', createUser); 
router.get('/me', getUserProfile);
router.put('/me', updateUserProfile);
router.post("/addPet", addPetToUserProfile);
router.post("/addToCart", addToCart);
router.post("/removeFromCart", removeFromCart);
router.get('/cart-by-email', getCartByEmail);


export default router;
