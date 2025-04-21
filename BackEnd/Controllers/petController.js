import Pet from "../models/Pet.js";

// @desc    Add new pet (Test mode)
const addPet = async (req, res) => {
  const { name, type, breed, age, owner } = req.body;

  const pet = new Pet({ name, type, breed, age, owner });

  try {
    await pet.save();
    res.json({ success: true, message: "Pet added", data: pet });
  } catch (error) {
    res.status(400).json({ success: false, message: "Failed to add pet" });
  }
};

// @desc    Get all pets of a specific user (Test mode)
const getMyPets = async (req, res) => {
  const { owner } = req.body;

  try {
    const pets = await Pet.find({ owner });
    res.json({ success: true, data: pets });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch pets' });
  }
};

// @desc    Get a single pet by ID
const getPetById = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    
    if (!pet) {
      return res.status(404).json({ success: false, message: 'Pet not found' });
    }

    res.json({ success: true, data: pet });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching pet', error: err.message });
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

export { addPet, getMyPets, updatePet, deletePet,getPetById };
