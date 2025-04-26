import express from 'express';
import upload from '../middleware/upload.js';
import { addPet, getMyPets, updatePet, deletePet, getPetById} from '../Controllers/petController.js';
import { addPetToUserProfile } from '../Controllers/userController.js';

const router = express.Router();

router.post('/add', upload.single('petPhoto'), addPet, addPetToUserProfile);
router.get('/:id', getPetById);  // ✅ already exists!
router.get('/user/:ownerEmail', getMyPets);
router.put('/:id', updatePet);
router.delete('/:id', deletePet);
export default router;
