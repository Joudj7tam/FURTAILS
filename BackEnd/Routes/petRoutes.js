import express from 'express';
import upload from '../middleware/upload.js';
import { addPet, getMyPets, updatePet, deletePet, getPetById } from '../Controllers/petController.js';

const router = express.Router();

router.post('/add', upload.single('petPhoto'), addPet);
router.get('/user/:ownerId', getMyPets);
router.get('/:id', getPetById); 
router.put('/:id', updatePet);
router.delete('/:id', deletePet);

export default router;
