import User from '../models/userModel.js';
import bcrypt from "bcryptjs"
import sendToken from '../utils/sendToken.js';

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