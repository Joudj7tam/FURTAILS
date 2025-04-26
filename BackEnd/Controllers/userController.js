import User from "../Models/User.js";
import groomingModel from "../Models/groomingModel.js";
import Fooding from "../Models/foodModel.js";

//create new user
const createUser = async (req, res) => {
  try {
    const {
      email,
      phoneNum, 
      password
    } = req.body;

    const user = new User({
      email,
      phoneNumber: phoneNum,
      password,
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
      .populate("pets",'name');    // Populate the pets field

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
  const { petName, userEmail } = req.body;
    
    const user = await User.findOne({ email: userEmail });

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // Add the petId to the pets array in the user's profile
    user.pets.push(petName);
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

    // First get user with basic cart items
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Process each cart item to get full details
    const items = await Promise.all(
      user.cart.map(async (cartItem) => {
        try {
          // Try to find as grooming service first
          let service = await groomingModel.findById(cartItem.serviceId);
          let type = 'grooming';
          
          // If not found as grooming, try as food item
          if (!service) {
            service = await Fooding.findById(cartItem.serviceId);
            type = 'food';
          }

          // If service found in either collection
          if (service) {
            return {
              _id: service._id,
              name: service.name,
              price: service.price,
              quantity: cartItem.quantity,
              type: type,
              image: service.photo || '/uploads/default.png'
            };
          }
          return null;
        } catch (err) {
          console.error(`Error processing cart item ${cartItem.serviceId}:`, err);
          return null;
        }
      })
    );

    // Filter out any null items
    const validItems = items.filter(item => item !== null);

    res.json({
      success: true,
      items: validItems,
      count: validItems.reduce((total, item) => total + item.quantity, 0)
    });
  } catch (error) {
    console.error("Error in getCartByEmail:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching cart",
      error: error.message
    });
  }
};

const clearCart = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    user.cart = [];
    await user.save();

    res.json({ success: true, message: "Cart cleared" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error clearing cart" });
  }
};

// Add this to userController.js
const getUserPets = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const user = await User.findOne({ email }).select('pets');
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, pets: user.pets });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching pets" });
  }
};



export { createUser, getUserProfile, updateUserProfile,addPetToUserProfile, addToCart, removeFromCart, getCartByEmail, clearCart, getUserPets };
