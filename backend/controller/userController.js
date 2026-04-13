import User from "../models/userModel.js";

export const updateCheckList = async(req , res)=>{
    try{
        const allowedFields = ['arrays', 'strings', 'twoPointers', 'slidingWindow', 
            'binarySearch', 'dynamicProgramming', 'graphs', 'trees', 
            'oop', 'os', 'dbms', 'computerNetworks', 'systemDesign', 'aptitude', 'sql'];
        
        const updates = {};
        allowedFields.forEach(field => {
            if(req.body[field] !== undefined){
                updates[`prepChecklist.${field}`] = req.body[field];
            }
        });
        
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { $set: updates },
            { new: true }
        ).select('-password');
        
        return res.status(200).json({
            success: true,
            message: "Checklist updated successfully",
            data: user
        })
    }catch(err){
        return res.status(500).json({
            succes : false,
            message : `Checklist updating error : ${err}`
        })
    }
}

export const updateProfile = async(req,res)=>{
    try{
        const allowedFields = [
            "fullName",
            "cgpa",
            "branch",
        ]

        const updatedData = {};

        allowedFields.forEach(field=>{
            if(req.body[field]!==undefined){
                updatedData[field] = req.body[field];
            }
        })

        if(req.file){
            updatedData.profilePic = req.file.path;
        }

        if (Object.keys(updatedData).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No fields provided for update"
            });
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { $set: updatedData },
            { new: true, runValidators: true }
        ).select('-password');


        res.status(200).json({
            success: true,
            message : "Profile updated successfully",
            data: updatedUser
        });
    }catch(err){
        return res.status(500).json({
            success : false,
            message : `Error in updating profile ${err}` 
        })
    }
}