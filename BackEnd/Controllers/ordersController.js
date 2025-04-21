import orderModel from "../Models/ordersModel.js";
import fs from 'fs'

//add new contact message
const addOrder = async (req,res) => {
    const order = new orderModel({
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        street:req.body.street,
        city:req.body.city,
        state:req.body.state,
        zipCode:req.body.zipCode,
        country:req.body.country,
        phone:req.body.phone,
        pet:req.body.pet,
        date:req.body.date,
        cartData:req.body.cartData,
        totalPrice:req.body.totalPrice,
    })
    try {
        await order.save();
        res.json({success:true, message:"Order Added"})
    } catch (error) {
        res.json({success:false, message:"Error"})
    }
}

//list all contact messages 
const listOrders = async (req,res) => {
    try {
        const orders = await orderModel.find({});
        res.json({success:true, data:orders})
    } catch (error) {
        console.log(error);
        res.json({success:false, message:"Error"})
    }
}

export {addOrder, listOrders}