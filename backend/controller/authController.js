import User from '../models/userModel.js';
import bcrypt from "bcryptjs"
import sendToken from '../utils/sendToken.js';
import crypto from "crypto";
import OTP from '../models/otpModel.js';
import { sendOtpEmail } from '../utils/sendEmail.js';

export const register = async(req , res)=>{
    const {fullName , username , email , password , cgpa , branch , year} = req.body;
    if(!fullName || !username || !email || !password || !cgpa || !branch || !year){
        return res.status(400).json({
            success : false , 
            message : "Missing Details"
        })
    }
    try{
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if(existingUser){
            return res.status(409).json({
                success : false,
                message : existingUser.email === email 
                ? "Email already registered" 
                : "Username already taken"
            });
        }

        const hashedPassword = await bcrypt.hash(password , 10);
        const user = new User({
            fullName , 
            username , 
            email , 
            password : hashedPassword,
            cgpa,
            branch , 
            year
        });

        await user.save();

        return sendToken(user , res);

    }catch(err){
        return res.status(500).json({
            success : false, 
            message : `Registeration error : ${err}`
        });
    }
}

export const login = async(req , res)=>{
    const {email, password} = req.body;
    if(!email || !password){
        return res.status(400).json({
            success : false,
            message : "Missing details"
        })
    }

    try{
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({
                success : false,
                message : "User with entered email doesn't exists"
            });
        }

        const isMatch = await bcrypt.compare(password , user.password);
        if(!isMatch){
            return res.status(401).json({
                success : false,
                message : "Invalid details"
            });
        }

        return sendToken(user,res);

    }catch(err){
        return res.status(500).json({
            success : false,
            message : `Login error : ${err}`
        });
    }
}

export const logout = async(req , res)=>{
    res.cookie('token' , '' , {
        httpOnly : true,
        expires : new Date(0)
    })

    return res.status(200).json({
        success : true,
        message : 'Logged out successfully'
    })
}

export const forgetPassword = async(req,res)=>{
    try{
        const {email} = req.body;
        if(!email){
            return res.status(400).json({
                status : false,
                message : "Email is required"
            })
        }

        const user = await User.findOne({email : email.toLowerCase()});
        if(!user){
            return res.status(400).json({
                status : false,
                message : "User with this email doesn't exist"
            })
        }

        const otp = crypto.randomInt(100000, 999999).toString();
        const salt = await bcrypt.genSalt(10);
        const hashedOtp = await bcrypt.hash(otp,salt);

        await OTP.deleteMany({email : email.toLowerCase()});

        await OTP.create({
            email : email.toLowerCase(),
            otp : hashedOtp
        });

        await sendOtpEmail(user.email,otp);

        return res.status(200).json({
            success : true,
            message : "A secure verification OTP has been dispatched to your email."
        })
    }catch(err){
        return res.status(500).json({
            success : false,
            message : `Email sending error : ${err}`
        })
    }
}

export const resetPassword = async(req,res)=>{
    try{
        const {email , otp , newPassword} = req.body;

        if(!email || !otp || !newPassword){
            return res.status(400).json({
                success : false,
                message : "All fields are required"
            })
        }

        const activeOtpRecord = await OTP.findOne({email : email.toLowerCase()});
        if(!activeOtpRecord){
            return res.status(400).json({
                success : false,
                message : "The otp has been expired or is invalid. Please request a new OTP"
            })
        } 

        const isMatch = await bcrypt.compare(otp , activeOtpRecord.otp);

        if(!isMatch){
            return res.status(400).json({
                success : false,
                message : "Invalid verification code"
            })
        }

        const user = await User.findOne({email : email.toLowerCase()});
        if(!user){
            return res.status(400).json({
                success : false,
                message : "User link broken during processing"
            })
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword,salt);
        await user.save();

        await OTP.deleteOne({
            _id : activeOtpRecord._id
        });

        return res.status(200).json({
            success : true,
            message : "Your password has been securely updated. You can now log in."
        });
    }catch(err){
        return res.status(500).json({
            success : false,
            message : `Reseting password error : ${err}`
        })
    }
}