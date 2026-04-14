import generateToken from "./generateTokens.js";

const sendToken = (user , res)=>{
    const token = generateToken(user._id);

    res.cookie('token' , token , {
        httpOnly : true,
        secure : process.env.NODE_ENV === "production",
        sameSite : 'lax',
        maxAge : 7*24*60*60*1000
    });

    return res.json({
        success : true,
        message : "Authenticated successfully",
        user: {
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            email: user.email,
            role: user.role,
            cgpa: user.cgpa,
            branch: user.branch,
            year: user.year,
            profilePic: user.profilePic,
            prepChecklist: user.prepChecklist
        }
    });
}

export default sendToken;