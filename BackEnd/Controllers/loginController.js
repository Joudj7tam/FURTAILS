import loginModel from "../Models/loginModel.js";
import bcrypt from "bcrypt";
import validator from "validator";

const signUp = async (req, res) => {
    const {email, phoneNum, password} = req.body;
    try {
        //check is the user already exists
        const exists = await loginModel.findOne({email});
        if(exists){
            return res.json({success: false, message:"User already exists"})
        }

        // validating email format & strong password
        if(!validator.isEmail(email)){
            return res.json({success: false, message:"Please enter a valid email"})
        }

        if(password.length<8){
            return res.json({success: false, message:"Please enter a strong password"})
        }

        // validating phone number format
        const phoneRegex = /^05\d{8}$/; 
        if(!phoneRegex.test(phoneNum)) {
            return res.json({success: false, message:"Phone number must be 10 digits starting with 05"})
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt);

        const newLogin = new loginModel({
            email: email,
            phoneNum: phoneNum,
            password: hashedPassword
        })

        const user = await newLogin.save()
        res.json({ success: true, message: "Account created successfully" });

        
    } catch (error) {
        console.log(error);
        res.json({success: false, message:"Error"})
    }
}

const signIn = async (req, res) => {
    const {email, password} = req.body;
    try {
        //check if email exist
        const user = await loginModel.findOne({email})

        if (!user){
           return res.json({success: false, message:"User doesn't exist"})
        }

        //check if password match
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch){
           return res.json({success: false, message:"Invalid password"})
        }

        res.json({success: true, message: "User sign in successfully"})

    } catch (error) {
        console.log(error);
        return res.json({success: false, message:"Error"})
    }
}

const resetPassword = async (req, res) => {
    const { email, newPassword, confirmPassword } = req.body;

    try {
        // Validate email and password input
        if (!email || !newPassword || !confirmPassword) {
            return res.json({ success: false, message: "All fields are required" });
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }

        if (newPassword.length < 8) {
            return res.json({ success: false, message: "Password must be at least 8 characters" });
        }

        if (newPassword !== confirmPassword) {
            return res.json({ success: false, message: "Passwords do not match" });
        }

        // Check if user exists
        const user = await loginModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password
        user.password = hashedPassword;
        await user.save();

        res.json({ success: true, message: "Password reset successfully" });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "An error occurred" });
    }
};


export {signUp, signIn, resetPassword};