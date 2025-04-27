import Pet from "../Models/Pet.js";
import User from "../Models/User.js";  // Import the User model
// @desc    Add new pet
const addPet = async (req, res) => {
  const { name, type, breed, birthDate, sex, healthProblem, userEmail } = req.body;
  const petPhoto = req.file?.filename;

  // Validate required fields
  if (!name || !type || !breed || !birthDate || !sex || !healthProblem ||  !userEmail || !petPhoto) {
    return res.status(400).json({
      success: false, 
      message: "All fields (including photo) are required." 
    });
  }

  // Calculate age from birthDate
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  try {
    const pet = new Pet({ 
      name, 
      type, 
      breed, 
      birthDate,
      sex,
      healthProblem,
      age, 
      owner: userEmail, 
      petPhoto 
    });
    
    // Save the pet
    await pet.save();

    // Now update the user's pets array by adding the new pet's ID
    const user = await User.findOneAndUpdate(
      { email: userEmail }, // Find the user by email
      { 
        $push: { pets: pet._id }, // Push the pet's ID into the user's pets array
        $inc: { petsCount: 1 } // Increment the petsCount by 1
      },
      { new: true }
    );

    res.json({ 
      success: true,
      message: "Pet added successfully",
      data: pet,
      petsCount: user.petsCount // Return the updated petsCount
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to add pet",
      error: error.message 
    });
  }
};

// @desc    Get all pets of a specific user
const getMyPets = async (req, res) => {
  const ownerEmail = req.params.ownerEmail;

  try {
    const pets = await Pet.find({ owner: ownerEmail });
    res.json({ success: true, data: pets });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch pets' });
  }
};

// @desc    Update pet by ID
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

// @desc    Delete pet by ID
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

// @desc    Get pet by ID
const getPetById = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) {
      return res.status(404).json({ success: false, message: "Pet not found" });
    }
    res.json({ success: true, data: pet });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch pet" });
  }
};

export { getMyPets, updatePet, deletePet, addPet, getPetById };
