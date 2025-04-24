import groomingModel from "../Models/groomingModel.js"; // ✅ lowercase
import fs from 'fs'


export const addGroomingService = async (req, res) => {
  const { name, description, price, photo } = req.body;

  try {
    const newService = new groomingModel({
      name,
      description, // should be an array of strings
      price,
      photo // this can be "spa.jpeg", etc.
    });

    const savedService = await newService.save();
    res.status(201).json({
      success: true,
      message: "Grooming service added successfully",
      data: savedService
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to add grooming service",
      error: error.message
    });
  }
};


export const getGroomingServices = async (req, res) => {
  try {
    const services = await groomingModel.find();
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve grooming services",
      error: error.message
    });
  }
};
