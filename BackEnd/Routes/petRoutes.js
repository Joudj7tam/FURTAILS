import express from 'express';
import { addPet, getMyPets, updatePet, deletePet, getPetById } from '../Controllers/petController.js';


const router = express.Router();

router.post('/', addPet);
router.get('/', getMyPets);
router.get('/:id', getPetById); 
router.put('/:id', updatePet);
router.delete('/:id', deletePet);

export default router;
