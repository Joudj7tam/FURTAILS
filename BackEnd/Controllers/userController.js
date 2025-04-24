import User from "../Models/User.js";

// @desc    Add new user
const createUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      username,
      preferredContact,
      location
    } = req.body;

    const user = new User({
      firstName,
      lastName,
      email,
      phone,
      password,
      username,
      preferredContact,
      location,
      memberSince: new Date()
    });

    await user.save();
    res.status(201).json({ success: true, data: user });

  } catch (error) {
    console.error("User creation error:", error.message);
    res.status(400).json({ success: false, message: "Failed to create user" });
  }
};

// @desc    Get user's profile by email with populated pets list
const getUserProfile = async (req, res) => {
  try {
    const userEmail = req.query.email || req.body.email;
    const user = await User.findOne({ email: userEmail })
      .select("-password")  // Exclude the password field
      .populate("pets");    // Populate the pets field

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error getting profile" });
  }
};

// @desc    Update user's profile by email
const updateUserProfile = async (req, res) => {
  try {
    const userEmail = req.query.email || req.body.email;

    const updates = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phone: req.body.phone,
      location: req.body.location,
      password: req.body.password,
      username: req.body.username,
      preferredContact: req.body.preferredContact
    };

    const user = await User.findOneAndUpdate({ email: userEmail }, updates, {
      new: true,
    }).select("-password");

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ message: "Failed to update user" });
  }
};

// @desc    Add a pet to the user's profile
const addPetToUserProfile = async (req, res) => {
  try {
    const userEmail = req.query.email || req.body.email;
    const petId = req.body.petId; // The petId to link to the user

    const user = await User.findOne({ email: userEmail });

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // Add the petId to the pets array in the user's profile
    user.pets.push(petId);
    await user.save();

    res.json({ success: true, message: "Pet added to user profile", data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error adding pet to profile" });
  }
};

export { createUser, getUserProfile, updateUserProfile,addPetToUserProfile };
