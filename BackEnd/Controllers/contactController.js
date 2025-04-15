import contactModel from "../Models/contactModel.js";
import fs from 'fs'

//add new contact message
const addContactMessage = async (req,res) => {
    const contact = new contactModel({
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        DOB:req.body.DOB,
        language:req.body.language,
        gender:req.body.gender,
        message:req.body.message
    })
    try {
        await contact.save();
        res.json({success:true, message:"Contact Message Added"})
    } catch (error) {
        res.json({success:false, message:"Error"})
    }
}

//list all contact messages 
const listContactMessages = async (req,res) => {
    try {
        const contactMessages = await contactModel.find({});
        res.json({success:true, data:contactMessages})
    } catch (error) {
        console.log(error);
        res.json({success:false, message:"Error"})
    }
}

export {addContactMessage, listContactMessages}