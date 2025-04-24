import User from "../Models/User.js";
import groomingModel from "../Models/groomingModel.js";
import Fooding from "../Models/foodModel.js";

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

const addToCart = async (req, res) => {
  const { email, serviceId } = req.body;

  try {
    // Validate input
    if (!email || !serviceId) {
      return res.status(400).json({
        success: false,
        message: "Email and serviceId are required"
      });
    }

    // Check if the service exists in either grooming or food models
    const groomingService = await groomingModel.findById(serviceId);
    const foodService = await Fooding.findById(serviceId);

    if (!groomingService && !foodService) {
      return res.status(404).json({
        success: false,
        message: "Service not found in either grooming or food services"
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Check if service already in cart
    const itemIndex = user.cart.findIndex(
      item => item.serviceId.toString() === serviceId
    );

    if (itemIndex > -1) {
      // Increment quantity if already in cart
      user.cart[itemIndex].quantity += 1;
    } else {
      // Add new item to cart
      // When adding to cart:
      user.cart.push({
        serviceId,
        quantity: 1,
        serviceType: groomingService ? 'grooming' : 'food'
      });
    }

    await user.save();

    res.json({
      success: true,
      message: "Service added to cart",
      cart: user.cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding to cart",
      error: error.message
    });
  }
};

const removeFromCart = async (req, res) => {
  const { email, serviceId } = req.body;

  try {
    // Validate input
    if (!email || !serviceId) {
      return res.status(400).json({ 
        success: false, 
        message: "Email and serviceId are required" 
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    // Find the item in cart
    const itemIndex = user.cart.findIndex(
      item => item.serviceId.toString() === serviceId
    );

    if (itemIndex > -1) {
      if (user.cart[itemIndex].quantity > 1) {
        // Decrement quantity
        user.cart[itemIndex].quantity -= 1;
      } else {
        // Remove item from cart
        user.cart.splice(itemIndex, 1);
      }

      await user.save();

      res.json({ 
        success: true, 
        message: "Service updated in cart", 
        cart: user.cart 
      });
    } else {
      res.status(400).json({ 
        success: false, 
        message: "Item not in cart" 
      });
    }
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Error removing from cart", 
      error: error.message 
    });
  }
};

// Add this to userController.js
const getCartByEmail = async (req, res) => {
  try {
      const { email } = req.query;
      
      if (!email) {
          return res.status(400).json({ success: false, message: "Email is required" });
      }

      const user = await User.findOne({ email })
          .populate({
              path: 'cart.serviceId',
              model: 'Grooming'
          })
          .populate({
              path: 'cart.serviceId',
              model: 'Fooding'
          });

      if (!user) {
          return res.status(404).json({ success: false, message: "User not found" });
      }

      const cartItems = user.cart
          .filter(item => item.serviceId)
          .map(item => ({
              _id: item.serviceId._id,
              name: item.serviceId.name,
              price: item.serviceId.price,
              quantity: item.quantity,
              type: item.serviceType,
              image: item.serviceId.photo || 'pet-grooming.png'
          }));

      res.json({
          success: true,
          items: cartItems,
          count: cartItems.reduce((total, item) => total + item.quantity, 0)
      });
  } catch (error) {
      res.status(500).json({
          success: false,
          message: "Error fetching cart",
          error: error.message
      });
  }
};


export { createUser, getUserProfile, updateUserProfile, addPetToUserProfile, addToCart, removeFromCart, getCartByEmail };
