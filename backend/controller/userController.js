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