import Pet from "../Models/Pet.js";
import multer from 'multer';
import path from 'path';

// @desc    Add new pet (Test mode 
const addPet = async (req, res, next) => {
  const { name, type, breed, age, userEmail } = req.body; // Changed from owner to ownerEmail
  const petPhoto = req.file?.filename;

  // Validate required fields
  if (!name || !type || !breed || !age || !userEmail || !petPhoto) {
    return res.status(400).json({ 
      success: false, 
      message: "All fields (including photo) are required" 
    });
  }

  try {
    const pet = new Pet({ 
      name, 
      type, 
      breed, 
      age, 
      owner: userEmail, // Store email directly
      petPhoto 
    });
    
    await pet.save();

    req.petName = name;
    req.userEmail = userEmail;
  
    next(); 

  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to add pet",
      error: error.message 
    });
  }
};

// @desc    Get all pets of a specific user (Test mode)
const getMyPets = async (req, res) => {
  const ownerEmail = req.params.ownerEmail; // Changed from ownerId to ownerEmail

  try {
    const pets = await Pet.find({ owner: ownerEmail }); // Find by email
    res.json({ success: true, data: pets });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch pets' });
  }
};


// @desc    Update pet by ID (Test mode)
const updatePet = async (req, res) => {
  const { owner } = req.body;

  try {
    const pet = await Pet.findOneAndUpdate(
      { _id: req.params.id, owner },
      req.body,
      { new: true }
    );

    if (!pet) return res.status(404).json({ message: 'Pet not found' });

    res.json({ success: true, message: 'Pet updated', data: pet });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update pet' });
  }
};

// @desc    Delete pet by ID (Test mode)
const deletePet = async (req, res) => {
  const { owner } = req.body;

  try {
    const pet = await Pet.findOneAndDelete({ _id: req.params.id, owner });

    if (!pet) return res.status(404).json({ message: 'Pet not found' });

    res.json({ success: true, message: 'Pet deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete pet' });
  }
};

export { addPet, getMyPets, updatePet, deletePet };
