import User from "../models/User.js";


// @desc    Add new user
const createUser = async (req, res) => {
  try {
    const { firstName, lastName, DOB, language, gender, message } = req.body;

    const user = new User({
      firstName,
      lastName,
      DOB,
      language,
      gender,
      message
    });

    await user.save();
    res.status(201).json({ success: true, data: user });

  } catch (error) {
    console.error("User creation error:", error.message);
    res.status(400).json({ success: false, message: "Failed to create user" });
  }
};



// @desc    Get user's profile (TEST version)
const getUserProfile = async (req, res) => {
  try {
    const userId = req.query.id || req.body.id;
    const user = await User.findById(userId).select("-password");

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error getting profile" });
  }
};


const updateUserProfile = async (req, res) => {
  try {
    const userId = req.query.id || req.body.id;

    const updates = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      language: req.body.language,
      gender: req.body.gender,
      message: req.body.message,
    };

    
// no athu
    const user = await User.findByIdAndUpdate(userId, updates, {
      new: true,
    }).select("-password");

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ message: "Failed to update user" });
  }
};


export { getUserProfile, updateUserProfile,createUser };
